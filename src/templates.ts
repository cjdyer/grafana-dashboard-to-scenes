export const sceneTemplate = `
import React from 'react';
import {
    EmbeddedScene,
    PanelBuilders,
    QueryVariable,
    SceneDataTransformer,
    SceneGridItem,
    SceneGridLayout,
    SceneQueryRunner,
    SceneVariableSet,
    VariableValueSelectors,
} from '@grafana/scenes';
import {
    BigValueColorMode,
    BigValueGraphMode,
    BigValueJustifyMode,
    BigValueTextMode,
    LegendDisplayMode,
    SortOrder,
    TooltipDisplayMode,
    VizOrientation,
} from '@grafana/schema';

{{VARIABLES_CODE}}

{{PANELS_CODE}}

export default function GeneratedDashboard() {
  const scene = new EmbeddedScene({
    $variables: new SceneVariableSet({
      variables: [{{VARIABLE_NAMES}}],
    }),
    controls: [new VariableValueSelectors( {} )],
    body: new SceneGridLayout({
      children: [{{PANEL_NAMES}}],
    }),
  });

  return <scene.Component model={scene} />;
}
`;

export const gridItemTemplate = `const {{PANEL_NAME}} = new SceneGridItem({
    x: {{X}},
    y: {{Y}},
    width: {{WIDTH}},
    height: {{HEIGHT}},
    body: PanelBuilders.{{PANEL_TYPE}}()
        .setTitle('{{PANEL_TITLE}}')
        {{QUERY_SECTION}}{{OVERRIDES}}{{OPTIONS}}.build(),
});`;

export const variableTemplate = `const {{VARIABLE_CODE_NAME}} = new QueryVariable({
    name: '{{VARIABLE_NAME}}',
    label: '{{LABEL}}',
    datasource: { uid: '{{DATASOURCE_UID}}', type: '{{DATASOURCE_TYPE}}' },
    query: \`{{QUERY}}\`,
    refresh: {{REFRESH}},
    sort: {{SORT}},
    isMulti: {{IS_MULTI}},
    includeAll: {{INCLUDE_ALL}}
});`;
