import { useState } from "react";
import { ParameterPanel } from "../ParameterPanel";
import { defaultParams, type IrrigationParams } from "@/lib/irrigation-types";

export default function ParameterPanelExample() {
  const [params, setParams] = useState<IrrigationParams>(defaultParams);
  
  return (
    <div className="w-80 h-[600px] border rounded-md overflow-hidden">
      <ParameterPanel params={params} onChange={setParams} />
    </div>
  );
}
