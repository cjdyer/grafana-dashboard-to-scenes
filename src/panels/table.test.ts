import {generateTableOptions, TablePanelOptions} from './table';

describe('generateTableOptions', () => {
    it('should return empty string when options are undefined', () => {
        expect(generateTableOptions(undefined)).toBe('');
    });

    it('should generate options string correctly', () => {
        const options = {
            showHeader: true,
        } as TablePanelOptions;

        expect(generateTableOptions(options)).toContain(".setOption('showHeader', true)");
    });
});
