const blessed = require('blessed');

export const heatMap = (value) => {
    if (value < 25) {
        return 'blue';
    } else if (value < 50) {
        return 'green';
    } else if (value < 75) {
        return 'yellow';
    }  else {
        return 'red';
    }
};

interface ProgressSetOptions {
    parent: any,
    label: string,
    value: number,
    unit: string,
    useHeatMap: boolean,
    top?: number|string,
    bottom?: number|string
}

export const labelbar = (options: ProgressSetOptions) => {
    const bar = blessed.progressbar({
        parent: options.parent,
        bottom: options.bottom,
        left: '25%',
        // pch: 'X',
        width: '72%',
        height: '10%',
        filled: 0,
        orientation: 'horizontal',
        style: {
            fg: 'black',
            bg: 'black',
            bar: {
                bg: 'white',
                fg: 'white'
            }
        }
    });

    const tempBox = blessed.box({
        parent: options.parent,
        bottom: options.bottom,
        left: 0,
        right: 2,
        height: '10%',
        width: '25%',
        tags: true
    });

    const updateLabel = (value) => {
        let valueString = `${value}${options.unit}`;

        if (options.useHeatMap) {
            // const color = heatMap(value);
            // valueString = `{${color}}${valueString}{/${color}}`;
        }

        tempBox.setContent(`{bold}${options.label}{/bold} ${valueString}`);
    };

    const updateBar = (value) => {
        bar.setProgress(value);

        if (options.useHeatMap) {
            bar.style.bar.bg = heatMap(value);
        }
    };

    const updateValue = (value) => {
        updateLabel(value);
        updateBar(value);
    };

    return { updateValue }
};
