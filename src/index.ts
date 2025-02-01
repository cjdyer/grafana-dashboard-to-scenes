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
        panel =>
            `new SceneFlexItem({
    width: '50%',
    height: 300,
    body: PanelBuilders.text().setTitle('${panel.title}').setOption('content', '${panel.id}').build(),
})`
    );

    const output = `import React from 'react';
import { EmbeddedScene, PanelBuilders, SceneFlexItem, SceneFlexLayout } from '@grafana/scenes';

export default function testDashboard() {
  const scene = new EmbeddedScene({
    body: new SceneFlexLayout({
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
