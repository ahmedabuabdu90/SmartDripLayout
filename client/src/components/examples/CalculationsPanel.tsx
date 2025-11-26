import { CalculationsPanel } from "../CalculationsPanel";
import { defaultParams, calculateSystem } from "@/lib/irrigation-types";

export default function CalculationsPanelExample() {
  const calculations = calculateSystem(defaultParams);
  
  return (
    <div className="w-80 h-[600px] border rounded-md overflow-hidden">
      <CalculationsPanel params={defaultParams} calculations={calculations} />
    </div>
  );
}
