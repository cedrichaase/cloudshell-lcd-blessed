import { DataProvider } from "./src/data-provider";

const blessed = require('blessed');

(async function main() {


    function getStyle(fg, bg) {
        return {
            fg: fg,
            bg: bg,
            border: {
                fg: bg,
                bg: bg
            }
        }
    }

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
        style: getStyle('white', 'blue')
    });

    // Append our box to the screen.
    theScreen.append(box);

    provider.on('data', function(data) {

        box.setContent(
`{bold}cpu{/bold} ${data.cpu || 0}%
{bold}/mnt/vault{/bold} ${data.fsUsage ? data.fsUsage.usedPercent : '?'}
{bold}temp{/bold} ${data.temp || 0}°C`);
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