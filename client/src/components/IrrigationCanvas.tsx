import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Move,
  Crosshair,
} from "lucide-react";
import type { IrrigationParams, CalculatedValues } from "@/lib/irrigation-types";

interface IrrigationCanvasProps {
  params: IrrigationParams;
  calculations: CalculatedValues;
}

export function IrrigationCanvas({
  params,
  calculations,
}: IrrigationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const scale = 40 * zoom;
  const padding = 120;
  const plotWidth = params.plotLength * scale;
  const plotHeight = params.plotWidth * scale;

  const svgWidth = plotWidth + padding * 2;
  const svgHeight = plotHeight + padding * 2 + 100;

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.25, 0.5));
  const handleFit = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const renderGrid = () => {
    const lines = [];
    const gridSize = scale;
    for (let x = 0; x <= params.plotLength; x++) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={padding + x * gridSize}
          y1={padding}
          x2={padding + x * gridSize}
          y2={padding + plotHeight}
          className="stroke-border"
          strokeWidth={0.5}
          strokeDasharray="2,4"
        />
      );
    }
    for (let y = 0; y <= params.plotWidth; y++) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={padding}
          y1={padding + y * gridSize}
          x2={padding + plotWidth}
          y2={padding + y * gridSize}
          className="stroke-border"
          strokeWidth={0.5}
          strokeDasharray="2,4"
        />
      );
    }
    return lines;
  };

  const renderMainline = () => {
    const x = padding - 40;
    const y1 = padding;
    const y2 = padding + plotHeight;
    return (
      <g>
        <line
          x1={x}
          y1={y1}
          x2={x}
          y2={y2}
          className="stroke-primary"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <text
          x={x - 8}
          y={(y1 + y2) / 2}
          className="fill-muted-foreground font-mono text-[10px]"
          textAnchor="end"
          dominantBaseline="middle"
          transform={`rotate(-90, ${x - 8}, ${(y1 + y2) / 2})`}
        >
          Mainline {params.mainlineDiameter}mm
        </text>
      </g>
    );
  };

  const renderLaterals = () => {
    const elements = [];
    for (let i = 0; i < calculations.numLaterals; i++) {
      const y = padding + i * params.lateralSpacing * scale;
      const x1 = padding - 40;
      const x2 = padding + plotWidth;
      
      elements.push(
        <g key={`lateral-${i}`}>
          <line
            x1={x1}
            y1={y}
            x2={x2}
            y2={y}
            className="stroke-chart-2"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <circle
            cx={x1}
            cy={y}
            r={4}
            className="fill-chart-2 stroke-background"
            strokeWidth={1}
          />
        </g>
      );
    }
    return elements;
  };

  const renderEmitters = () => {
    const elements = [];
    for (let lat = 0; lat < calculations.numLaterals; lat++) {
      const y = padding + lat * params.lateralSpacing * scale;
      for (let em = 0; em < calculations.emittersPerLateral; em++) {
        const x = padding + em * params.emitterSpacing * scale;
        elements.push(
          <circle
            key={`emitter-${lat}-${em}`}
            cx={x}
            cy={y}
            r={3}
            className="fill-chart-3 stroke-background"
            strokeWidth={0.5}
          />
        );
      }
    }
    return elements;
  };

  const renderComponents = () => {
    const tankY = padding - 60;
    const tankX = padding - 60;
    
    return (
      <g>
        <rect
          x={tankX - 20}
          y={tankY - 20}
          width={40}
          height={40}
          rx={4}
          className="fill-chart-1/20 stroke-chart-1"
          strokeWidth={2}
        />
        <text
          x={tankX}
          y={tankY}
          className="fill-chart-1 font-mono text-[9px] font-medium"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          TANK
        </text>
        <text
          x={tankX}
          y={tankY + 12}
          className="fill-muted-foreground font-mono text-[7px]"
          textAnchor="middle"
        >
          {params.tankCapacity}L
        </text>

        <rect
          x={tankX - 12}
          y={tankY + 30}
          width={24}
          height={16}
          rx={2}
          className="fill-chart-4/20 stroke-chart-4"
          strokeWidth={1.5}
        />
        <text
          x={tankX}
          y={tankY + 38}
          className="fill-chart-4 font-mono text-[6px] font-medium"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          PUMP
        </text>

        <rect
          x={tankX - 10}
          y={tankY + 54}
          width={20}
          height={12}
          rx={2}
          className="fill-chart-5/20 stroke-chart-5"
          strokeWidth={1.5}
        />
        <text
          x={tankX}
          y={tankY + 60}
          className="fill-chart-5 font-mono text-[5px] font-medium"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          FILTER
        </text>

        <line
          x1={tankX}
          y1={tankY + 20}
          x2={tankX}
          y2={tankY + 30}
          className="stroke-muted-foreground"
          strokeWidth={2}
        />
        <line
          x1={tankX}
          y1={tankY + 46}
          x2={tankX}
          y2={tankY + 54}
          className="stroke-muted-foreground"
          strokeWidth={2}
        />
        <line
          x1={tankX}
          y1={tankY + 66}
          x2={tankX}
          y2={padding}
          className="stroke-primary"
          strokeWidth={3}
        />
        <line
          x1={tankX}
          y1={padding}
          x2={padding - 40}
          y2={padding}
          className="stroke-primary"
          strokeWidth={3}
        />

        <rect
          x={padding + plotWidth + 20}
          y={padding + plotHeight / 2 - 20}
          width={50}
          height={40}
          rx={4}
          className="fill-accent stroke-border"
          strokeWidth={1}
        />
        <text
          x={padding + plotWidth + 45}
          y={padding + plotHeight / 2 - 6}
          className="fill-foreground font-mono text-[7px] font-medium"
          textAnchor="middle"
        >
          SMART
        </text>
        <text
          x={padding + plotWidth + 45}
          y={padding + plotHeight / 2 + 4}
          className="fill-foreground font-mono text-[7px] font-medium"
          textAnchor="middle"
        >
          CTRL
        </text>
        <circle
          cx={padding + plotWidth + 45}
          cy={padding + plotHeight / 2 + 14}
          r={4}
          className="fill-chart-3"
        />

        <circle
          cx={padding + plotWidth * 0.25}
          cy={padding + plotHeight * 0.33}
          r={8}
          className="fill-chart-2/30 stroke-chart-2"
          strokeWidth={1.5}
          strokeDasharray="3,2"
        />
        <text
          x={padding + plotWidth * 0.25}
          y={padding + plotHeight * 0.33}
          className="fill-chart-2 font-mono text-[5px]"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          S1
        </text>
        <circle
          cx={padding + plotWidth * 0.75}
          cy={padding + plotHeight * 0.66}
          r={8}
          className="fill-chart-2/30 stroke-chart-2"
          strokeWidth={1.5}
          strokeDasharray="3,2"
        />
        <text
          x={padding + plotWidth * 0.75}
          y={padding + plotHeight * 0.66}
          className="fill-chart-2 font-mono text-[5px]"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          S2
        </text>
      </g>
    );
  };

  const renderDimensions = () => {
    const arrowSize = 6;
    return (
      <g className="fill-muted-foreground stroke-muted-foreground">
        <line
          x1={padding}
          y1={padding + plotHeight + 30}
          x2={padding + plotWidth}
          y2={padding + plotHeight + 30}
          strokeWidth={1}
          markerStart="url(#arrow-left)"
          markerEnd="url(#arrow-right)"
        />
        <text
          x={padding + plotWidth / 2}
          y={padding + plotHeight + 50}
          className="text-[11px] font-mono"
          textAnchor="middle"
        >
          {params.plotLength} m
        </text>

        <line
          x1={padding + plotWidth + 30}
          y1={padding}
          x2={padding + plotWidth + 30}
          y2={padding + plotHeight}
          strokeWidth={1}
          markerStart="url(#arrow-up)"
          markerEnd="url(#arrow-down)"
        />
        <text
          x={padding + plotWidth + 50}
          y={padding + plotHeight / 2}
          className="text-[11px] font-mono"
          textAnchor="middle"
          transform={`rotate(90, ${padding + plotWidth + 50}, ${padding + plotHeight / 2})`}
        >
          {params.plotWidth} m
        </text>

        <defs>
          <marker id="arrow-right" markerWidth={arrowSize} markerHeight={arrowSize} refX={arrowSize} refY={arrowSize / 2} orient="auto">
            <path d={`M0,0 L${arrowSize},${arrowSize / 2} L0,${arrowSize} Z`} className="fill-muted-foreground" />
          </marker>
          <marker id="arrow-left" markerWidth={arrowSize} markerHeight={arrowSize} refX={0} refY={arrowSize / 2} orient="auto">
            <path d={`M${arrowSize},0 L0,${arrowSize / 2} L${arrowSize},${arrowSize} Z`} className="fill-muted-foreground" />
          </marker>
          <marker id="arrow-up" markerWidth={arrowSize} markerHeight={arrowSize} refX={arrowSize / 2} refY={0} orient="auto">
            <path d={`M0,${arrowSize} L${arrowSize / 2},0 L${arrowSize},${arrowSize} Z`} className="fill-muted-foreground" />
          </marker>
          <marker id="arrow-down" markerWidth={arrowSize} markerHeight={arrowSize} refX={arrowSize / 2} refY={arrowSize} orient="auto">
            <path d={`M0,0 L${arrowSize / 2},${arrowSize} L${arrowSize},0 Z`} className="fill-muted-foreground" />
          </marker>
        </defs>
      </g>
    );
  };

  const renderLegend = () => {
    const legendX = padding;
    const legendY = padding + plotHeight + 70;
    return (
      <g className="text-[9px] font-mono">
        <rect
          x={legendX}
          y={legendY}
          width={plotWidth}
          height={28}
          rx={4}
          className="fill-card stroke-border"
          strokeWidth={0.5}
        />
        <circle cx={legendX + 15} cy={legendY + 14} r={4} className="fill-chart-1" />
        <text x={legendX + 25} y={legendY + 17} className="fill-foreground">Mainline</text>
        
        <line x1={legendX + 85} y1={legendY + 14} x2={legendX + 105} y2={legendY + 14} className="stroke-chart-2" strokeWidth={2} />
        <text x={legendX + 110} y={legendY + 17} className="fill-foreground">Lateral</text>
        
        <circle cx={legendX + 175} cy={legendY + 14} r={3} className="fill-chart-3" />
        <text x={legendX + 183} y={legendY + 17} className="fill-foreground">Emitter</text>
        
        <circle cx={legendX + 245} cy={legendY + 14} r={5} className="fill-chart-2/30 stroke-chart-2" strokeWidth={1} strokeDasharray="2,1" />
        <text x={legendX + 255} y={legendY + 17} className="fill-foreground">Sensor</text>
        
        <rect x={legendX + 310} y={legendY + 9} width={10} height={10} rx={1} className="fill-accent stroke-border" />
        <text x={legendX + 325} y={legendY + 17} className="fill-foreground">Controller</text>
      </g>
    );
  };

  return (
    <div className="flex flex-col h-full" ref={containerRef}>
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-card">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            Scale 1:{Math.round(100 / zoom)}
          </Badge>
          <Badge variant="outline" className="font-mono text-xs">
            {calculations.totalArea.toFixed(1)} m²
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleFit}
            data-testid="button-fit-view"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleZoomIn}
            data-testid="button-zoom-in"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleZoomOut}
            data-testid="button-zoom-out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        className="flex-1 overflow-hidden bg-background cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`${-pan.x / zoom} ${-pan.y / zoom} ${containerSize.width / zoom} ${containerSize.height / zoom}`}
          className="select-none"
          data-testid="canvas-irrigation"
        >
          <rect
            x={padding}
            y={padding}
            width={plotWidth}
            height={plotHeight}
            className="fill-card stroke-border"
            strokeWidth={2}
            rx={4}
          />
          {renderGrid()}
          {renderMainline()}
          {renderLaterals()}
          {renderEmitters()}
          {renderComponents()}
          {renderDimensions()}
          {renderLegend()}
          
          <g className="fill-muted-foreground text-[8px] font-mono">
            <text x={svgWidth - padding} y={20} textAnchor="end">
              N
            </text>
            <path
              d={`M${svgWidth - padding - 5},25 L${svgWidth - padding},18 L${svgWidth - padding + 5},25`}
              className="stroke-muted-foreground"
              fill="none"
              strokeWidth={1}
            />
          </g>
        </svg>
      </div>

      <div className="flex items-center justify-center gap-4 px-4 py-2 border-t bg-card text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Move className="w-3 h-3" /> Pan: Drag
        </span>
        <span className="flex items-center gap-1">
          <Crosshair className="w-3 h-3" /> Zoom: {(zoom * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}
