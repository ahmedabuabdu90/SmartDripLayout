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
import { generateDXF } from "@/lib/dxf-generator";
import { generateSVG } from "@/lib/svg-generator";

interface ExportPanelProps {
  params: IrrigationParams;
  calculations: CalculatedValues;
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
