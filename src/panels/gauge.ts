// eslint-disable-next-line n/no-unpublished-import
import {BarGaugeSizing, SingleStatBaseOptions} from '@grafana/schema';
import {createEnumLookup, generateSingleStateOptions, OptionsString} from '../utils';

export interface GaugePanelOptions extends SingleStatBaseOptions {
    minVizHeight?: number;
    minVizWidth?: number;
    showThresholdLabels?: boolean;
    showThresholdMarkers?: boolean;
    sizing?: BarGaugeSizing;
}

const barGaugeSizingMap = createEnumLookup('BarGaugeSizing', BarGaugeSizing);

export const generateGaugeOptions = (options?: GaugePanelOptions) => {
    if (options === undefined) {
        return '';
    }

    const baseOptions = generateSingleStateOptions(options);
    const panelOptions: OptionsString<GaugePanelOptions>[] = [
        {key: 'minVizHeight', value: options.minVizHeight},
        {key: 'minVizWidth', value: options.minVizWidth},
        {key: 'showThresholdLabels', value: options.showThresholdLabels},
        {key: 'showThresholdMarkers', value: options.showThresholdMarkers},
        {
            key: 'sizing',
            value: options.sizing !== undefined ? barGaugeSizingMap[options.sizing] : undefined,
        },
    ];

    return [...baseOptions, ...panelOptions]
        .filter(option => option.value !== undefined)
        .map(({key, value}) => `.setOption('${key}', ${value})`)
        .join('\n    ');
};
