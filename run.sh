#!/usr/bin/env bash
rsync -avr --delete --exclude .git --exclude .idea --exclude *.ts /Users/cedric/git/blessed-test root@cryptkeeper: && ssh root@cryptkeeper "systemctl restart blessed-lcd"