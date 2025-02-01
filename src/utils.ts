import {FieldColorModeId, FieldConfig, MatcherConfig} from '@grafana/schema';

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

function generatePropertyOverride(property: OverrideProperty): string {
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
}
