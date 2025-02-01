import React from 'react';
import {EmbeddedScene, PanelBuilders, SceneGridItem, SceneGridLayout} from '@grafana/scenes';

export default function testDashboard() {
    const scene = new EmbeddedScene({
        body: new SceneGridLayout({
            children: [
                new SceneGridItem({
                    x: 0,
                    y: 0,
                    body: PanelBuilders.gauge().setTitle('CPU Usage').build(),
                }),
                new SceneGridItem({
                    x: 1,
                    y: 0,
                    body: PanelBuilders.gauge().setTitle('Memory Usage').build(),
                }),
            ],
        }),
    });

    return <scene.Component model={scene} />;
}
