import {readFileSync, writeFileSync} from 'fs';
import {Dashboard, Panel} from '@grafana/schema';
import {GaugePanelOptions, generateGaugeOptions} from './panels/gauge';
import {generateGridItemCode} from './utils';

const imports = `import React from 'react';
import {
    EmbeddedScene,
    PanelBuilders,
    SceneDataTransformer,
    SceneGridItem,
    SceneGridLayout,
    SceneQueryRunner,
} from '@grafana/scenes';`;

const migrateDashboard = (jsonPath: string, outputTsxPath: string) => {
    const dashboard: Dashboard = JSON.parse(readFileSync(jsonPath, 'utf-8'));

    const panelMap = dashboard
        .panels!.map((panel: Panel) => {
            switch (panel.type) {
                case 'gauge':
                    return {
                        name: panel.title?.replace(/\s+/g, ''),
                        code: generateGridItemCode(
                            panel as Panel & {options?: GaugePanelOptions},
                            generateGaugeOptions
                        ),
                    };
                default:
                    console.log(`Unsupported panel type: ${panel.type}`);
                    return {name: undefined, code: `// Unsupported panel type: ${panel.type}`};
            }
        })
        .filter(p => p.name !== undefined);

    const panelsCode = panelMap.map(p => p.code).join('\n\n');

    const sceneCode = `export default function GeneratedDashboard() {
  const scene = new EmbeddedScene({
    body: new SceneGridLayout({
      children: [${panelMap.map(p => p.name).join(', ')}],
    }),
  });

  return <scene.Component model={scene} />;
}`;

    const componentCode = `${imports}\n\n${panelsCode}\n\n${sceneCode}\n`;

    writeFileSync(outputTsxPath, componentCode.trim());
    console.log(`Scene file generated: ${outputTsxPath}`);
};

// Example usage
if (process.argv.length > 2) {
    migrateDashboard(process.argv[2], 'GeneratedScene.tsx');
}
