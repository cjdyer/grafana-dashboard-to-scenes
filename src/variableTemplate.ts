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
