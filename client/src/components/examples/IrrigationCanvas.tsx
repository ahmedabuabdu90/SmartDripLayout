import { IrrigationCanvas } from "../IrrigationCanvas";
import { defaultParams, calculateSystem } from "@/lib/irrigation-types";

export default function IrrigationCanvasExample() {
  const calculations = calculateSystem(defaultParams);
  
  return (
    <div className="w-full h-[500px] border rounded-md overflow-hidden">
      <IrrigationCanvas params={defaultParams} calculations={calculations} />
    </div>
  );
}
