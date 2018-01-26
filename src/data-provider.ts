import { EventEmitter } from "events";
const util = require('util');

const runCmd = util.promisify((cmd, args, callBack ) => {
    const spawn = require('child_process').spawn;
    const child = spawn(cmd, args || []);
    let resp = "";

    child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    child.stdout.on('end', function() { callBack (null, resp) });
});

const df = async (mountpoint) => {
    const text = await runCmd('df', ['-h', mountpoint]);

    const lines = text.split('\n');

    const mountLine = lines.find(l => l.includes(mountpoint));

    const matches = mountLine.match(/\S+/gi);

    return {
        filesystem: matches[0],
        size: matches[1],
        used: matches[2],
        available: matches[3],
        usedPercent: parseInt(matches[4].replace('%', '')),
        mountedOn: matches[5]
    };
};

const cpu = async () => {
    const text = await runCmd('mpstat', ['1', '1']);
    const lines = text.split('\n');
    const avgLine = lines.find(l => l.includes('Average'));
    const matches = avgLine.match(/\S+/gi);

    return (100 - parseFloat(matches.slice(-1))).toFixed(2);
};

let mem = async () => {
    const text = await runCmd('cat', ['/proc/meminfo']);
    const lines = text.split('\n');
    const totalLine = lines.find(l => l.includes('MemTotal'));
    const availLine = lines.find(l => l.includes('MemAvailable'));

    const total = parseInt(totalLine.match(/\S+/gi)[1]);
    const avail = parseInt(availLine.match(/\S+/gi)[1]);

    const used = total - avail;

    return Math.round((used / total) * 100);
};

const temp = async () => {
    const text = await runCmd('cat', ['/sys/class/thermal/thermal_zone0/temp']);
    return parseInt(text) / 1000;
};

const hostname = async() => {
    return (await runCmd('uname', ['-n', '-r']));
};

export class DataProvider extends EventEmitter {
    private cpuTimer;
    private fsUsageTimer;
    private tempTimer;
    private hostnameTimer;
    private memTimer;

    private publishTimer;

    private data: any = {};

    constructor() {
        super();

        this.cpuTimer = setInterval(async () => {
            this.data.cpu = await cpu();
        }, 2000);

        this.fsUsageTimer = setInterval(async () => {
            this.data.fsUsage = await df('/mnt/vault');
        }, 10000);

        this.tempTimer = setInterval(async () => {
            this.data.temp = await temp();
        }, 1000);

        this.hostnameTimer = setInterval(async () => {
            this.data.hostname = await hostname();
        }, 1000);

        this.memTimer = setInterval(async () => {
            this.data.mem = await mem();
        }, 1000);

        this.publishTimer = setInterval(() => {
            this.emit('data', this.data);
        }, 1000);
    }
}


//
// (async function main() {
//     console.log(await df('/mnt/vault'));
//     console.log(await cpu());
// })();
