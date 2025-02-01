import {generateGaugeOptions, GaugePanelOptions} from './gauge';

describe('generateGaugeOptions', () => {
    it('should return empty string when options are undefined', () => {
        expect(generateGaugeOptions(undefined)).toBe('');
    });

    it('should generate options string correctly', () => {
        const options = {
            minVizHeight: 100,
            showThresholdLabels: true,
        } as GaugePanelOptions;

        expect(generateGaugeOptions(options)).toContain(".setOption('minVizHeight', 100)");
        expect(generateGaugeOptions(options)).toContain(".setOption('showThresholdLabels', true)");
    });
});
