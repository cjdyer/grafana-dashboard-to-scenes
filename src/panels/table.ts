import {TableCellHeight, TableFooterOptions, TableSortByFieldState} from '@grafana/schema';
import {createEnumLookup, OptionsString} from '../utils';

export interface TablePanelOptions {
    cellHeight?: TableCellHeight;
    footer?: TableFooterOptions;
    frameIndex?: number;
    showHeader?: boolean;
    showTypeIcons?: boolean;
    sortBy?: TableSortByFieldState[];
}

const tableCellHeightMap = createEnumLookup('TableCellHeight', TableCellHeight);

export const generateTableOptions = (options?: TablePanelOptions): string => {
    if (!options) {
        return '';
    }

    const generateFooterOptions = (footer?: TableFooterOptions) => {
        if (footer === undefined) {
            return undefined;
        }

        return JSON.stringify(footer);
    };

    const generateSortByOptions = (sortBy?: TableSortByFieldState[]) => {
        if (sortBy === undefined) {
            return undefined;
        }

        return JSON.stringify(sortBy);
    };

    const tableOptions: OptionsString<TablePanelOptions>[] = [
        {
            key: 'cellHeight',
            value:
                options.cellHeight !== undefined
                    ? tableCellHeightMap[options.cellHeight]
                    : undefined,
        },
        {key: 'footer', value: generateFooterOptions(options.footer)},
        {key: 'frameIndex', value: options.frameIndex},
        {key: 'showHeader', value: options.showHeader},
        {key: 'showTypeIcons', value: options.showTypeIcons},
        {key: 'sortBy', value: generateSortByOptions(options.sortBy)},
    ];

    return tableOptions
        .filter(option => option.value !== undefined)
        .map(({key, value}) => `.setOption('${key}', ${JSON.stringify(value)})`)
        .join('\n    ');
};
