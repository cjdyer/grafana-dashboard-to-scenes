import {
    FieldColorModeId,
    MatcherConfig,
    Panel,
    SingleStatBaseOptions,
    // eslint-disable-next-line n/no-unpublished-import
} from '@grafana/schema';
// eslint-disable-next-line n/no-unpublished-import
import {FieldConfig} from '@grafana/data';
import {GaugePanelOptions} from './panels/gauge';
import {StatPanelOptions} from './panels/stat';
import {TablePanelOptions} from './panels/table';
import {gridItemTemplate} from './templates';
import {orientationMap} from './enumLookUp';

export const generateQuery = (target: Record<string, unknown>) =>
    JSON.stringify(target ?? {}, null, 2);

interface OverrideProperty<T extends keyof FieldConfig = keyof FieldConfig> {
    id: T;
    value?: FieldConfig[T];
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

const generatePropertyOverride = (property: OverrideProperty): string => {
    const {id, value} = property;

    if (value === undefined) {
        return '';
    }

    switch (id) {
        case 'color': {
            const color = value as FieldConfig['color'];
            if (color === undefined || color.mode !== FieldColorModeId.Fixed) {
                return '';
            }
            if (color.fixedColor === undefined) {
                return '';
            }
            return `.overrideColor(${JSON.stringify(color, null, 2)})`;
        }
        case 'unit': {
            const unit = value as FieldConfig['unit'];
            return `.overrideUnit('${unit}')`;
        }
        case 'displayName': {
            const displayName = value as FieldConfig['displayName'];
            return `.overrideDisplayName('${displayName}')`;
        }
        case 'links': {
            const links = value as FieldConfig['links'];
            if (links === undefined || links.length === 0) {
                return '';
            }

            return `.overrideLinks([${links.map(link => JSON.stringify(link, null, 2)).join()}])`;
        }
        case 'mappings': {
            const mappings = value as FieldConfig['mappings'];
            if (mappings === undefined || mappings.length === 0) {
                return '';
            }

            return (
                '.overrideMappings([' +
                `${mappings.map(mapping => JSON.stringify(mapping, null, 2)).join()}])`
            );
        }
        case 'noValue': {
            const noValue = value as FieldConfig['noValue'];
            return `.overrideNoValue('${noValue}')`;
        }
        default:
            if (id.startsWith('custom')) {
                const custom = value as FieldConfig['custom'];
                return (
                    `.overrideCustomFieldConfig("${id.substring(7)}", ` +
                    `${JSON.stringify(custom, null, 2)})`
                );
            }
            console.log(`Unsupported property type: ${id}`);
            return '';
    }
};

export interface OptionsString<T> {
    key: keyof T;
    value?: unknown;
}

export const generateSingleStateOptions = (
    options: SingleStatBaseOptions
): OptionsString<SingleStatBaseOptions>[] => {
    return [
        {
            key: 'orientation',
            value: orientationMap[options.orientation],
        },
        //! TODO: Update these to correctly generate options, rather than using stringify
        {key: 'reduceOptions', value: JSON.stringify(options.reduceOptions)},
        //! TODO: Update these to correctly generate options, rather than using stringify
        {key: 'text', value: JSON.stringify(options.text)},
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

    const overrides = generateOverrides(panel.fieldConfig?.overrides as Override[]);
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
