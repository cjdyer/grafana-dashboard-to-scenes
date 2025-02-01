import {
    BigValueColorMode,
    BigValueGraphMode,
    BigValueJustifyMode,
    BigValueTextMode,
    PercentChangeColorMode,
    SingleStatBaseOptions,
} from '@grafana/schema';
import {createEnumLookup, generateSingleStateOptions, OptionsString} from '../utils';

export interface StatPanelOptions extends SingleStatBaseOptions {
    colorMode?: BigValueColorMode;
    graphMode?: BigValueGraphMode;
    justifyMode?: BigValueJustifyMode;
    percentChangeColorMode?: PercentChangeColorMode;
    showPercentChange?: boolean;
    textMode?: BigValueTextMode;
    wideLayout?: boolean;
}

const bigValueColorModeMap = createEnumLookup(BigValueColorMode);
const bigValueGraphModeMap = createEnumLookup(BigValueGraphMode);
const bigValueJustifyModeMap = createEnumLookup(BigValueJustifyMode);
const percentChangeColorModeMap = createEnumLookup(PercentChangeColorMode);
const bigValueTextModeMap = createEnumLookup(BigValueTextMode);

export const generateStatOptions = (options?: StatPanelOptions) => {
    if (options === undefined) {
        return '';
    }

    const baseOptions = generateSingleStateOptions(options);
    const panelOptions: OptionsString<StatPanelOptions>[] = [
        {
            key: 'colorMode',
            value:
                options.colorMode !== undefined
                    ? bigValueColorModeMap[options.colorMode]
                    : undefined,
        },
        {
            key: 'graphMode',
            value:
                options.graphMode !== undefined
                    ? bigValueGraphModeMap[options.graphMode]
                    : undefined,
        },
        {
            key: 'justifyMode',
            value:
                options.justifyMode !== undefined
                    ? bigValueJustifyModeMap[options.justifyMode]
                    : undefined,
        },
        {
            key: 'percentChangeColorMode',
            value:
                options.percentChangeColorMode !== undefined
                    ? percentChangeColorModeMap[options.percentChangeColorMode]
                    : undefined,
        },
        {key: 'showPercentChange', value: options.showPercentChange},
        {
            key: 'textMode',
            value:
                options.textMode !== undefined ? bigValueTextModeMap[options.textMode] : undefined,
        },
        {key: 'wideLayout', value: options.wideLayout},
    ];

    return [...baseOptions, ...panelOptions]
        .filter(option => option.value !== undefined)
        .map(({key, value}) => `.setOption('${key}', ${value})`)
        .join('\n    ');
};
