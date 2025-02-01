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

        const footerOptions = [
            {key: 'countRows', value: footer.countRows},
            {key: 'enablePagination', value: footer.enablePagination},
            {key: 'fields', value: footer.fields?.length !== 0 ? footer.fields : undefined},
            {
                key: 'reducer',
                value:
                    footer.reducer.length !== 0
                        ? `[${footer.reducer.map(reducer => `'${reducer}'`).join(', ')}]`
                        : undefined,
            },
            {key: 'show', value: footer.show},
        ].filter(option => option.value !== undefined);

        return `{${footerOptions.map(option => `${option.key}: ${option.value}`).join(',\n')}}`;
    };

    const generateSortByOptions = (sortBy?: TableSortByFieldState[]) => {
        if (sortBy === undefined) {
            return undefined;
        }

        return `[${sortBy.map(sort => `{displayName: '${sort.displayName}'${sort.desc !== undefined ? `, desc: ${sort.desc}` : ''}}`)}]`;
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
        .map(({key, value}) => `.setOption('${key}', ${value})`)
        .join('\n    ');
};
