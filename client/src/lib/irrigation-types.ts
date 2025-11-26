export interface IrrigationParams {
  plotLength: number;
  plotWidth: number;
  lateralSpacing: number;
  emitterSpacing: number;
  emitterFlowRate: number;
  mainlineDiameter: number;
  lateralDiameter: number;
  pumpPressure: number;
  tankCapacity: number;
}

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
