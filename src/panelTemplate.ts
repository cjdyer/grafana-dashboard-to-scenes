export const gridItemTemplate = `const {{PANEL_NAME}} = new SceneGridItem({
    x: {{X}},
    y: {{Y}},
    width: {{WIDTH}},
    height: {{HEIGHT}},
    body: PanelBuilders.{{PANEL_TYPE}}()
        .setTitle('{{PANEL_TITLE}}')
        {{QUERY_SECTION}}{{OVERRIDES}}{{OPTIONS}}.build(),
});`;
