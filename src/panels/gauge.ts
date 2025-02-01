import {DataQuery, FieldConfig, Panel} from '@grafana/schema';

const FORMAT_TYPES = [
    'DEPRECATING_TABLE',
    'TABLE',
    'TIME_SERIES',
    'NODE_GRAPH',
    'REAL_TIME',
] as const;

export interface QueryJSON extends DataQuery {
    query: string;
    formatType: (typeof FORMAT_TYPES)[number];
    config?: unknown;
}

export const GenerateGauagePanel = (panel: Panel) => {
    // Extract grid position
    const {x, y, w, h} = panel.gridPos ?? {x: 0, y: 0, w: 10, h: 5};

    // Convert fieldConfig overrides
    const overrides =
        panel.fieldConfig?.overrides
            ?.map(
                override =>
                    // eslint-disable-next-line @stylistic/max-len
                    `.setOverrides((b) => b.matchFieldsWithName('${override.matcher.options}').overrideColor({
  mode: '${(override.properties[0].value! as FieldConfig['color'])!.mode}',
  fixedColor: '${(override.properties[0].value! as FieldConfig['color'])!.fixedColor}'
}))`
            )
            .join('\n    ') || '';

    // Convert panel queries
    const queries =
        (panel.targets as unknown as QueryJSON[])
            ?.map(
                target =>
                    `{
      refId: '${target.refId}',
      query: \`${target.query!.replace(/`/g, '\\`')}\`,
      formatType: '${target.formatType}',
      config: ${JSON.stringify(target.config ?? {}, null, 2)}
    }`
            )
            .join(',\n            ') || '';

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
