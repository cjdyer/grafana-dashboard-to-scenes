import {
    FieldColorModeId,
    FieldConfig,
    MatcherConfig,
    Panel,
    SingleStatBaseOptions,
    VizOrientation,
} from '@grafana/schema';
import {GaugePanelOptions} from './panels/gauge';

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

export const generateOverrides = (overrides: Override[]) => {
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

export interface OptionsString<T> {
    key: keyof T;
    value?: unknown;
}

export const generateSingleStateOptions = (
    options: SingleStatBaseOptions
): OptionsString<SingleStatBaseOptions>[] => {
    const orientationMap: Record<VizOrientation, string> = {
        [VizOrientation.Auto]: 'VizOrientation.Auto',
        [VizOrientation.Horizontal]: 'VizOrientation.Horizontal',
        [VizOrientation.Vertical]: 'VizOrientation.Vertical',
    };

    return [
        {
            key: 'orientation',
            value: orientationMap[options.orientation],
        },
        {key: 'reduceOptions', value: JSON.stringify(options.reduceOptions)},
        {key: 'text', value: options.text},
    ];
};

export const generateGridItemCode = (
    panel: Panel & {options?: GaugePanelOptions},
    optionsGenerator: (options?: GaugePanelOptions) => string
) => {
    const {x, y, w, h} = panel.gridPos ?? {x: 0, y: 0, w: 10, h: 5};

    const overrides = generateOverrides(panel.fieldConfig!.overrides);
    const queries = panel.targets?.map(generateQuery).join(',\n            ') || '';
    const options = optionsGenerator(panel.options);

    return `const ${panel.title!.replace(/\s+/g, '')} = new SceneGridItem({
        x: ${x},
        y: ${y},
        width: ${w},
        height: ${h},
        body: PanelBuilders.${panel.type}()
        .setTitle('${panel.title}')
        .setData(
        new SceneDataTransformer({
        $data: new SceneQueryRunner({
          queries: [${queries}],
          datasource: { uid: '${panel.datasource?.uid}', type: '${panel.datasource?.type}' }
        }),
        transformations: ${JSON.stringify(panel.transformations ?? [], null, 2)}
        })
        )
        ${overrides}${options}.build(),
        })`;
};
