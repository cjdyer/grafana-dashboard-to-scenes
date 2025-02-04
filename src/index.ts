import {readFileSync, writeFileSync} from 'fs';
// eslint-disable-next-line n/no-unpublished-import
import {Dashboard, Panel} from '@grafana/schema';
import {GaugePanelOptions, generateGaugeOptions} from './panels/gauge';
import {generateGridItemCode} from './utils';
import {generateStatOptions, StatPanelOptions} from './panels/stat';
import {generateTableOptions, TablePanelOptions} from './panels/table';
import {sceneTemplate} from './sceneTemplate';
import {generateTimeSeriesOptions, TimeseriesPanelOptions} from './panels/timeseries';

const migrateDashboard = (jsonPath: string, outputTsxPath: string) => {
    const dashboard: Dashboard = JSON.parse(readFileSync(jsonPath, 'utf-8'));

    const panelMap = dashboard
        .panels!.map((panel: Panel) => {
            const name = panel.title?.replace(/\s+/g, '');

            switch (panel.type) {
                case 'gauge':
                    return {
                        name,
                        code: generateGridItemCode(
                            panel as Panel & {options?: GaugePanelOptions},
                            generateGaugeOptions
                        ),
                    };
                case 'stat':
                    return {
                        name,
                        code: generateGridItemCode(
                            panel as Panel & {options?: StatPanelOptions},
                            generateStatOptions
                        ),
                    };
                case 'table':
                    return {
                        name,
                        code: generateGridItemCode(
                            panel as Panel & {options?: TablePanelOptions},
                            generateTableOptions
                        ),
                    };

                case 'timeseries':
                    return {
                        name,
                        code: generateGridItemCode(
                            panel as Panel & {options?: TimeseriesPanelOptions},
                            generateTimeSeriesOptions
                        ),
                    };

                default:
                    console.log(`Unsupported panel type: ${panel.type}`);
                    return {name: undefined, code: `// Unsupported panel type: ${panel.type}`};
            }
        })
        .filter(p => p.name !== undefined);

    const componentCode = sceneTemplate
        .replace('{{PANELS_CODE}}', panelMap.map(p => p.code).join('\n\n'))
        .replace('{{PANEL_NAMES}}', panelMap.map(p => p.name).join(', '));

    writeFileSync(outputTsxPath, componentCode.trim());
    console.log(`Scene file generated: ${outputTsxPath}`);
};

// CLI usage
if (process.argv.length > 2) {
    migrateDashboard(process.argv[2], 'GeneratedScene.tsx');
}
