// eslint-disable-next-line n/no-unpublished-import
import {VariableModel} from '@grafana/schema';
import {variableTemplate} from './variableTemplate';

export const generateVariableCode = (variableCodeName: string, template: VariableModel) => {
    const query =
        (typeof template.query === 'string' ? template.query : JSON.stringify(template.query)) ??
        '';

    return variableTemplate
        .replace('{{VARIABLE_CODE_NAME}}', variableCodeName)
        .replace('{{VARIABLE_NAME}}', template.name)
        .replace('{{LABEL}}', template.label ?? '')
        .replace('{{DATASOURCE_UID}}', template.datasource?.uid ?? '')
        .replace('{{DATASOURCE_TYPE}}', template.datasource?.type ?? '')
        .replace('{{QUERY}}', query)
        .replace('{{REFRESH}}', String(template.refresh))
        .replace('{{SORT}}', String(template.sort))
        .replace('{{IS_MULTI}}', String(template.multi))
        .replace('{{INCLUDE_ALL}}', String(template.includeAll));
};
