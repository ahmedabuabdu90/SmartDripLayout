# Smart Drip Irrigation Designer

A professional parametric design tool for smart drip irrigation systems with real-time visualization and CAD export capabilities.

## Overview

This web application allows users to design irrigation systems by configuring parameters and seeing the layout update in real-time. The generated designs can be exported to SVG or DXF formats for use in CAD software like AutoCAD.

## Features

- **Interactive Parameter Panel**: Configure plot dimensions, lateral spacing, emitter settings, and system components
- **Real-time 2D Visualization**: SVG-based technical drawing showing all irrigation components
- **Automatic Calculations**: Flow rates, total emitters, pressure calculations displayed in real-time
- **Preset Templates**: Pre-configured designs for residential, garden, commercial, and agricultural use cases
- **Export Options**: Download designs as SVG (vector graphics) or DXF (AutoCAD format)
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Zoom & Pan**: Navigate large designs easily

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx           # App header with title and controls
│   │   │   ├── ThemeToggle.tsx      # Dark/light mode toggle
│   │   │   ├── ParameterPanel.tsx   # Input controls for irrigation params
│   │   │   ├── CalculationsPanel.tsx # Calculated values display
│   │   │   ├── IrrigationCanvas.tsx # SVG visualization canvas
│   │   │   ├── ExportPanel.tsx      # Export dropdown (SVG/DXF)
│   │   │   └── PresetSelector.tsx   # Template selection dialog
│   │   ├── lib/
│   │   │   ├── irrigation-types.ts  # Re-exports from shared schema
│   │   │   ├── dxf-generator.ts     # DXF file generation
│   │   │   ├── svg-generator.ts     # SVG file generation
│   │   │   └── presets.ts           # Preset template configurations
│   │   └── pages/
│   │       └── IrrigationDesigner.tsx # Main application page
│   └── index.html
├── server/
│   ├── routes.ts                    # API routes (health check)
│   └── storage.ts                   # Storage interface (minimal)
└── shared/
    └── schema.ts                    # Shared types and calculation logic
```

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Express.js (minimal - primarily frontend application)
- **Styling**: IBM Plex Sans/Mono fonts, Carbon Design System inspired

## Key Parameters

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Plot Length | 1-100m | 10m | Length of irrigation plot |
| Plot Width | 1-50m | 5m | Width of irrigation plot |
| Lateral Spacing | 0.1-5m | 0.5m | Distance between lateral lines |
| Emitter Spacing | 0.1-2m | 0.3m | Distance between emitters |
| Emitter Flow Rate | 0.5-10 L/h | 2 L/h | Water flow per emitter |
| Mainline Diameter | 12-75mm | 25mm | Main pipe diameter |
| Lateral Diameter | 8-32mm | 16mm | Lateral pipe diameter |
| Pump Pressure | 0.5-6 bar | 2.0 bar | System operating pressure |
| Tank Capacity | 50-50000L | 1000L | Water storage capacity |

## Development

The application runs on port 5000 with hot reload enabled. Run with:
```bash
npm run dev
```

## Recent Changes

- **2024-11-26**: Initial MVP release
  - Complete parametric design interface
  - Real-time SVG canvas with all irrigation components
  - DXF export with proper AutoCAD layers and blocks
  - 8 preset templates across 4 categories
  - Dark/light theme support
