"use client";

import { useState } from "react";
import { MetadataOut, PredictionIn } from "@/store/prediction/types";
import { Loader2, TrendingUp, ChevronDown, Zap, Gauge } from "lucide-react";
import SearchableSelect from "./SearchableSelect";
import { useCarSpecs } from "@/hooks/useCarSpecs";

interface TheFormProps {
    formData: PredictionIn;
    isLoading: boolean;
    isMetadataLoading: boolean;
    metadata: MetadataOut | null;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => void;
    onFieldChange: (name: string, value: string | number) => void;
}

function SelectField({
    id,
    label,
    name,
    value,
    options,
    disabled,
    placeholder,
    onChange,
    icon,
    error,
}: {
    id: string;
    label: string;
    name: string;
    value: string;
    options: string[];
    disabled?: boolean;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    icon?: React.ReactNode;
    error?: string;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={id}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700"
            >
                {icon && <span className="text-blue-500 w-3.5 h-3.5">{icon}</span>}
                {label}
            </label>
            <div className="relative">
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled || options.length === 0}
                    className={`
                        w-full appearance-none px-3 py-2 pr-8 text-sm
                        border rounded-lg
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        transition-all outline-none text-gray-900
                        bg-gray-50 hover:bg-white focus:bg-white
                        cursor-pointer
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${error ? "border-red-400 ring-1 ring-red-300" : "border-gray-300"}
                    `}
                >
                    <option value="">{placeholder}</option>
                    {options.map((o) => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {error && (
                <p className="text-[11px] text-red-500 font-medium">{error}</p>
            )}
            {/* Hint badge when options are limited by parent selection */}
            {!error && options.length > 0 && options.length <= 4 && value === "" && (
                <p className="text-[10px] text-blue-500 font-medium">
                    {options.length} option{options.length > 1 ? "s" : ""} available
                </p>
            )}
        </div>
    );
}

type FormErrors = Partial<Record<keyof PredictionIn, string>>;

export default function TheForm({
    formData,
    isLoading,
    isMetadataLoading,
    metadata,
    onSubmit,
    onChange,
    onFieldChange,
}: TheFormProps) {
    const [errors, setErrors] = useState<FormErrors>({});

    // Cascading data from JSON 
    const {
        brands,
        models,
        fuelTypes,
        transmissions,
        engineCCs,
    } = useCarSpecs(formData.brand, formData.model);

    // consolog the brand count 
    console.log("Brand count:", brands.length);

    // Clear an individual field error when its value becomes non-empty
    const clearError = (field: keyof PredictionIn) => {
        setErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    // Custom validation — returns true if valid
    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.brand) newErrors.brand = "Brand is required";
        if (!formData.model) newErrors.model = "Model is required";
        if (!formData.fuel_type) newErrors.fuel_type = "Fuel type is required";
        if (!formData.gear) newErrors.gear = "Transmission is required";
        if (!formData.yom) newErrors.yom = "Year of manufacture is required";
        if (!formData.millage_km) newErrors.millage_km = "Mileage is required";
        if (!formData.condition) newErrors.condition = "Condition is required";
        if (!formData.engine_cc) newErrors.engine_cc = "Engine CC is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(e);
        }
    };

    const handleBrandChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        onFieldChange("brand", e.target.value); // set brand 
        if (e.target.value) clearError("brand");
        // Reset model, fuel, gear, engine_cc when brand changes
        onFieldChange("model", "");
        onFieldChange("fuel_type", "");
        onFieldChange("gear", "");
        onFieldChange("engine_cc", 0);
    };

    const handleModelChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        onFieldChange("model", e.target.value); // set model
        if (e.target.value) clearError("model");
        // Reset fuel, gear, engine_cc when model changes
        onFieldChange("fuel_type", "");
        onFieldChange("gear", "");
        onFieldChange("engine_cc", 0);
    };

    // set fuel type
    const handleFuelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFieldChange("fuel_type", e.target.value);
        if (e.target.value) clearError("fuel_type");
    };

    // set gear type
    const handleGearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFieldChange("gear", e.target.value);
        if (e.target.value) clearError("gear");
    };

    // set engine cc
    const handleEngineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFieldChange("engine_cc", Number(e.target.value));
        if (e.target.value) clearError("engine_cc");
    };

    return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 h-full overflow-y-auto thin-scrollbar flex flex-col">
            <div className="sticky top-0 z-10 bg-white px-4 sm:px-6 pt-4 sm:pt-5 pb-2 border-b border-gray-100">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                    Car Details
                </h2>
                <p className="text-xs text-gray-500 ">
                    Select brand first — options will narrow automatically
                </p>
            </div>

            <form
                onSubmit={handleFormSubmit}
                noValidate
                className="flex-1 px-4 sm:px-6 py-4 space-y-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {/* Brand — searchable */}
                    <SearchableSelect
                        id="brand"
                        name="brand"
                        label="Brand"
                        placeholder="Search brand..."
                        options={brands}                 
                        value={formData.brand}
                        disabled={isMetadataLoading}
                        error={errors.brand}
                        onChange={handleBrandChange}
                    />

                    {/* Model — searchable, filtered by brand */}
                    <div className="relative">
                        <SearchableSelect
                            id="model"
                            name="model"
                            label="Model"
                            placeholder={
                                !formData.brand
                                    ? "Select brand first"
                                    : `Search ${models.length} models...`
                            }
                            options={models}               
                            value={formData.model}
                            disabled={isMetadataLoading || !formData.brand}
                            error={errors.model}
                            onChange={handleModelChange}
                        />
                        {formData.brand && models.length > 0 && (
                            <span className="absolute -top-0 right-0 text-[10px] text-blue-500 font-semibold">
                                {models.length} models
                            </span>
                        )}
                    </div>
                </div>

                {formData.model && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                        <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>
                            Fuel, transmission &amp; engine options filtered for{" "}
                            <strong>{formData.brand} {formData.model}</strong>
                        </span>
                    </div>
                )}

                {/* Fuel + Transmission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <SelectField
                        id="fuel_type"
                        name="fuel_type"
                        label="Fuel Type"
                        placeholder={!formData.brand ? "Select brand first" : "Select Fuel Type"}
                        options={fuelTypes.map((f) => f.charAt(0).toUpperCase() + f.slice(1))}
                        value={formData.fuel_type}
                        disabled={!formData.brand}
                        error={errors.fuel_type}
                        onChange={handleFuelChange}
                    />

                    <SelectField
                        id="gear"
                        name="gear"
                        label="Transmission"
                        placeholder={!formData.brand ? "Select brand first" : "Select Transmission"}
                        options={transmissions.map((t) => t.charAt(0).toUpperCase() + t.slice(1))}
                        value={formData.gear}
                        disabled={!formData.brand}
                        error={errors.gear}
                        onChange={handleGearChange}
                    />
                </div>

                {/* Year + Mileage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="year" className="text-xs sm:text-sm font-semibold text-gray-700">
                            Year of Manufacture
                        </label>
                        <input
                            type="number"
                            id="year"
                            name="yom"
                            min="1990"
                            max="2026"
                            value={formData.yom || ""}
                            onChange={(e) => {
                                onChange(e);
                                if (e.target.value) clearError("yom");
                            }}
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white ${errors.yom ? "border-red-400 ring-1 ring-red-300" : "border-gray-300"}`}
                            placeholder="e.g. 2019"
                        />
                        {errors.yom && (
                            <p className="text-[11px] text-red-500 font-medium mt-1">{errors.yom}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="mileage" className="text-xs sm:text-sm font-semibold text-gray-700">
                            Mileage (km)
                        </label>
                        <input
                            type="number"
                            id="mileage"
                            name="millage_km"
                            min="0"
                            value={formData.millage_km || ""}
                            onChange={(e) => {
                                onChange(e);
                                if (e.target.value) clearError("millage_km");
                            }}
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white ${errors.millage_km ? "border-red-400 ring-1 ring-red-300" : "border-gray-300"}`}
                            placeholder="e.g. 50000"
                        />
                        {errors.millage_km && (
                            <p className="text-[11px] text-red-500 font-medium mt-1">{errors.millage_km}</p>
                        )}
                    </div>
                </div>

                {/* Row 4: Condition + Engine CC */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="condition" className="text-xs sm:text-sm font-semibold text-gray-700">
                            Condition
                        </label>
                        <div className="relative">
                            <select
                                id="condition"
                                name="condition"
                                value={formData.condition}
                                onChange={(e) => {
                                    onChange(e);
                                    if (e.target.value) clearError("condition");
                                }}
                                disabled={isMetadataLoading}
                                className={`w-full appearance-none px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 bg-gray-50 hover:bg-white focus:bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${errors.condition ? "border-red-400 ring-1 ring-red-300" : "border-gray-300"}`}
                            >
                                <option value="">Select Condition</option>
                                {metadata?.conditions.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        {errors.condition && (
                            <p className="text-[11px] text-red-500 font-medium mt-1">{errors.condition}</p>
                        )}
                    </div>

                    {/* Engine CC — */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="engine_cc" className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700">
                            <Gauge className="w-3.5 h-3.5 text-blue-500" />
                            Engine (CC)
                        </label>

                        {engineCCs.length > 0 ? (
                            <div className="relative">
                                <select
                                    id="engine_cc"
                                    name="engine_cc"
                                    value={formData.engine_cc || ""}
                                    onChange={handleEngineChange}
                                    className={`w-full appearance-none px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 bg-gray-50 hover:bg-white focus:bg-white cursor-pointer ${errors.engine_cc ? "border-red-400 ring-1 ring-red-300" : "border-gray-300"}`}
                                >
                                    <option value="">Select Engine CC</option>
                                    {engineCCs.map((cc) => (
                                        <option key={cc} value={cc}>
                                            {cc === 0 ? "Electric (N/A)" : `${cc.toLocaleString()} cc`}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <span className="absolute -top-5 right-0 text-[10px] text-blue-500 font-semibold">
                                    {engineCCs.length} option{engineCCs.length > 1 ? "s" : ""}
                                </span>
                                {errors.engine_cc && (
                                    <p className="text-[11px] text-red-500 font-medium mt-0.5">{errors.engine_cc}</p>
                                )}
                            </div>
                        ) : (
                            /* Free-type fallback if no brand selected yet */
                            <>
                            <input
                                type="number"
                                id="engine_cc"
                                name="engine_cc"
                                min="0"
                                value={formData.engine_cc || ""}
                                onChange={(e) => {
                                    onChange(e);
                                    if (e.target.value) clearError("engine_cc");
                                }}
                                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white ${errors.engine_cc ? "border-red-400 ring-1 ring-red-300" : "border-gray-300"}`}
                                placeholder="e.g. 1500"
                            />
                            {errors.engine_cc && (
                                <p className="text-[11px] text-red-500 font-medium mt-1">{errors.engine_cc}</p>
                            )}
                            </>
                        )}
                    </div>
                </div>

                {/* Row 5: Boolean features */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Features
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {(
                            [
                                { id: "air_condition", label: "A/C" },
                                { id: "power_steering", label: "P. Steering" },
                                { id: "power_mirror", label: "P. Mirror" },
                                { id: "power_window", label: "P. Window" },
                            ] as { id: keyof typeof formData; label: string }[]
                        ).map(({ id, label }) => (
                            <div key={id} className="flex flex-col gap-1.5">
                                <label htmlFor={id} className="text-xs font-semibold text-gray-700">
                                    {label}
                                </label>
                                <div className="relative">
                                    <select
                                        id={id}
                                        name={id}
                                        value={formData[id] as string}
                                        onChange={onChange}
                                        className="w-full appearance-none px-3 py-2 pr-7 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 bg-gray-50 hover:bg-white focus:bg-white cursor-pointer"
                                    >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-1">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 sm:py-3 px-6 rounded-lg text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <TrendingUp className="w-5 h-5" />
                                Predict Price
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
