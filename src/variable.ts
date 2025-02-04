// eslint-disable-next-line n/no-unpublished-import
import {VariableModel} from '@grafana/schema';
import {customVariableTemplate, queryVariableTemplate} from './templates';

export const generateVariableCode = (variableCodeName: string, template: VariableModel) => {
    const query =
        (typeof template.query === 'string' ? template.query : JSON.stringify(template.query)) ??
        '';

    switch (template.type) {
        case 'query':
            return queryVariableTemplate
                .replace('{{VARIABLE_CODE_NAME}}', variableCodeName)
                .replace('{{VARIABLE_NAME}}', template.name)
                .replace('{{LABEL}}', template.label ?? '')
                .replace('{{DATASOURCE_UID}}', template.datasource?.uid ?? '')
                .replace('{{DATASOURCE_TYPE}}', template.datasource?.type ?? '')
                .replace('{{QUERY}}', query)
                .replace('{{REFRESH}}', String(template.refresh))
                .replace('{{SORT}}', String(template.sort))
                .replace('{{IS_MULTI}}', String(template.multi))
                .replace(
                    '{{OPTIONS}}',
                    JSON.stringify(
                        template.options?.map(option => ({
                            label: option.text,
                            value: option.value,
                        })) ?? []
                    )
                )
                .replace('{{INCLUDE_ALL}}', String(template.includeAll))
                .replace('{{HIDE}}', String(template.hide))
                .replace('{{VALUE}}', String(template.current?.value));
        case 'custom':
            return customVariableTemplate
                .replace('{{VARIABLE_CODE_NAME}}', variableCodeName)
                .replace('{{VARIABLE_NAME}}', template.name)
                .replace('{{LABEL}}', template.label ?? '')
                .replace('{{DATASOURCE_UID}}', template.datasource?.uid ?? '')
                .replace('{{DATASOURCE_TYPE}}', template.datasource?.type ?? '')
                .replace('{{QUERY}}', query)
                .replace('{{REFRESH}}', String(template.refresh))
                .replace('{{SORT}}', String(template.sort))
                .replace('{{IS_MULTI}}', String(template.multi))
                .replace(
                    '{{OPTIONS}}',
                    JSON.stringify(
                        template.options?.map(option => ({
                            label: option.text,
                            value: option.value,
                        })) ?? []
                    )
                )
                .replace('{{INCLUDE_ALL}}', String(template.includeAll))
                .replace('{{HIDE}}', String(template.hide))
                .replace('{{VALUE}}', String(template.current?.value));
        default:
            console.log(`Unsupported variable type: ${template.type}`);
            return '';
    }
};
