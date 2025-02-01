import {readFileSync, writeFileSync} from 'fs';

interface Panel {
    id: number;
    title: string;
}

interface GrafanaDashboard {
    panels: Panel[];
}

const migrateDashboard = (jsonPath: string, outputTsxPath: string) => {
    const dashboard: GrafanaDashboard = JSON.parse(readFileSync(jsonPath, 'utf-8'));

    const panels = dashboard.panels.map(
        (panel, index) =>
            `new SceneGridItem({
    x: ${index},
    y: 0,
    body: PanelBuilders.gauge()
        .setTitle('${panel.title}')
        .build(),
    })`
    );

    const output = `import React from 'react';
import {EmbeddedScene, PanelBuilders, SceneGridItem, SceneGridLayout} from '@grafana/scenes';

export default function testDashboard() {
  const scene = new EmbeddedScene({
    body: new SceneGridLayout({
      children: [${panels.join(',\n')}],
    }),
  });

  return <scene.Component model={scene} />;
}
`;

    writeFileSync(outputTsxPath, output.trim());
    console.log(`Scene file generated: ${outputTsxPath}`);
};

// Example usage
if (process.argv.length > 2) {
    migrateDashboard(process.argv[2], 'GeneratedScene.tsx');
}
