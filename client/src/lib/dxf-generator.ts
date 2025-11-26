import type { IrrigationParams, CalculatedValues } from "./irrigation-types";

interface DXFEntity {
  type: string;
  layer: string;
  data: Record<string, number | string>;
}

class DXFDocument {
  private entities: DXFEntity[] = [];
  private layers: Map<string, { color: number; lineType: string }> = new Map();

  constructor() {
    this.addLayer("0", 7, "CONTINUOUS");
    this.addLayer("PLOT_BOUNDARY", 7, "CONTINUOUS");
    this.addLayer("MAINLINE", 5, "CONTINUOUS");
    this.addLayer("LATERALS", 4, "CONTINUOUS");
    this.addLayer("EMITTERS", 3, "CONTINUOUS");
    this.addLayer("COMPONENTS", 1, "CONTINUOUS");
    this.addLayer("ANNOTATIONS", 2, "CONTINUOUS");
    this.addLayer("DIMENSIONS", 6, "CONTINUOUS");
    this.addLayer("SENSORS", 140, "DASHED");
  }

  addLayer(name: string, color: number, lineType: string) {
    this.layers.set(name, { color, lineType });
  }

  addLine(layer: string, x1: number, y1: number, x2: number, y2: number) {
    this.entities.push({
      type: "LINE",
      layer,
      data: { x1, y1, z1: 0, x2, y2, z2: 0 },
    });
  }

  addCircle(layer: string, x: number, y: number, radius: number) {
    this.entities.push({
      type: "CIRCLE",
      layer,
      data: { x, y, z: 0, radius },
    });
  }

  addRectangle(layer: string, x: number, y: number, width: number, height: number) {
    this.addLine(layer, x, y, x + width, y);
    this.addLine(layer, x + width, y, x + width, y + height);
    this.addLine(layer, x + width, y + height, x, y + height);
    this.addLine(layer, x, y + height, x, y);
  }

  addText(
    layer: string,
    x: number,
    y: number,
    height: number,
    text: string,
    rotation: number = 0
  ) {
    this.entities.push({
      type: "TEXT",
      layer,
      data: { x, y, z: 0, height, rotation, text },
    });
  }

  addMText(
    layer: string,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string
  ) {
    this.entities.push({
      type: "MTEXT",
      layer,
      data: { x, y, z: 0, width, height, text },
    });
  }

  addPolyline(layer: string, points: Array<{ x: number; y: number }>, closed: boolean = false) {
    this.entities.push({
      type: "LWPOLYLINE",
      layer,
      data: { 
        points: JSON.stringify(points), 
        closed: closed ? 1 : 0,
        numVertices: points.length 
      },
    });
  }

  addBlock(name: string, x: number, y: number, layer: string, scale: number = 1, rotation: number = 0) {
    this.entities.push({
      type: "INSERT",
      layer,
      data: { name, x, y, z: 0, scaleX: scale, scaleY: scale, scaleZ: scale, rotation },
    });
  }

  private generateHeader(): string {
    return `0
SECTION
2
HEADER
9
$ACADVER
1
AC1027
9
$INSUNITS
70
6
9
$MEASUREMENT
70
1
9
$LUNITS
70
2
9
$LUPREC
70
4
0
ENDSEC
`;
  }

  private generateTables(): string {
    let tables = `0
SECTION
2
TABLES
0
TABLE
2
LTYPE
70
2
0
LTYPE
2
CONTINUOUS
70
0
3
Solid line
72
65
73
0
40
0.0
0
LTYPE
2
DASHED
70
0
3
Dashed line
72
65
73
2
40
0.5
49
0.25
74
0
49
-0.25
74
0
0
ENDTAB
0
TABLE
2
LAYER
70
${this.layers.size}
`;

    for (const [name, props] of Array.from(this.layers.entries())) {
      tables += `0
LAYER
2
${name}
70
0
62
${props.color}
6
${props.lineType}
`;
    }

    tables += `0
ENDTAB
0
TABLE
2
STYLE
70
1
0
STYLE
2
STANDARD
70
0
40
0.0
41
1.0
50
0.0
71
0
42
0.2
3
txt
4

0
ENDTAB
0
ENDSEC
`;
    return tables;
  }

