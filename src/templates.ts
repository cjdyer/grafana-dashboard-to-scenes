export const sceneTemplate = `
import React from 'react';
import {
    CustomVariable,
    EmbeddedScene,
    PanelBuilders,
    QueryVariable,
    SceneDataTransformer,
    SceneGridItem,
    SceneGridLayout,
    SceneQueryRunner,
    SceneTimePicker,
    SceneTimeRange,
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
    $timeRange: new SceneTimeRange({{TIME_RANGE}}),
    controls: [new VariableValueSelectors({}), new SceneTimePicker({hidePicker: false, isOnCanvas: true})],  
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

export const queryVariableTemplate = `const {{VARIABLE_CODE_NAME}} = new QueryVariable({
    name: '{{VARIABLE_NAME}}',
    label: '{{LABEL}}',
    datasource: { uid: '{{DATASOURCE_UID}}', type: '{{DATASOURCE_TYPE}}' },
    query: \`{{QUERY}}\`,
    refresh: {{REFRESH}},
    sort: {{SORT}},
    isMulti: {{IS_MULTI}},
    includeAll: {{INCLUDE_ALL}},
    options: {{OPTIONS}},
    hide: {{HIDE}},
    value: '{{VALUE}}',
});`;

export const customVariableTemplate = `const {{VARIABLE_CODE_NAME}} = new CustomVariable({
    name: '{{VARIABLE_NAME}}',
    label: '{{LABEL}}',
    query: \`{{QUERY}}\`,
    isMulti: {{IS_MULTI}},
    includeAll: {{INCLUDE_ALL}},
    options: {{OPTIONS}},
    hide: {{HIDE}},
    value: '{{VALUE}}',
});`;
