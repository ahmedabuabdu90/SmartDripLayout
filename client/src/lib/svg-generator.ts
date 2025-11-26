import type { IrrigationParams, CalculatedValues } from "./irrigation-types";

export function generateSVG(
  params: IrrigationParams,
  calculations: CalculatedValues
): string {
  const scale = 50;
  const padding = 150;
  const plotWidth = params.plotLength * scale;
  const plotHeight = params.plotWidth * scale;
  const svgWidth = plotWidth + padding * 2 + 100;
  const svgHeight = plotHeight + padding * 2 + 180;

  const mainlineX = padding - 50;
  const plotX = padding;
  const plotY = padding;

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="${svgWidth}mm" 
     height="${svgHeight}mm" 
     viewBox="0 0 ${svgWidth} ${svgHeight}">
  
  <defs>
    <marker id="arrow-end" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0,0 8,3 0,6" fill="#64748b"/>
    </marker>
    <marker id="arrow-start" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
      <polygon points="8,0 0,3 8,6" fill="#64748b"/>
    </marker>
    <pattern id="grid" width="${scale}" height="${scale}" patternUnits="userSpaceOnUse">
      <path d="M ${scale} 0 L 0 0 0 ${scale}" fill="none" stroke="#e2e8f0" stroke-width="0.5"/>
    </pattern>
    <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.1" />
    </linearGradient>
  </defs>

  <style>
    .title { font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 16px; font-weight: 600; fill: #1e293b; }
    .subtitle { font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 11px; fill: #64748b; }
    .label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; fill: #64748b; }
    .dim { font-family: 'IBM Plex Mono', monospace; font-size: 10px; fill: #475569; }
    .component-label { font-family: 'IBM Plex Mono', monospace; font-size: 7px; fill: #1e293b; font-weight: 500; }
    .legend-text { font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 8px; fill: #475569; }
    .spec-text { font-family: 'IBM Plex Mono', monospace; font-size: 8px; fill: #64748b; }
  </style>

  <!-- Background -->
  <rect width="100%" height="100%" fill="#fafafa"/>
  
  <!-- Title Block -->
  <g transform="translate(20, 25)">
    <text class="title">Smart Drip Irrigation System Layout</text>
    <text class="subtitle" y="18">Parametric Design - Generated ${new Date().toLocaleDateString()}</text>
  </g>

  <!-- Plot Area with Grid -->
  <rect x="${plotX}" y="${plotY}" width="${plotWidth}" height="${plotHeight}" 
        fill="url(#grid)" stroke="#94a3b8" stroke-width="2" rx="4"/>
  <rect x="${plotX}" y="${plotY}" width="${plotWidth}" height="${plotHeight}" 
        fill="url(#waterGrad)" rx="4"/>

  <!-- Tank -->
  <g transform="translate(${mainlineX - 20}, ${plotY - 70})">
    <rect x="-20" y="-20" width="40" height="40" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
    <text class="component-label" text-anchor="middle" y="2">TANK</text>
    <text class="spec-text" text-anchor="middle" y="12">${params.tankCapacity}L</text>
  </g>

  <!-- Pump -->
  <g transform="translate(${mainlineX - 20}, ${plotY - 25})">
    <circle r="12" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
    <text class="component-label" text-anchor="middle" y="3">P</text>
  </g>

  <!-- Filter -->
  <g transform="translate(${mainlineX - 20}, ${plotY + 5})">
    <rect x="-10" y="-8" width="20" height="16" rx="2" fill="#dcfce7" stroke="#22c55e" stroke-width="1.5"/>
    <line x1="-4" y1="-8" x2="-4" y2="8" stroke="#22c55e" stroke-width="1"/>
    <line x1="0" y1="-8" x2="0" y2="8" stroke="#22c55e" stroke-width="1"/>
    <line x1="4" y1="-8" x2="4" y2="8" stroke="#22c55e" stroke-width="1"/>
  </g>

  <!-- Connection pipes from tank to mainline -->
  <line x1="${mainlineX - 20}" y1="${plotY - 50}" x2="${mainlineX - 20}" y2="${plotY - 37}" stroke="#64748b" stroke-width="3"/>
  <line x1="${mainlineX - 20}" y1="${plotY - 13}" x2="${mainlineX - 20}" y2="${plotY - 3}" stroke="#64748b" stroke-width="3"/>
  <line x1="${mainlineX - 20}" y1="${plotY + 13}" x2="${mainlineX - 20}" y2="${plotY}" stroke="#3b82f6" stroke-width="3"/>
  <line x1="${mainlineX - 20}" y1="${plotY}" x2="${mainlineX}" y2="${plotY}" stroke="#3b82f6" stroke-width="4"/>

  <!-- Mainline -->
  <line x1="${mainlineX}" y1="${plotY}" x2="${mainlineX}" y2="${plotY + plotHeight}" 
        stroke="#3b82f6" stroke-width="5" stroke-linecap="round"/>
  <text class="label" x="${mainlineX - 35}" y="${plotY + plotHeight / 2}" 
        text-anchor="middle" transform="rotate(-90, ${mainlineX - 35}, ${plotY + plotHeight / 2})">
    Mainline ${params.mainlineDiameter}mm PVC
  </text>

  <!-- Solenoid Valve -->
  <g transform="translate(${mainlineX}, ${plotY - 15})">
    <polygon points="-8,-6 0,6 8,-6" fill="#e0e7ff" stroke="#6366f1" stroke-width="1.5"/>
    <polygon points="-8,6 0,-6 8,6" fill="#e0e7ff" stroke="#6366f1" stroke-width="1.5"/>
  </g>

  <!-- Laterals and Emitters -->
`;

  for (let i = 0; i < calculations.numLaterals; i++) {
    const y = plotY + i * params.lateralSpacing * scale;
    svg += `  <!-- Lateral ${i + 1} -->
  <line x1="${mainlineX}" y1="${y}" x2="${plotX + plotWidth}" y2="${y}" 
        stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="${mainlineX}" cy="${y}" r="5" fill="#06b6d4" stroke="#0891b2" stroke-width="1"/>
`;

    for (let j = 0; j < calculations.emittersPerLateral; j++) {
      const x = plotX + j * params.emitterSpacing * scale;
      svg += `  <circle cx="${x}" cy="${y}" r="4" fill="#10b981" stroke="#059669" stroke-width="1"/>
`;
    }
  }

  svg += `
  <!-- Smart Controller -->
  <g transform="translate(${plotX + plotWidth + 40}, ${plotY + plotHeight / 2})">
    <rect x="-25" y="-20" width="50" height="40" rx="4" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5"/>
    <text class="component-label" text-anchor="middle" y="-5">SMART</text>
    <text class="component-label" text-anchor="middle" y="5">CTRL</text>
    <circle cy="14" r="4" fill="#22c55e"/>
    <line x1="-25" y1="0" x2="${-plotWidth - 40}" y2="${-plotHeight / 4}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,2"/>
    <line x1="-25" y1="0" x2="${-plotWidth - 40}" y2="${plotHeight / 4}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,2"/>
  </g>

  <!-- Soil Moisture Sensors -->
  <g transform="translate(${plotX + plotWidth * 0.25}, ${plotY + plotHeight * 0.33})">
    <circle r="10" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="4,2"/>
    <circle r="5" fill="#0ea5e9" opacity="0.3"/>
    <text class="component-label" text-anchor="middle" y="3">S1</text>
  </g>
  <g transform="translate(${plotX + plotWidth * 0.75}, ${plotY + plotHeight * 0.66})">
    <circle r="10" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="4,2"/>
    <circle r="5" fill="#0ea5e9" opacity="0.3"/>
    <text class="component-label" text-anchor="middle" y="3">S2</text>
  </g>

  <!-- Dimension Lines -->
  <!-- Horizontal -->
  <line x1="${plotX}" y1="${plotY + plotHeight + 40}" x2="${plotX + plotWidth}" y2="${plotY + plotHeight + 40}" 
        stroke="#64748b" stroke-width="1" marker-start="url(#arrow-start)" marker-end="url(#arrow-end)"/>
  <line x1="${plotX}" y1="${plotY + plotHeight + 35}" x2="${plotX}" y2="${plotY + plotHeight + 45}" stroke="#64748b" stroke-width="1"/>
  <line x1="${plotX + plotWidth}" y1="${plotY + plotHeight + 35}" x2="${plotX + plotWidth}" y2="${plotY + plotHeight + 45}" stroke="#64748b" stroke-width="1"/>
  <text class="dim" x="${plotX + plotWidth / 2}" y="${plotY + plotHeight + 55}" text-anchor="middle">${params.plotLength} m</text>

  <!-- Vertical -->
  <line x1="${plotX + plotWidth + 80}" y1="${plotY}" x2="${plotX + plotWidth + 80}" y2="${plotY + plotHeight}" 
        stroke="#64748b" stroke-width="1" marker-start="url(#arrow-start)" marker-end="url(#arrow-end)"/>
  <line x1="${plotX + plotWidth + 75}" y1="${plotY}" x2="${plotX + plotWidth + 85}" y2="${plotY}" stroke="#64748b" stroke-width="1"/>
  <line x1="${plotX + plotWidth + 75}" y1="${plotY + plotHeight}" x2="${plotX + plotWidth + 85}" y2="${plotY + plotHeight}" stroke="#64748b" stroke-width="1"/>
  <text class="dim" x="${plotX + plotWidth + 95}" y="${plotY + plotHeight / 2}" text-anchor="middle" 
        transform="rotate(90, ${plotX + plotWidth + 95}, ${plotY + plotHeight / 2})">${params.plotWidth} m</text>

  <!-- North Arrow -->
  <g transform="translate(${svgWidth - 40}, 50)">
    <polygon points="0,-20 6,-5 0,-10 -6,-5" fill="#64748b"/>
    <text class="label" text-anchor="middle" y="-25">N</text>
  </g>

  <!-- Legend -->
  <g transform="translate(${plotX}, ${plotY + plotHeight + 75})">
    <rect x="-5" y="-12" width="${plotWidth + 10}" height="50" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    
    <circle cx="15" cy="8" r="5" fill="#3b82f6"/>
    <text class="legend-text" x="28" y="11">Mainline (${params.mainlineDiameter}mm PVC)</text>
    
    <line x1="120" y1="8" x2="145" y2="8" stroke="#06b6d4" stroke-width="2.5"/>
    <text class="legend-text" x="153" y="11">Lateral (${params.lateralDiameter}mm PE)</text>
    
    <circle cx="265" cy="8" r="4" fill="#10b981"/>
    <text class="legend-text" x="275" y="11">Emitter (${params.emitterFlowRate} L/h)</text>
    
    <circle cx="365" cy="8" r="6" fill="none" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="3,1"/>
    <text class="legend-text" x="378" y="11">Soil Sensor</text>

    <text class="spec-text" x="5" y="30">Total Emitters: ${calculations.totalEmitters} | Flow Rate: ${calculations.totalFlowRate.toFixed(2)} L/min | TDH: ${calculations.totalDynamicHead.toFixed(2)} bar | Tank: ${params.tankCapacity}L</text>
  </g>

  <!-- Scale -->
  <g transform="translate(${svgWidth - 120}, ${svgHeight - 25})">
    <text class="label" text-anchor="end">Scale 1:${Math.round(1000 / scale)}</text>
  </g>

</svg>`;

  return svg;
}
