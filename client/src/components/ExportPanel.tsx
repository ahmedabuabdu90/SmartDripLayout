import { Button } from "@/components/ui/button";
import { Download, FileCode, FileImage } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { IrrigationParams, CalculatedValues } from "@/lib/irrigation-types";

interface ExportPanelProps {
  params: IrrigationParams;
  calculations: CalculatedValues;
}

function generateSVG(params: IrrigationParams, calculations: CalculatedValues): string {
  const scale = 40;
  const padding = 120;
  const plotWidth = params.plotLength * scale;
  const plotHeight = params.plotWidth * scale;
  const svgWidth = plotWidth + padding * 2;
  const svgHeight = plotHeight + padding * 2 + 100;

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <style>
    .plot { fill: #f8fafc; stroke: #e2e8f0; stroke-width: 2; }
    .mainline { stroke: #3b82f6; stroke-width: 4; stroke-linecap: round; }
    .lateral { stroke: #06b6d4; stroke-width: 2; stroke-linecap: round; }
    .emitter { fill: #10b981; }
    .text { font-family: monospace; font-size: 10px; fill: #64748b; }
    .title { font-family: sans-serif; font-size: 14px; font-weight: bold; fill: #1e293b; }
  </style>
  
  <!-- Title Block -->
  <text class="title" x="20" y="30">Smart Drip Irrigation System - ${params.plotLength}m x ${params.plotWidth}m</text>
  <text class="text" x="20" y="45">Total Emitters: ${calculations.totalEmitters} | Flow Rate: ${calculations.totalFlowRate.toFixed(2)} L/min</text>
  
  <!-- Plot Area -->
  <rect class="plot" x="${padding}" y="${padding}" width="${plotWidth}" height="${plotHeight}" rx="4"/>
  
  <!-- Mainline -->
  <line class="mainline" x1="${padding - 40}" y1="${padding}" x2="${padding - 40}" y2="${padding + plotHeight}"/>
  
  <!-- Laterals and Emitters -->
`;

  for (let i = 0; i < calculations.numLaterals; i++) {
    const y = padding + i * params.lateralSpacing * scale;
    svg += `  <line class="lateral" x1="${padding - 40}" y1="${y}" x2="${padding + plotWidth}" y2="${y}"/>\n`;
    
    for (let j = 0; j < calculations.emittersPerLateral; j++) {
      const x = padding + j * params.emitterSpacing * scale;
      svg += `  <circle class="emitter" cx="${x}" cy="${y}" r="3"/>\n`;
    }
  }

  svg += `  
  <!-- Dimensions -->
  <text class="text" x="${padding + plotWidth / 2}" y="${padding + plotHeight + 50}" text-anchor="middle">${params.plotLength} m</text>
  <text class="text" x="${padding + plotWidth + 50}" y="${padding + plotHeight / 2}" text-anchor="middle" transform="rotate(90, ${padding + plotWidth + 50}, ${padding + plotHeight / 2})">${params.plotWidth} m</text>
  
  <!-- Legend -->
  <text class="text" x="${padding}" y="${svgHeight - 20}">Scale 1:100 | Lateral: ${params.lateralDiameter}mm | Emitter: ${params.emitterFlowRate} L/h</text>
</svg>`;

  return svg;
}

function generateDXF(params: IrrigationParams, calculations: CalculatedValues): string {
  const scale = 1;
  const plotWidth = params.plotLength * scale;
  const plotHeight = params.plotWidth * scale;

  let dxf = `0
SECTION
2
HEADER
0
ENDSEC
0
SECTION
2
ENTITIES
`;

  dxf += `0
LINE
8
PLOT_BOUNDARY
10
0
20
0
11
${plotWidth}
21
0
0
LINE
8
PLOT_BOUNDARY
10
${plotWidth}
20
0
11
${plotWidth}
21
${plotHeight}
0
LINE
8
PLOT_BOUNDARY
10
${plotWidth}
20
${plotHeight}
11
0
21
${plotHeight}
0
LINE
8
PLOT_BOUNDARY
10
0
20
${plotHeight}
11
0
21
0
`;

  const mainlineX = -0.5;
  dxf += `0
LINE
8
MAINLINE
10
${mainlineX}
20
0
11
${mainlineX}
21
${plotHeight}
`;

  for (let i = 0; i < calculations.numLaterals; i++) {
    const y = i * params.lateralSpacing;
    dxf += `0
LINE
8
LATERALS
10
${mainlineX}
20
${y}
11
${plotWidth}
21
${y}
`;

    for (let j = 0; j < calculations.emittersPerLateral; j++) {
      const x = j * params.emitterSpacing;
      dxf += `0
CIRCLE
8
EMITTERS
10
${x}
20
${y}
40
0.05
`;
    }
  }

  dxf += `0
TEXT
8
ANNOTATIONS
10
${plotWidth / 2}
20
-0.5
40
0.2
1
Plot: ${params.plotLength}m x ${params.plotWidth}m
0
TEXT
8
ANNOTATIONS
10
${plotWidth / 2}
20
-0.8
40
0.15
1
Emitters: ${calculations.totalEmitters} | Flow: ${calculations.totalFlowRate.toFixed(2)} L/min
0
ENDSEC
0
EOF
`;

  return dxf;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function ExportPanel({ params, calculations }: ExportPanelProps) {
  const { toast } = useToast();

  const handleExportSVG = () => {
    const svg = generateSVG(params, calculations);
    downloadFile(svg, "irrigation-layout.svg", "image/svg+xml");
    toast({
      title: "SVG Exported",
      description: "Your irrigation layout has been exported as SVG.",
    });
  };

  const handleExportDXF = () => {
    const dxf = generateDXF(params, calculations);
    downloadFile(dxf, "irrigation-layout.dxf", "application/dxf");
    toast({
      title: "DXF Exported",
      description: "Your irrigation layout has been exported for AutoCAD.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button data-testid="button-export">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportSVG} data-testid="button-export-svg">
          <FileImage className="w-4 h-4 mr-2" />
          Export as SVG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportDXF} data-testid="button-export-dxf">
          <FileCode className="w-4 h-4 mr-2" />
          Export as DXF (AutoCAD)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
