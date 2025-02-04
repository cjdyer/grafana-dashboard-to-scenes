import {
    OptionsWithTimezones,
    VizLegendOptions,
    VizOrientation,
    VizTooltipOptions,
    // eslint-disable-next-line n/no-unpublished-import
} from '@grafana/schema';
import {OptionsString} from '../utils';
import {
    legendDisplayModeMap,
    orientationMap,
    sortOrderMap,
    tooltipDisplayModeMap,
} from '../enumLookUp';

export interface TimeseriesPanelOptions extends OptionsWithTimezones {
    legend?: VizLegendOptions;
    orientation?: VizOrientation;
    tooltip?: VizTooltipOptions;
}

export const generateTimeSeriesOptions = (options?: TimeseriesPanelOptions): string => {
    if (!options) {
        return '';
    }

    const generateLegendOptions = (legend?: VizLegendOptions) => {
        if (legend === undefined) {
            return undefined;
        }

        const legendOptions = [
            {key: 'asTable', value: legend.asTable},
            {key: 'calcs', value: legend.calcs?.length !== 0 ? legend.calcs : undefined},
            {
                key: 'displayMode',
                value: legendDisplayModeMap[legend.displayMode],
            },
            {key: 'isVisible', value: legend.isVisible},
            {
                key: 'placement',
                value: legend.placement !== undefined ? `'${legend.placement}'` : undefined,
            },
            {key: 'showLegend', value: legend.showLegend},
            {key: 'sortBy', value: legend.sortBy},
            {key: 'sortDesc', value: legend.sortDesc},
            {key: 'width', value: legend.width},
        ].filter(option => option.value !== undefined);

        return `{${legendOptions.map(option => `${option.key}: ${option.value}`).join(',\n')}}`;
    };

    const generateTooltipOptions = (tooltip?: VizTooltipOptions) => {
        if (tooltip === undefined) {
            return undefined;
        }

        const tooltipOptions = [
            {key: 'hideZeros', value: tooltip.hideZeros},
            {key: 'maxHeight', value: tooltip.maxHeight},
            {key: 'maxWidth', value: tooltip.maxWidth},
            {
                key: 'mode',
                value: tooltipDisplayModeMap[tooltip.mode!],
            },
            {
                key: 'sort',
                value: sortOrderMap[tooltip.sort!],
            },
        ].filter(option => option.value !== undefined);

        return `{${tooltipOptions.map(option => `${option.key}: ${option.value}`).join(',\n')}}`;
    };

    const generateTimezoneOptions = (timezone?: OptionsWithTimezones['timezone']) => {
        if (timezone === undefined) {
            return undefined;
        }

        return `[${timezone.join()}]`;
    };

    const timeseriesOptions: OptionsString<TimeseriesPanelOptions>[] = [
        {key: 'legend', value: generateLegendOptions(options.legend)},
        {
            key: 'orientation',
            value: orientationMap[options.orientation!],
        },
        {key: 'tooltip', value: generateTooltipOptions(options.tooltip)},
        {key: 'timezone', value: generateTimezoneOptions(options.timezone)},
    ];

    return timeseriesOptions
        .filter(option => option.value !== undefined)
        .map(({key, value}) => `.setOption('${key}', ${value})`)
        .join('\n    ');
};
