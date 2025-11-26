import type { IrrigationParams } from "./irrigation-types";

export interface Preset {
  id: string;
  name: string;
  description: string;
  category: "residential" | "commercial" | "garden" | "agricultural";
  params: IrrigationParams;
}

export const presets: Preset[] = [
  {
    id: "residential-small",
    name: "Small Residential Garden",
    description: "Ideal for home gardens and small lawns (25m²)",
    category: "residential",
    params: {
      plotLength: 5,
      plotWidth: 5,
      lateralSpacing: 0.4,
      emitterSpacing: 0.3,
      emitterFlowRate: 2,
      mainlineDiameter: 20,
      lateralDiameter: 16,
      pumpPressure: 1.5,
      tankCapacity: 500,
    },
  },
  {
    id: "residential-medium",
    name: "Medium Residential Plot",
    description: "Standard residential irrigation (50m²)",
    category: "residential",
    params: {
      plotLength: 10,
      plotWidth: 5,
      lateralSpacing: 0.5,
      emitterSpacing: 0.3,
      emitterFlowRate: 2,
      mainlineDiameter: 25,
      lateralDiameter: 16,
      pumpPressure: 2.0,
      tankCapacity: 1000,
    },
  },
  {
    id: "residential-large",
    name: "Large Residential Area",
    description: "Extended residential coverage (100m²)",
    category: "residential",
    params: {
      plotLength: 10,
      plotWidth: 10,
      lateralSpacing: 0.5,
      emitterSpacing: 0.3,
      emitterFlowRate: 2,
      mainlineDiameter: 32,
      lateralDiameter: 16,
      pumpPressure: 2.5,
      tankCapacity: 2000,
    },
  },
  {
    id: "vegetable-garden",
    name: "Vegetable Garden",
    description: "Optimized for vegetable beds with closer spacing",
    category: "garden",
    params: {
      plotLength: 8,
      plotWidth: 4,
      lateralSpacing: 0.3,
      emitterSpacing: 0.25,
      emitterFlowRate: 1.5,
      mainlineDiameter: 20,
      lateralDiameter: 12,
      pumpPressure: 1.5,
      tankCapacity: 500,
    },
  },
  {
    id: "greenhouse",
    name: "Greenhouse Setup",
    description: "Dense emitter placement for greenhouse crops",
    category: "garden",
    params: {
      plotLength: 12,
      plotWidth: 6,
      lateralSpacing: 0.25,
      emitterSpacing: 0.2,
      emitterFlowRate: 1,
      mainlineDiameter: 25,
      lateralDiameter: 12,
      pumpPressure: 2.0,
      tankCapacity: 1000,
    },
  },
  {
    id: "orchard",
    name: "Fruit Orchard",
    description: "Wider spacing for tree irrigation",
    category: "agricultural",
    params: {
      plotLength: 20,
      plotWidth: 15,
      lateralSpacing: 3,
      emitterSpacing: 2,
      emitterFlowRate: 4,
      mainlineDiameter: 40,
      lateralDiameter: 20,
      pumpPressure: 3.0,
      tankCapacity: 5000,
    },
  },
  {
    id: "commercial-landscape",
    name: "Commercial Landscape",
    description: "Large commercial property irrigation",
    category: "commercial",
    params: {
      plotLength: 25,
      plotWidth: 20,
      lateralSpacing: 0.6,
      emitterSpacing: 0.4,
      emitterFlowRate: 2.5,
      mainlineDiameter: 50,
      lateralDiameter: 20,
      pumpPressure: 3.5,
      tankCapacity: 10000,
    },
  },
  {
    id: "rooftop-garden",
    name: "Rooftop Garden",
    description: "Compact system for urban rooftop gardens",
    category: "garden",
    params: {
      plotLength: 6,
      plotWidth: 3,
      lateralSpacing: 0.3,
      emitterSpacing: 0.25,
      emitterFlowRate: 1,
      mainlineDiameter: 16,
      lateralDiameter: 12,
      pumpPressure: 1.2,
      tankCapacity: 200,
    },
  },
];

export function getPresetsByCategory(category: Preset["category"]): Preset[] {
  return presets.filter((p) => p.category === category);
}

export function getPresetById(id: string): Preset | undefined {
  return presets.find((p) => p.id === id);
}
