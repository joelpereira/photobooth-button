#!/bin/sh

# functions
do_start () {
	sudo python photobooth-button.py >log/out.log 2>>log/out.log &
	echo $! > log/pid.log
	echo PID:
	cat log/pid.log
}

do_stop() {
	PID=`cat log/pid.log`
	sudo kill $PID >/dev/null
	rm -f log/pid.log
}


case "$1" in
	start)
		do_start
		;;
	restart|reload)
		do_stop
		do_start
		;;
	stop)
		do_stop
		;;
	status)
		exit 0
		;;
	*)
		echo "Usage: $0 start|stop|restart" >&2
		exit 3
		;;
esac