  private generateBlocks(): string {
    let blocks = `0
SECTION
2
BLOCKS
`;

    blocks += `0
BLOCK
8
0
2
EMITTER
70
0
10
0
20
0
30
0
0
CIRCLE
8
EMITTERS
10
0
20
0
40
0.03
0
ENDBLK
`;

    blocks += `0
BLOCK
8
0
2
SENSOR
70
0
10
0
20
0
30
0
0
CIRCLE
8
SENSORS
10
0
20
0
40
0.08
0
CIRCLE
8
SENSORS
10
0
20
0
40
0.05
0
ENDBLK
`;

    blocks += `0
BLOCK
8
0
2
TANK
70
0
10
0
20
0
30
0
0
LWPOLYLINE
8
COMPONENTS
90
4
70
1
10
-0.2
20
-0.2
10
0.2
20
-0.2
10
0.2
20
0.2
10
-0.2
20
0.2
0
ENDBLK
`;

    blocks += `0
BLOCK
8
0
2
PUMP
70
0
10
0
20
0
30
0
0
CIRCLE
8
COMPONENTS
10
0
20
0
40
0.1
0
LINE
8
COMPONENTS
10
-0.07
20
0
11
0.07
21
0
0
LINE
8
COMPONENTS
10
0
20
-0.07
11
0
21
0.07
0
ENDBLK
`;

    blocks += `0
BLOCK
8
0
2
FILTER
70
0
10
0
20
0
30
0
0
LWPOLYLINE
8
COMPONENTS
90
4
70
1
10
-0.08
20
-0.05
10
0.08
20
-0.05
10
0.08
20
0.05
10
-0.08
20
0.05
0
LINE
8
COMPONENTS
10
-0.04
20
-0.05
11
-0.04
21
0.05
0
LINE
8
COMPONENTS
10
0
20
-0.05
11
0
21
0.05
0
LINE
8
COMPONENTS
10
0.04
20
-0.05
11
0.04
21
0.05
0
ENDBLK
`;

    blocks += `0
BLOCK
8
0
2
VALVE
70
0
10
0
20
0
30
0
0
LWPOLYLINE
8
COMPONENTS
90
3
70
0
10
-0.05
20
-0.05
10
0
20
0.05
10
0.05
20
-0.05
0
LWPOLYLINE
8
COMPONENTS
90
3
70
0
10
-0.05
20
0.05
10
0
20
-0.05
10
0.05
20
0.05
0
ENDBLK
`;

    blocks += `0
BLOCK
8
0
2
CONTROLLER
70
0
10
0
20
0
30
0
0
LWPOLYLINE
8
COMPONENTS
90
4
70
1
10
-0.15
20
-0.1
10
0.15
20
-0.1
10
0.15
20
0.1
10
-0.15
20
0.1
0
CIRCLE
8
COMPONENTS
10
0
20
0
40
0.03
0
ENDBLK
`;

    blocks += `0
ENDSEC
`;
    return blocks;
  }

  private generateEntities(): string {
    let entities = `0
SECTION
2
ENTITIES
`;

    for (const entity of this.entities) {
      switch (entity.type) {
        case "LINE":
          entities += `0
LINE
8
${entity.layer}
10
${entity.data.x1}
20
${entity.data.y1}
30
${entity.data.z1}
11
${entity.data.x2}
21
${entity.data.y2}
31
${entity.data.z2}
`;
          break;

        case "CIRCLE":
          entities += `0
CIRCLE
8
${entity.layer}
10
${entity.data.x}
20
${entity.data.y}
30
${entity.data.z}
40
${entity.data.radius}
`;
          break;

        case "TEXT":
          entities += `0
TEXT
8
${entity.layer}
10
${entity.data.x}
20
${entity.data.y}
30
${entity.data.z}
40
${entity.data.height}
1
${entity.data.text}
50
${entity.data.rotation}
`;
          break;

        case "MTEXT":
          entities += `0
MTEXT
8
${entity.layer}
10
${entity.data.x}
20
${entity.data.y}
30
${entity.data.z}
40
${entity.data.height}
41
${entity.data.width}
1
${entity.data.text}
`;
          break;

        case "INSERT":
          entities += `0
INSERT
8
${entity.layer}
2
${entity.data.name}
10
${entity.data.x}
20
${entity.data.y}
30
${entity.data.z}
41
${entity.data.scaleX}
42
${entity.data.scaleY}
43
${entity.data.scaleZ}
50
${entity.data.rotation}
`;
          break;

        case "LWPOLYLINE":
          const points = JSON.parse(entity.data.points as string) as Array<{x: number; y: number}>;
          entities += `0
LWPOLYLINE
8
${entity.layer}
90
${entity.data.numVertices}
70
${entity.data.closed}
`;
          for (const pt of points) {
            entities += `10
${pt.x}
20
${pt.y}
`;
          }
          break;
      }
    }

    entities += `0
ENDSEC
`;
    return entities;
  }

