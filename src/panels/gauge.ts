import {BarGaugeSizing, SingleStatBaseOptions} from '@grafana/schema';
import {generateSingleStateOptions, OptionsString} from '../utils';

// Hopefully Grafana exports this at some point
export interface GaugePanelOptions extends SingleStatBaseOptions {
    minVizHeight?: number;
    minVizWidth?: number;
    showThresholdLabels?: boolean;
    showThresholdMarkers?: boolean;
    sizing?: BarGaugeSizing;
}

export const generateGaugeOptions = (options?: GaugePanelOptions) => {
    if (options === undefined) {
        return '';
    }

    const sizingMap: Record<BarGaugeSizing, string> = {
        [BarGaugeSizing.Auto]: 'BarGaugeSizing.Auto',
        [BarGaugeSizing.Manual]: 'BarGaugeSizing.Manual',
    };

    const baseOptions = generateSingleStateOptions(options);
    const panelOptions: OptionsString<GaugePanelOptions>[] = [
        {key: 'minVizHeight', value: options.minVizHeight},
        {key: 'minVizWidth', value: options.minVizWidth},
        {key: 'showThresholdLabels', value: options.showThresholdLabels},
        {key: 'showThresholdMarkers', value: options.showThresholdMarkers},
        {
            key: 'sizing',
            value: options.sizing !== undefined ? sizingMap[options.sizing] : undefined,
        },
    ];

    return [...baseOptions, ...panelOptions]
        .filter(option => option.value !== undefined)
        .map(({key, value}) => `.setOption('${key}', ${value})`)
        .join('\n    ');
};
