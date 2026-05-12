"""
ML Model Service — singleton that loads the trained car-price model once
and exposes a **predict()** helper with strict input validation.
"""
from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Any

import joblib
import pandas as pd

logger = logging.getLogger(__name__)

# model paths
_DEFAULT_MODEL_DIR = Path(__file__).resolve().parent.parent / "models"
_DEFAULT_MODEL_PATH = _DEFAULT_MODEL_DIR / "car_price_model.pkl"
_DEFAULT_COLUMNS_PATH = _DEFAULT_MODEL_DIR / "model_columns.pkl"

class ModelService:

    _instance: "ModelService | None" = None

    model: Any = None
    model_columns: list[str] = []
    supported_brands: set[str] = set()
    supported_models: set[str] = set()
    has_brand_other: bool = False

    def __new__(cls) -> "ModelService":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    # Startup loader — call once from lifespan / startup event    
    def load(self) -> None:
        """Load model and metadata from disk. Idempotent."""
        if self.model is not None:
            logger.info("ModelService already loaded — skipping.")
            return
        
        try:
            model_path = _DEFAULT_MODEL_PATH
            columns_path = _DEFAULT_COLUMNS_PATH

            if not model_path.exists():
                raise FileNotFoundError(f"Model file not found: {model_path}")
            if not columns_path.exists():
                raise FileNotFoundError(f"Columns file not found: {columns_path}")

            # load model and features
            self.model = joblib.load(model_path)
            self.model_columns = list(joblib.load(columns_path))

            logger.info(f"Loaded model from {model_path}")
            logger.info(f"Loaded columns from {columns_path}")

            # extract metadata
            self.supported_brands = {
                col.replace("Brand_", "")
                for col in self.model_columns
                if col.startswith("Brand_")
            }
            self.supported_models = {
                col.replace("Model_", "")
                for col in self.model_columns
                if col.startswith("Model_")
            }
            self.has_brand_other = "Brand_OTHER" in self.model_columns

            logger.info(
                "ModelService ready — %d columns, %d brands, %d models",
                len(self.model_columns),
                len(self.supported_brands),
                len(self.supported_models),
            )

        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise

    # get metadata of the model -to get the idea of what are the columns in the model and limits
    # Scans model feature columns to extract and return all supported categorical options, filling in any missing values manually, along with usage notes for API consumers.
    def get_metadata(self) -> dict[str, Any]:
        """Return supported options extracted from model columns."""
        gears: set[str] = set()
        fuel_types: set[str] = set()
        conditions: set[str] = set()

        for col in self.model_columns:
            if col.startswith("Gear_"):
                gears.add(col.replace("Gear_", ""))
            elif col.startswith("Fuel Type_"):
                fuel_types.add(col.replace("Fuel Type_", ""))
            elif col.startswith("Condition_"):
                conditions.add(col.replace("Condition_", "")) 

        # fill in missing values manually
        if "Gear_Manual" in {f"Gear_{g}" for g in gears}:
            gears.add("Automatic") 
            gears.add("Tiptronic")  
        fuel_types.add("Diesel")  
        conditions.add("Brand New")

        return {
            "brands_count": len(self.supported_brands),
            "models_count": len(self.supported_models),
            "gears": sorted(gears),
            "fuel_types": sorted(fuel_types),
            "conditions": sorted(conditions),
            "boolean_fields": ["Yes", "No", "Not Available"],
            "notes": [
                "The model treats 'Automatic' and 'Tiptronic' identically (Manual vs Not-Manual).",
                "Some categories may produce less-accurate results if they were rare in training data.",
            ],
        } 


    def predict(self, raw_input: dict[str, Any]) -> tuple[float, list[str]]:
        """Run prediction and return ``(predicted_price_lkr, warnings)``.
        Parameters
        ----------
        raw : dict
            Keys: brand, model, yom, engine_cc, millage_km, gear, fuel_type, condition,
            air_condition, power_steering, power_mirror, power_window
        """
        try:
            warnings: list[str] = []

            brand = raw_input["brand"]
            car_model = raw_input["model"]
            gear = raw_input["gear"]
            yom = int(raw_input["yom"])
            engine_cc = int(raw_input["engine_cc"])
            millage_km = int(raw_input["millage_km"])

            # brand validation ( ex - Toyota, Honda, Suzuki)
            # ---- !!change if client want to show a error when brand is not supported 
            if brand not in self.supported_brands:
                if self.has_brand_other:
                    warnings.append(
                        f"Brand '{brand}' is not directly supported. "
                        f"Mapping to 'OTHER' — prediction accuracy may be reduced."
                    )
                    brand = "OTHER"
                else:
                    raise ValueError(
                        f"Brand '{brand}' is not supported by this model yet. "
                        f"Please choose a supported brand."
                    )

            # model validation ( ex - Aqua, Vitz, Axio)
            if car_model not in self.supported_models:
                raise ValueError(
                    f"Model '{car_model}' is not supported by this model yet. "
                    f"Please choose a supported model."
                )

            # gear limitation
            if gear in ("Automatic", "Tiptronic"):
                warnings.append(
                    "Note: this model treats 'Automatic' and 'Tiptronic' the same "
                    "internally (Manual vs Not-Manual)."
                )

            # numeric guardrails
            if yom < 1980:
                warnings.append(
                    f"Year of manufacture ({yom}) is very old. "
                    f"Predictions outside typical ranges may be less accurate."
                )
            if millage_km > 400_000:
                warnings.append(
                    f"Mileage ({millage_km} km) is exceptionally high. "
                    f"Prediction accuracy may be reduced."
                )
            if engine_cc > 6000:
                warnings.append(
                    f"Engine capacity ({engine_cc} cc) is very large. "
                    f"Prediction accuracy may be reduced."
                )

            # build one-row DataFrame (same keys as training) 
            row = {
                "YOM": yom,
                "Engine (cc)": engine_cc,
                "Millage(KM)": millage_km,
                "Brand": brand,
                "Model": car_model,
                "Gear": gear,
                "Fuel Type": raw_input["fuel_type"],
                "Condition": raw_input["condition"],
                "AIR CONDITION": raw_input["air_condition"],
                "POWER STEERING": raw_input["power_steering"],
                "POWER MIRROR": raw_input["power_mirror"],
                "POWER WINDOW": raw_input["power_window"],
            } 

            data_frame = pd.DataFrame([row])   

            # convert categorical columns to dummy variables
            # one-hot encode (same as training)
            data_frame = pd.get_dummies(data_frame, drop_first=True)

            # reindex to match model's expected columns
            data_frame = data_frame.reindex(columns=self.model_columns, fill_value=False)
            data_frame = data_frame.astype(int)

            # predict
            prediction : float = float(self.model.predict(data_frame)[0])

            if prediction < 0:
                warnings.append(
                    "The raw prediction was negative and has been clamped to 0."
                )
                prediction = 0.0

            return round(prediction, 2), warnings         

            
        except Exception as e:
            logger.error(f"Failed to predict car price: {e}")
            raise ValueError(f"Failed to predict car price: {str(e)}")
                          

model_service = ModelService()       