  generate(): string {
    return (
      this.generateHeader() +
      this.generateTables() +
      this.generateBlocks() +
      this.generateEntities() +
      `0
EOF
`
    );
  }
}

export function generateDXF(
  params: IrrigationParams,
  calculations: CalculatedValues
): string {
  const doc = new DXFDocument();
  const scale = 1;
  const plotWidth = params.plotLength * scale;
  const plotHeight = params.plotWidth * scale;

  doc.addRectangle("PLOT_BOUNDARY", 0, 0, plotWidth, plotHeight);

  const mainlineX = -0.5;
  doc.addLine("MAINLINE", mainlineX, 0, mainlineX, plotHeight);

  doc.addBlock("TANK", mainlineX, plotHeight + 0.5, "COMPONENTS", 1.5);
  doc.addBlock("PUMP", mainlineX, plotHeight + 0.2, "COMPONENTS", 1);
  doc.addBlock("FILTER", mainlineX, plotHeight + 0.05, "COMPONENTS", 1);
  doc.addBlock("VALVE", mainlineX, plotHeight - 0.1, "COMPONENTS", 1);
  doc.addBlock("CONTROLLER", plotWidth + 0.5, plotHeight / 2, "COMPONENTS", 1);

  for (let i = 0; i < calculations.numLaterals; i++) {
    const y = i * params.lateralSpacing;
    doc.addLine("LATERALS", mainlineX, y, plotWidth, y);
    doc.addCircle("LATERALS", mainlineX, y, 0.05);

    for (let j = 0; j < calculations.emittersPerLateral; j++) {
      const x = j * params.emitterSpacing;
      doc.addBlock("EMITTER", x, y, "EMITTERS", 1);
    }
  }

  doc.addBlock("SENSOR", plotWidth * 0.25, plotHeight * 0.33, "SENSORS", 1);
  doc.addBlock("SENSOR", plotWidth * 0.75, plotHeight * 0.66, "SENSORS", 1);

  doc.addLine("DIMENSIONS", 0, -0.3, plotWidth, -0.3);
  doc.addLine("DIMENSIONS", 0, -0.25, 0, -0.35);
  doc.addLine("DIMENSIONS", plotWidth, -0.25, plotWidth, -0.35);
  doc.addText("DIMENSIONS", plotWidth / 2, -0.5, 0.15, `${params.plotLength}m`);

  doc.addLine("DIMENSIONS", plotWidth + 0.3, 0, plotWidth + 0.3, plotHeight);
  doc.addLine("DIMENSIONS", plotWidth + 0.25, 0, plotWidth + 0.35, 0);
  doc.addLine("DIMENSIONS", plotWidth + 0.25, plotHeight, plotWidth + 0.35, plotHeight);
  doc.addText("DIMENSIONS", plotWidth + 0.5, plotHeight / 2, 0.15, `${params.plotWidth}m`, 90);

  const titleY = plotHeight + 1.2;
  doc.addText("ANNOTATIONS", 0, titleY, 0.2, "SMART DRIP IRRIGATION SYSTEM");
  doc.addText("ANNOTATIONS", 0, titleY - 0.3, 0.12, `Plot: ${params.plotLength}m x ${params.plotWidth}m = ${calculations.totalArea}m²`);
  doc.addText("ANNOTATIONS", 0, titleY - 0.5, 0.1, `Laterals: ${calculations.numLaterals} @ ${params.lateralSpacing}m spacing | Diameter: ${params.lateralDiameter}mm`);
  doc.addText("ANNOTATIONS", 0, titleY - 0.65, 0.1, `Emitters: ${calculations.totalEmitters} total @ ${params.emitterFlowRate} L/h | Spacing: ${params.emitterSpacing}m`);
  doc.addText("ANNOTATIONS", 0, titleY - 0.8, 0.1, `Mainline: ${params.mainlineDiameter}mm | Pump: ${params.pumpPressure} bar | Tank: ${params.tankCapacity}L`);
  doc.addText("ANNOTATIONS", 0, titleY - 0.95, 0.1, `Total Flow: ${calculations.totalFlowRate.toFixed(2)} L/min | TDH: ${calculations.totalDynamicHead.toFixed(2)} bar`);

  doc.addText("ANNOTATIONS", plotWidth - 1, -0.8, 0.08, "Scale 1:100");
  doc.addText("ANNOTATIONS", plotWidth - 1, -0.95, 0.06, "All dimensions in meters");

  return doc.generate();
}
