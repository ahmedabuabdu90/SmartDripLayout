import { z } from "zod";

export const irrigationParamsSchema = z.object({
  plotLength: z.number().min(1).max(100),
  plotWidth: z.number().min(1).max(50),
  lateralSpacing: z.number().min(0.1).max(5),
  emitterSpacing: z.number().min(0.1).max(2),
  emitterFlowRate: z.number().min(0.5).max(10),
  mainlineDiameter: z.number().min(12).max(75),
  lateralDiameter: z.number().min(8).max(32),
  pumpPressure: z.number().min(0.5).max(6),
  tankCapacity: z.number().min(50).max(50000),
});

export type IrrigationParams = z.infer<typeof irrigationParamsSchema>;

export const exportRequestSchema = z.object({
  params: irrigationParamsSchema,
  format: z.enum(["svg", "dxf"]),
});

export type ExportRequest = z.infer<typeof exportRequestSchema>;

export interface CalculatedValues {
  totalArea: number;
  numLaterals: number;
  emittersPerLateral: number;
  totalEmitters: number;
  totalFlowRate: number;
  flowRatePerLateral: number;
  irrigationTime: number;
  totalDynamicHead: number;
  waterRequired: number;
}

export function calculateSystem(params: IrrigationParams): CalculatedValues {
  const totalArea = params.plotLength * params.plotWidth;
  const numLaterals = Math.floor(params.plotWidth / params.lateralSpacing);
  const emittersPerLateral = Math.floor(params.plotLength / params.emitterSpacing);
  const totalEmitters = numLaterals * emittersPerLateral;
  const totalFlowRate = (totalEmitters * params.emitterFlowRate) / 60;
  const flowRatePerLateral = (emittersPerLateral * params.emitterFlowRate) / 60;
  const waterRequired = totalEmitters * params.emitterFlowRate;
  const irrigationTime = params.tankCapacity / waterRequired;
  const frictionLoss = 0.4;
  const elevationHead = 0.2;
  const totalDynamicHead = params.pumpPressure - frictionLoss - elevationHead;

  return {
    totalArea,
    numLaterals,
    emittersPerLateral,
    totalEmitters,
    totalFlowRate,
    flowRatePerLateral,
    irrigationTime,
    totalDynamicHead,
    waterRequired,
  };
}
