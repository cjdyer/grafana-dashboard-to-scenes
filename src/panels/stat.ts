import {
    BigValueColorMode,
    BigValueGraphMode,
    BigValueJustifyMode,
    BigValueTextMode,
    PercentChangeColorMode,
    SingleStatBaseOptions,
} from '@grafana/schema';
import {generateSingleStateOptions, OptionsString} from '../utils';

// Hopefully Grafana exports this at some point
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

    const bigValueColorModeMap: Record<BigValueColorMode, string> = {
        [BigValueColorMode.None]: 'BigValueColorMode.None',
        [BigValueColorMode.Background]: 'BigValueColorMode.Background',
        [BigValueColorMode.BackgroundSolid]: 'BigValueColorMode.BackgroundSolid',
        [BigValueColorMode.Value]: 'BigValueColorMode.Value',
    };

    const bigValueGraphModeMap: Record<BigValueGraphMode, string> = {
        [BigValueGraphMode.None]: 'BigValueGraphMode.None',
        [BigValueGraphMode.Area]: 'BigValueGraphMode.Area',
        [BigValueGraphMode.Line]: 'BigValueGraphMode.Line',
    };

    const bigValueJustifyModeMap: Record<BigValueJustifyMode, string> = {
        [BigValueJustifyMode.Auto]: 'BigValueJustifyMode.Auto',
        [BigValueJustifyMode.Center]: 'BigValueJustifyMode.Center',
    };

    const percentChangeColorModeMap: Record<PercentChangeColorMode, string> = {
        [PercentChangeColorMode.Standard]: 'PercentChangeColorMode.Standard',
        [PercentChangeColorMode.SameAsValue]: 'PercentChangeColorMode.SameAsValue',
        [PercentChangeColorMode.Inverted]: 'PercentChangeColorMode.Inverted',
    };

    const bigValueTextModeMap: Record<BigValueTextMode, string> = {
        [BigValueTextMode.Auto]: 'BigValueTextMode.Auto',
        [BigValueTextMode.Name]: 'BigValueTextMode.Name',
        [BigValueTextMode.None]: 'BigValueTextMode.None',
        [BigValueTextMode.Value]: 'BigValueTextMode.Value',
        [BigValueTextMode.ValueAndName]: 'BigValueTextMode.ValueAndName',
    };

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
