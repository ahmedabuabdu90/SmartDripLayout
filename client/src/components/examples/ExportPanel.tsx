import { ExportPanel } from "../ExportPanel";
import { defaultParams, calculateSystem } from "@/lib/irrigation-types";
import { Toaster } from "@/components/ui/toaster";

export default function ExportPanelExample() {
  const calculations = calculateSystem(defaultParams);
  
  return (
    <>
      <ExportPanel params={defaultParams} calculations={calculations} />
      <Toaster />
    </>
  );
}
