import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutTemplate, Home, Building2, Flower2, Tractor } from "lucide-react";
import { presets, type Preset } from "@/lib/presets";
import type { IrrigationParams } from "@/lib/irrigation-types";
import { useState } from "react";

interface PresetSelectorProps {
  onSelect: (params: IrrigationParams) => void;
}

const categoryIcons = {
  residential: Home,
  commercial: Building2,
  garden: Flower2,
  agricultural: Tractor,
};

const categoryLabels = {
  residential: "Residential",
  commercial: "Commercial",
  garden: "Garden",
  agricultural: "Agricultural",
};

function PresetCard({
  preset,
  onSelect,
}: {
  preset: Preset;
  onSelect: (params: IrrigationParams) => void;
}) {
  const Icon = categoryIcons[preset.category];
  const area = preset.params.plotLength * preset.params.plotWidth;

  return (
    <Card
      className="hover-elevate cursor-pointer transition-all"
      onClick={() => onSelect(preset.params)}
      data-testid={`card-preset-${preset.id}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary">
              <Icon className="w-4 h-4" />
            </div>
            <CardTitle className="text-sm">{preset.name}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs font-mono">
            {area}m²
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {preset.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground font-mono">
          <div>
            {preset.params.plotLength}m × {preset.params.plotWidth}m
          </div>
          <div>{preset.params.emitterFlowRate} L/h emitters</div>
          <div>{preset.params.lateralSpacing}m lateral spacing</div>
          <div>{preset.params.tankCapacity}L tank</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PresetSelector({ onSelect }: PresetSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (params: IrrigationParams) => {
    onSelect(params);
    setOpen(false);
  };

  const categories = ["residential", "garden", "commercial", "agricultural"] as const;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" data-testid="button-presets">
          <LayoutTemplate className="w-4 h-4 mr-2" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Design Templates</DialogTitle>
          <DialogDescription>
            Choose a preset configuration to quickly start your irrigation design
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="residential" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat];
              return (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="text-xs"
                  data-testid={`tab-category-${cat}`}
                >
                  <Icon className="w-3.5 h-3.5 mr-1.5" />
                  {categoryLabels[cat]}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {categories.map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-4">
              <ScrollArea className="h-[300px] pr-4">
                <div className="grid gap-3">
                  {presets
                    .filter((p) => p.category === cat)
                    .map((preset) => (
                      <PresetCard
                        key={preset.id}
                        preset={preset}
                        onSelect={handleSelect}
                      />
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
