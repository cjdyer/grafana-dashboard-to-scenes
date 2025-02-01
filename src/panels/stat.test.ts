import {generateStatOptions, StatPanelOptions} from './stat';

describe('generateStatOptions', () => {
    it('should return empty string when options are undefined', () => {
        expect(generateStatOptions(undefined)).toBe('');
    });

    it('should generate options string correctly', () => {
        const options = {
            wideLayout: true,
        } as StatPanelOptions;

        expect(generateStatOptions(options)).toContain(".setOption('wideLayout', true)");
    });
});
