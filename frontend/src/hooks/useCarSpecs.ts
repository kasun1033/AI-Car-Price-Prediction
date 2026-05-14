import { useMemo } from "react";
import carSpecsRaw from "@/data/car_brand_model_specs_v2.json";

export interface ModelSpec {
    model: string;
    fuel_types: string[];
    transmission: string[];
    engine_cc: number[];
}

export type CarSpecsData = Record<string, ModelSpec[]>;

// Hook - cascading dropdown options based on current selections
const carSpecs = carSpecsRaw as CarSpecsData;

export function useCarSpecs(selectedBrand: string, selectedModel: string) {
    //  All brand names
    const brands = useMemo(
        () => Object.keys(carSpecs).sort(),
        [],
    );

    // Models for the chosen brand
    const models = useMemo(() => {
        if (!selectedBrand) return [];
        return (carSpecs[selectedBrand] ?? []).map((s) => s.model).sort();
    }, [selectedBrand]);

    // Spec entry for the chosen model
    const modelSpec = useMemo<ModelSpec | null>(() => {
        if (!selectedBrand || !selectedModel) return null;
        return (
            carSpecs[selectedBrand]?.find((s) => s.model === selectedModel) ??
            null
        );
    }, [selectedBrand, selectedModel]);

    // Fuel types → from model spec, or all unique values for brand
    const fuelTypes = useMemo(() => {
        if (modelSpec) return [...modelSpec.fuel_types].sort();
        if (!selectedBrand) return [];
        const all = carSpecs[selectedBrand]?.flatMap((s) => s.fuel_types) ?? [];
        return [...new Set(all)].sort();
    }, [modelSpec, selectedBrand]);

    // Transmissions → from model spec, or all unique for brand
    const transmissions = useMemo(() => {
        if (modelSpec) return [...modelSpec.transmission].sort();
        if (!selectedBrand) return [];
        const all =
            carSpecs[selectedBrand]?.flatMap((s) => s.transmission) ?? [];
        return [...new Set(all)].sort();
    }, [modelSpec, selectedBrand]);

    // Engine CCs → from model spec, or all unique for brand
    const engineCCs = useMemo(() => {
        if (modelSpec) return [...modelSpec.engine_cc].sort((a, b) => a - b);
        if (!selectedBrand) return [];
        const all =
            carSpecs[selectedBrand]?.flatMap((s) => s.engine_cc) ?? [];
        return [...new Set(all)].sort((a, b) => a - b);
    }, [modelSpec, selectedBrand]);

    return { brands, models, fuelTypes, transmissions, engineCCs, modelSpec };
}