import {
    BarGaugeSizing,
    BigValueColorMode,
    BigValueGraphMode,
    BigValueJustifyMode,
    BigValueTextMode,
    LegendDisplayMode,
    PercentChangeColorMode,
    SortOrder,
    TableCellHeight,
    TooltipDisplayMode,
    VizOrientation,
    // eslint-disable-next-line n/no-unpublished-import
} from '@grafana/schema';

const toPascalCase = (input: string) =>
    input
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');

const createEnumLookup = <T extends Record<string, string>>(
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

export const orientationMap = createEnumLookup('VizOrientation', VizOrientation);
export const barGaugeSizingMap = createEnumLookup('BarGaugeSizing', BarGaugeSizing);
export const bigValueColorModeMap = createEnumLookup('BigValueColorMode', BigValueColorMode);
export const bigValueGraphModeMap = createEnumLookup('BigValueGraphMode', BigValueGraphMode);
export const bigValueJustifyModeMap = createEnumLookup('BigValueJustifyMode', BigValueJustifyMode);
export const percentChangeColorModeMap = createEnumLookup(
    'PercentChangeColorMode',
    PercentChangeColorMode
);
export const bigValueTextModeMap = createEnumLookup('BigValueTextMode', BigValueTextMode);
export const legendDisplayModeMap = createEnumLookup('LegendDisplayMode', LegendDisplayMode);
export const tooltipDisplayModeMap = createEnumLookup('TooltipDisplayMode', TooltipDisplayMode);
export const sortOrderMap = createEnumLookup('SortOrder', SortOrder);
export const tableCellHeightMap = createEnumLookup('TableCellHeight', TableCellHeight);
