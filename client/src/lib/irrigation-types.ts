export type {
  IrrigationParams,
  CalculatedValues,
} from "@shared/schema";

export { calculateSystem } from "@shared/schema";

import type { IrrigationParams } from "@shared/schema";

export const defaultParams: IrrigationParams = {
  plotLength: 10,
  plotWidth: 5,
  lateralSpacing: 0.5,
  emitterSpacing: 0.3,
  emitterFlowRate: 2,
  mainlineDiameter: 25,
  lateralDiameter: 16,
  pumpPressure: 2.0,
  tankCapacity: 1000,
};
