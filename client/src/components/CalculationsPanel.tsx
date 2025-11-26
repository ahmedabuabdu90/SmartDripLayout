import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CalculatedValues, IrrigationParams } from "@/lib/irrigation-types";
import {
  Activity,
  Droplet,
  Grid3X3,
  Timer,
  Gauge,
  Container,
} from "lucide-react";

interface CalculationsPanelProps {
  params: IrrigationParams;
  calculations: CalculatedValues;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  status?: "optimal" | "warning" | "normal";
}

function StatItem({ icon, label, value, unit, status = "normal" }: StatItemProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted text-muted-foreground shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-lg font-semibold font-mono" data-testid={`text-calc-${label.toLowerCase().replace(/\s/g, '-')}`}>
            {value}
          </span>
          <span className="text-xs text-muted-foreground font-mono">{unit}</span>
          {status !== "normal" && (
            <Badge
              variant={status === "optimal" ? "default" : "secondary"}
              className="text-xs h-5"
            >
              {status}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export function CalculationsPanel({
  params,
  calculations,
}: CalculationsPanelProps) {
  const pressureStatus =
    calculations.totalDynamicHead >= 1.4 ? "optimal" : "warning";
  
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Layout Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <StatItem
              icon={<Grid3X3 className="w-4 h-4" />}
              label="Total Area"
              value={calculations.totalArea.toFixed(1)}
              unit="m²"
            />
            <Separator />
            <StatItem
              icon={<Activity className="w-4 h-4" />}
              label="Lateral Lines"
              value={calculations.numLaterals.toString()}
              unit="lines"
            />
            <Separator />
            <StatItem
              icon={<Droplet className="w-4 h-4" />}
              label="Emitters per Lateral"
              value={calculations.emittersPerLateral.toString()}
              unit="units"
            />
            <Separator />
            <StatItem
              icon={<Droplet className="w-4 h-4" />}
              label="Total Emitters"
              value={calculations.totalEmitters.toString()}
              unit="units"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Droplet className="w-4 h-4" />
              Flow Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <StatItem
              icon={<Activity className="w-4 h-4" />}
              label="Total Flow Rate"
              value={calculations.totalFlowRate.toFixed(2)}
              unit="L/min"
            />
            <Separator />
            <StatItem
              icon={<Activity className="w-4 h-4" />}
              label="Flow per Lateral"
              value={calculations.flowRatePerLateral.toFixed(3)}
              unit="L/min"
            />
            <Separator />
            <StatItem
              icon={<Container className="w-4 h-4" />}
              label="Water Required"
              value={calculations.waterRequired.toFixed(0)}
              unit="L/h"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              Hydraulics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <StatItem
              icon={<Gauge className="w-4 h-4" />}
              label="Pump Pressure"
              value={params.pumpPressure.toFixed(1)}
              unit="bar"
            />
            <Separator />
            <StatItem
              icon={<Gauge className="w-4 h-4" />}
              label="Available TDH"
              value={calculations.totalDynamicHead.toFixed(2)}
              unit="bar"
              status={pressureStatus}
            />
            <Separator />
            <StatItem
              icon={<Timer className="w-4 h-4" />}
              label="Irrigation Time"
              value={calculations.irrigationTime.toFixed(2)}
              unit="hours"
            />
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                System Efficiency
              </p>
              <p className="text-2xl font-bold text-primary font-mono" data-testid="text-efficiency">
                {pressureStatus === "optimal" ? "95%" : "78%"}
              </p>
              <Badge variant={pressureStatus === "optimal" ? "default" : "secondary"}>
                {pressureStatus === "optimal" ? "Optimal Design" : "Review Needed"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
