import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { ParameterPanel } from "@/components/ParameterPanel";
import { CalculationsPanel } from "@/components/CalculationsPanel";
import { IrrigationCanvas } from "@/components/IrrigationCanvas";
import { ExportPanel } from "@/components/ExportPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings2, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import {
  defaultParams,
  calculateSystem,
  type IrrigationParams,
} from "@/lib/irrigation-types";

export default function IrrigationDesigner() {
  const [params, setParams] = useState<IrrigationParams>(defaultParams);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("params");

  const calculations = useMemo(() => calculateSystem(params), [params]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`relative transition-all duration-300 border-r bg-sidebar ${
            leftPanelOpen ? "w-80" : "w-0"
          }`}
        >
          {leftPanelOpen && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex flex-col h-full"
            >
              <div className="flex items-center justify-between gap-2 px-4 py-2 border-b">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="params"
                    className="text-xs"
                    data-testid="tab-parameters"
                  >
                    <Settings2 className="w-3.5 h-3.5 mr-1.5" />
                    Parameters
                  </TabsTrigger>
                  <TabsTrigger
                    value="calc"
                    className="text-xs"
                    data-testid="tab-calculations"
                  >
                    <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                    Calculations
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="params" className="flex-1 m-0 overflow-hidden">
                <ParameterPanel params={params} onChange={setParams} />
              </TabsContent>
              <TabsContent value="calc" className="flex-1 m-0 overflow-hidden">
                <CalculationsPanel params={params} calculations={calculations} />
              </TabsContent>
            </Tabs>
          )}

          <Button
            size="icon"
            variant="secondary"
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full shadow-md"
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            data-testid="button-toggle-panel"
          >
            {leftPanelOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-card">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Layout Preview</span>
              <span className="mx-2">|</span>
              <span className="font-mono">
                {calculations.numLaterals} laterals × {calculations.emittersPerLateral} emitters
              </span>
            </div>
            <ExportPanel params={params} calculations={calculations} />
          </div>

          <div className="flex-1 overflow-hidden">
            <IrrigationCanvas params={params} calculations={calculations} />
          </div>
        </div>
      </div>
    </div>
  );
}
