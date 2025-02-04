import {
    LegendDisplayMode,
    OptionsWithTimezones,
    SortOrder,
    TooltipDisplayMode,
    VizLegendOptions,
    VizOrientation,
    VizTooltipOptions,
    // eslint-disable-next-line n/no-unpublished-import
} from '@grafana/schema';
import {createEnumLookup, OptionsString, orientationMap} from '../utils';

export interface TimeseriesPanelOptions extends OptionsWithTimezones {
    legend?: VizLegendOptions;
    orientation?: VizOrientation;
    tooltip?: VizTooltipOptions;
}

const legendDisplayModeMap = createEnumLookup('LegendDisplayMode', LegendDisplayMode);
const tooltipDisplayModeMap = createEnumLookup('TooltipDisplayMode', TooltipDisplayMode);
const sortOrderMap = createEnumLookup('SortOrder', SortOrder);

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
                value:
                    legend.displayMode !== undefined
                        ? legendDisplayModeMap[legend.displayMode]
                        : undefined,
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
                value: tooltip.mode !== undefined ? tooltipDisplayModeMap[tooltip.mode] : undefined,
            },
            {
                key: 'sort',
                value: tooltip.sort !== undefined ? sortOrderMap[tooltip.sort] : undefined,
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
            value:
                options.orientation !== undefined ? orientationMap[options.orientation] : undefined,
        },
        {key: 'tooltip', value: generateTooltipOptions(options.tooltip)},
        {key: 'timezone', value: generateTimezoneOptions(options.timezone)},
    ];

    return timeseriesOptions
        .filter(option => option.value !== undefined)
        .map(({key, value}) => `.setOption('${key}', ${value})`)
        .join('\n    ');
};
