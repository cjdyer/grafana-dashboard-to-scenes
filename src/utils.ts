import {
    FieldColorModeId,
    FieldConfig,
    MatcherConfig,
    Panel,
    SingleStatBaseOptions,
    VizOrientation,
    // eslint-disable-next-line n/no-unpublished-import
} from '@grafana/schema';
import {GaugePanelOptions} from './panels/gauge';
import {StatPanelOptions} from './panels/stat';
import {TablePanelOptions} from './panels/table';
import {gridItemTemplate} from './panelTemplate';

export const generateQuery = (target: Record<string, unknown>) =>
    JSON.stringify(target ?? {}, null, 2);

interface OverrideProperty {
    id: string;
    value?: unknown;
}

interface Override {
    matcher: MatcherConfig;
    properties: OverrideProperty[];
}

export const generateOverrides = (overrides?: Override[]) => {
    if (overrides === undefined) {
        return '';
    }

    return (
        overrides
            .map(override => generateSingleOverride(override))
            .filter(Boolean)
            .join('\n    ') || ''
    );
};

const generateSingleOverride = (override: Override) => {
    const matcher = override.matcher.options;
    const properties = override.properties.map(generatePropertyOverride).filter(Boolean);

    // No valid properties, return empty string
    if (properties.length === 0) {
        return '';
    }

    return `.setOverrides((b) => b.matchFieldsWithName('${matcher}')${properties.join('')})`;
};

const generatePropertyOverride = (property: OverrideProperty) => {
    if (!property.value) {
        return '';
    }

    switch (property.id) {
        case 'color': {
            const color = property.value as FieldConfig['color'];
            // For now non-fixed modes are ignored
            if (color === undefined || color.mode !== FieldColorModeId.Fixed) {
                return '';
            }

            if (color.fixedColor === undefined) {
                return '';
            }

            return `.overrideColor(${JSON.stringify(color, null, 2)})`;
        }
        case 'unit': {
            return `.overrideUnit('${property.value as string}')`;
        }
        case 'displayName': {
            return `.overrideDisplayName('${property.value as string}')`;
        }
        default:
            // For now some properties are ignored
            return '';
    }
};

const toPascalCase = (input: string) =>
    input
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');

export const createEnumLookup = <T extends Record<string, string>>(
    enumName: string,
    enumType: T
): Record<T[keyof T], string> => {
    return Object.values(enumType).reduce(
        (lookup, value) => {
            lookup[value as T[keyof T]] = `${enumName}.${toPascalCase(value)}`;
            return lookup;
        },
        {} as Record<T[keyof T], string>
    );
};

export interface OptionsString<T> {
    key: keyof T;
    value?: unknown;
}

export const orientationMap = createEnumLookup('VizOrientation', VizOrientation);

export const generateSingleStateOptions = (
    options: SingleStatBaseOptions
): OptionsString<SingleStatBaseOptions>[] => {
    return [
        {
            key: 'orientation',
            value: orientationMap[options.orientation],
        },
        {key: 'reduceOptions', value: JSON.stringify(options.reduceOptions)},
        {key: 'text', value: options.text},
    ];
};

export const generateGridItemCode = <T = GaugePanelOptions | StatPanelOptions | TablePanelOptions>(
    panel: Panel & {options?: T},
    optionsGenerator: (options?: T) => string
) => {
    if (panel.title === undefined) {
        throw new Error(`Panel title cannot be undefined. Panel type: ${panel.type}`);
    }

    const {x, y, w, h} = panel.gridPos ?? {x: 0, y: 0, w: 10, h: 5};

    const overrides = generateOverrides(panel.fieldConfig?.overrides);
    const queries = panel.targets?.map(generateQuery).join(',\n            ') || '';
    const options = optionsGenerator(panel.options);

    const queryData =
        queries.length !== 0
            ? `.setData(
            new SceneDataTransformer({
                $data: new SceneQueryRunner({
                    queries: [${queries}],
                    datasource: { uid: '${
                        panel.datasource!.uid
                    }', type: '${panel.datasource!.type}' }
                }),
                transformations: ${JSON.stringify(panel.transformations ?? [], null, 2)}
            })
        )\n`
            : '';

    return gridItemTemplate
        .replace('{{PANEL_NAME}}', panel.title.replace(/\s+/g, ''))
        .replace('{{X}}', String(x))
        .replace('{{Y}}', String(y))
        .replace('{{WIDTH}}', String(w))
        .replace('{{HEIGHT}}', String(h))
        .replace('{{PANEL_TYPE}}', panel.type)
        .replace('{{PANEL_TITLE}}', panel.title)
        .replace('{{QUERY_SECTION}}', queryData)
        .replace('{{OVERRIDES}}', overrides)
        .replace('{{OPTIONS}}', options);
};
