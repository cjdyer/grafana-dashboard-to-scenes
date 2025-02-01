export const sceneTemplate = `
import React from 'react';
import {
    EmbeddedScene,
    PanelBuilders,
    SceneDataTransformer,
    SceneGridItem,
    SceneGridLayout,
    SceneQueryRunner,
} from '@grafana/scenes';
import {
    BigValueColorMode,
    BigValueGraphMode,
    BigValueJustifyMode,
    BigValueTextMode,
    VizOrientation,
} from '@grafana/schema';

{{PANELS_CODE}}

export default function GeneratedDashboard() {
  const scene = new EmbeddedScene({
    body: new SceneGridLayout({
      children: [{{PANEL_NAMES}}],
    }),
  });

  return <scene.Component model={scene} />;
}
`;
