import {Panel} from '@grafana/schema';
import {generateOverrides, generateQuery} from '../utils';

export const generateGauagePanel = (panel: Panel<Record<string, unknown>, {}>) => {
    // Extract grid position
    const {x, y, w, h} = panel.gridPos ?? {x: 0, y: 0, w: 10, h: 5};

    // Convert fieldConfig overrides
    const overrides = generateOverrides(panel.fieldConfig!.overrides);

    // Convert panel queries
    const queries = panel.targets?.map(generateQuery).join(',\n            ') || '';

    // Convert options into setOption calls
    const options = Object.entries(panel.options ?? {})
        .map(([key, value]) => `.setOption('${key}', ${JSON.stringify(value)})`)
        .join('\n    ');

    return `const ${panel.title!.replace(/\s+/g, '')} = new SceneGridItem({
x: ${x},
y: ${y},
width: ${w},
height: ${h},
body: PanelBuilders.gauge()
.setTitle('${panel.title}')
.setData(
new SceneDataTransformer({
$data: new SceneQueryRunner({
  queries: [${queries}],
  datasource: { uid: '${panel.datasource?.uid}', type: '${panel.datasource?.type}' }
}),
transformations: ${JSON.stringify(panel.transformations ?? [], null, 2)}
})
)
${overrides}
${options}
.build(),
});`;
};
