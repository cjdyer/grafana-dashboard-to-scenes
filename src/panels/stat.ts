import {
    BigValueColorMode,
    BigValueGraphMode,
    BigValueJustifyMode,
    BigValueTextMode,
    PercentChangeColorMode,
    SingleStatBaseOptions,
    // eslint-disable-next-line n/no-unpublished-import
} from '@grafana/schema';
import {generateSingleStateOptions, OptionsString} from '../utils';
import {
    bigValueColorModeMap,
    bigValueGraphModeMap,
    bigValueJustifyModeMap,
    bigValueTextModeMap,
    percentChangeColorModeMap,
} from '../enumLookUp';

export interface StatPanelOptions extends SingleStatBaseOptions {
    colorMode?: BigValueColorMode;
    graphMode?: BigValueGraphMode;
    justifyMode?: BigValueJustifyMode;
    percentChangeColorMode?: PercentChangeColorMode;
    showPercentChange?: boolean;
    textMode?: BigValueTextMode;
    wideLayout?: boolean;
}

export const generateStatOptions = (options?: StatPanelOptions) => {
    if (options === undefined) {
        return '';
    }

    const baseOptions = generateSingleStateOptions(options);
    const panelOptions: OptionsString<StatPanelOptions>[] = [
        {
            key: 'colorMode',
            value: bigValueColorModeMap[options.colorMode!],
        },
        {
            key: 'graphMode',
            value: bigValueGraphModeMap[options.graphMode!],
        },
        {
            key: 'justifyMode',
            value: bigValueJustifyModeMap[options.justifyMode!],
        },
        {
            key: 'percentChangeColorMode',
            value: percentChangeColorModeMap[options.percentChangeColorMode!],
        },
        {key: 'showPercentChange', value: options.showPercentChange},
        {
            key: 'textMode',
            value: bigValueTextModeMap[options.textMode!],
        },
        {key: 'wideLayout', value: options.wideLayout},
    ];

    return [...baseOptions, ...panelOptions]
        .filter(option => option.value !== undefined)
        .map(({key, value}) => `.setOption('${key}', ${value})`)
        .join('\n    ');
};
