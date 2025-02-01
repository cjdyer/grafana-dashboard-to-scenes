import {readFileSync, writeFileSync} from 'fs';

import {Dashboard} from '@grafana/schema';

import {GenerateGauagePanel} from './panels/gauge';

const migrateDashboard = (jsonPath: string, outputTsxPath: string) => {
    const dashboard: Dashboard = JSON.parse(readFileSync(jsonPath, 'utf-8'));

    const panels = dashboard.panels!.map(panel => {
        switch (panel.type) {
            case 'gauge':
                return GenerateGauagePanel(panel);
            default:
                return `// Unsupported panel type: ${panel.type}`;
        }
    });

    const output = `import React from 'react';
import {
    EmbeddedScene,
    PanelBuilders,
    SceneGridItem,
    SceneDataTransformer,
    SceneQueryRunner,
    SceneGridLayout,
} from '@grafana/scenes';

export default function GeneratedDashboard() {
  ${panels.join('\n\n')}

  const scene = new EmbeddedScene({
  body: new SceneGridLayout({
      children: [${dashboard.panels!.map(panel => panel.title?.replace(/\s+/g, '')).join(', ')}],
    }),
  });

  return <scene.Component model={scene} />;
}`;

    writeFileSync(outputTsxPath, output.trim());
    console.log(`Scene file generated: ${outputTsxPath}`);
};

// Example usage
if (process.argv.length > 2) {
    migrateDashboard(process.argv[2], 'GeneratedScene.tsx');
}
