import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RotateCcw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { IrrigationParams } from "@/lib/irrigation-types";
import { defaultParams } from "@/lib/irrigation-types";

interface ParameterPanelProps {
  params: IrrigationParams;
  onChange: (params: IrrigationParams) => void;
}

interface ParameterInputProps {
  label: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  testId: string;
  onChange: (value: number) => void;
}

function ParameterInput({
  label,
  value,
  unit,
  min = 0,
  max,
  step = 0.1,
  testId,
  onChange,
}: ParameterInputProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="font-mono text-sm"
          data-testid={testId}
        />
        <span className="text-xs text-muted-foreground font-mono w-12 shrink-0">
          {unit}
        </span>
      </div>
    </div>
  );
}

export function ParameterPanel({ params, onChange }: ParameterPanelProps) {
  const updateParam = <K extends keyof IrrigationParams>(
    key: K,
    value: IrrigationParams[K]
  ) => {
    onChange({ ...params, [key]: value });
  };

  const resetToDefaults = () => {
    onChange(defaultParams);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">Plot Dimensions</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={resetToDefaults}
                className="h-7 text-xs"
                data-testid="button-reset-params"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ParameterInput
              label="Plot Length"
              value={params.plotLength}
              unit="m"
              min={1}
              max={100}
              step={0.5}
              testId="input-plot-length"
              onChange={(v) => updateParam("plotLength", v)}
            />
            <ParameterInput
              label="Plot Width"
              value={params.plotWidth}
              unit="m"
              min={1}
              max={50}
              step={0.5}
              testId="input-plot-width"
              onChange={(v) => updateParam("plotWidth", v)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Lateral Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ParameterInput
              label="Lateral Spacing"
              value={params.lateralSpacing}
              unit="m"
              min={0.1}
              max={2}
              step={0.1}
              testId="input-lateral-spacing"
              onChange={(v) => updateParam("lateralSpacing", v)}
            />
            <ParameterInput
              label="Lateral Diameter"
              value={params.lateralDiameter}
              unit="mm"
              min={8}
              max={32}
              step={2}
              testId="input-lateral-diameter"
              onChange={(v) => updateParam("lateralDiameter", v)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Emitter Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ParameterInput
              label="Emitter Spacing"
              value={params.emitterSpacing}
              unit="m"
              min={0.1}
              max={1}
              step={0.05}
              testId="input-emitter-spacing"
              onChange={(v) => updateParam("emitterSpacing", v)}
            />
            <ParameterInput
              label="Emitter Flow Rate"
              value={params.emitterFlowRate}
              unit="L/h"
              min={0.5}
              max={8}
              step={0.5}
              testId="input-emitter-flow"
              onChange={(v) => updateParam("emitterFlowRate", v)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">System Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ParameterInput
              label="Mainline Diameter"
              value={params.mainlineDiameter}
              unit="mm"
              min={16}
              max={50}
              step={1}
              testId="input-mainline-diameter"
              onChange={(v) => updateParam("mainlineDiameter", v)}
            />
            <Separator className="my-3" />
            <ParameterInput
              label="Pump Pressure"
              value={params.pumpPressure}
              unit="bar"
              min={0.5}
              max={6}
              step={0.1}
              testId="input-pump-pressure"
              onChange={(v) => updateParam("pumpPressure", v)}
            />
            <ParameterInput
              label="Tank Capacity"
              value={params.tankCapacity}
              unit="L"
              min={100}
              max={10000}
              step={100}
              testId="input-tank-capacity"
              onChange={(v) => updateParam("tankCapacity", v)}
            />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
