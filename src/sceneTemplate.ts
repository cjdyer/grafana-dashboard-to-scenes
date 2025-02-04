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
