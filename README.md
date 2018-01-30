# cloudshell-lcd-blessed

A fancier status display for Hardkernel's Cloudshell 2 ODroid XU4 NAS Case.

<img src="https://user-images.githubusercontent.com/13900565/35587393-f5f7cfe6-05fd-11e8-9446-bd7ec96c0739.jpg"/>

## Features

* Realtime stats
* Less cluttered than the standard shell script
* Stat values mapped to colors

## Planned features

* Simple configurability and extensibility via config file




## Development

On your XU4, fire up a shell and enter:
```bash
git clone git@github.com/cedrichaase/cloudshell-lcd-blessed
cd cloudshell-lcd-blessed
npm install
node app > /dev/tty1
```

## Installation

Follow the development setup guide.
If you want to use cloudshell-lcd-blessed permanently, you might want to add a systemd service file for it:

```ini
[Unit]
Description=CloudShell Blessed LCD

[Service]
ExecStart=/bin/sh -c "/path/to/node /path/to/cloudshell-lcd-blessed/app.js > /dev/tty1"

[Install]
WantedBy=multi-user.target
``` 

Substitute the dummy paths for actual paths of the `node` executable and `app.js`
and save the contents to `/etc/systemd/system/cloudshell-lcd-blessed.service`.

## Usage

After bootup, start the service *manually* by executing
```bash
systemctl start cloudshell-lcd-blessed
```

Starting the service automatically on bootup does not yet work because `blessed` does not refresh the entire screen,
causing it to conflict with the `getty` login that is started on `/dev/tty1` by default. 
