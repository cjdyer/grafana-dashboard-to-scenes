export const sceneTemplate = `
import React from 'react';
import {
    EmbeddedScene,
    SceneGridLayout,
} from '@grafana/scenes';

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
