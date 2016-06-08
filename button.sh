#!/bin/bash

BUTTON_LOG=log/button_out.log
BUTTON_PID=log/button_pid.log

# functions
do_start() {
	sudo ./button 1>>$BUTTON_LOG 2>>&1 &
	echo $! > $BUTTON_PID
	echo "Started Button Script"
}

do_stop() {
	if [ -f "$BUTTON_PID" ]
	then
		PID=`cat $BUTTON_PID`
		sudo kill -USR1 $PID >/dev/null 2>/dev/null
		rm -f $BUTTON_PID
		echo "Stopped Button Script"
	else
		echo "Button Script not running"
	fi
}

case "$1" in
	restart|reload|start)
		do_stop
		do_start
		;;
	stop)
		do_stop
		;;
	*)
		echo "Usage: $0 start|stop|restart" >&2
		exit 3
		;;
esac

exit 0

