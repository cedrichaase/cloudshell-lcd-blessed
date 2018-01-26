import { DataProvider } from "./src/data-provider";
import {heatMap, labelbar} from "./src/visualization";

const blessed = require('blessed');

(async function main() {
    const provider = new DataProvider();

    // Create a screen object.
    const theScreen = blessed.screen({
        smartCSR: true
    });

    // theScreen.title = 'my window title';

    // Create a box perfectly centered horizontally and vertically.
    const box = blessed.box({
        top: 'center',
        left: 'center',
        width: '100%',
        height: '100%',
        content: ``,
        tags: true,
        border: {
            type: 'bg'
        },
        style: {
            fg: 'white',
            bg: 'purple',
            border: {
                bg: 'black'
            }
        }
    });

    const tempSet = labelbar({
        parent: box,
        label: 'temp',
        value: 0,
        unit: 'C',
        useHeatMap: true,
        bottom: 0
    });

    const memSet = labelbar({
        parent: box,
        label: 'mem',
        value: 0,
        unit: '%',
        useHeatMap: true,
        bottom: 2
    });

    const cpuSet = labelbar({
        parent: box,
        label: 'cpu',
        value: 0,
        unit: '%',
        useHeatMap: true,
        bottom: 4
    });

    const fsSet = labelbar({
        parent: box,
        label: 'btrfs',
        value: 0,
        unit: '%',
        useHeatMap: true,
        bottom: 6
    });

    // Append our box to the screen.
    theScreen.append(box);

    provider.on('data', function(data) {
        box.setContent(`{bold}{red-fg}${data.hostname || ''}{/}`);

        cpuSet.updateValue(Math.round(data.cpu) || 0);
        tempSet.updateValue(data.temp || 0);
        fsSet.updateValue(data.fsUsage ? data.fsUsage.usedPercent : 0);
        memSet.updateValue(data.mem || 0);

        theScreen.render();
    });

    // Quit on Escape, q, or Control-C.
    theScreen.key(['escape', 'q', 'C-c'], function(ch, key) {
        return process.exit(0);
    });

    // Focus our element.
    box.focus();

    // Render the screen.
    theScreen.render();

})();