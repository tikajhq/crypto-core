#!/usr/bin/env bash
nohup ./tail-slack.sh "/var/log/apache2/portal.access.log" "https://chat.tik.co/hooks/1u76pcght7gs3mqocxo193c96a" " 500 " > tail-slack.out 2> tail-slack.err < /dev/null &
nohup ./tail-slack.sh "/var/log/apache2/portal.access.log" "https://chat.tik.co/hooks/1u76pcght7gs3mqocxo193c96a" " 400 " > tail-slack.out 2> tail-slack.err < /dev/null &
nohup ./tail-slack.sh "/var/log/apache2/portal.access.log" "https://chat.tik.co/hooks/1u76pcght7gs3mqocxo193c96a" " 404 " > tail-slack.out 2> tail-slack.err < /dev/null &
nohup ./tail-slack.sh "/var/log/apache2/portal.error.log" "https://chat.tik.co/hooks/1u76pcght7gs3mqocxo193c96a" "" > tail-slack.out 2> tail-slack.err < /dev/null &
nohup ./tail-slack.sh "/var/www/web/application/logs/log-2018-02-21.php" "https://chat.tik.co/hooks/1u76pcght7gs3mqocxo193c96a" "" > tail-slack.out 2> tail-slack.err < /dev/null &
