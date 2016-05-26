#!/bin/sh

# functions
do_start () {
	coffee app.coffee >out.log 2>>out.log &
	echo $! > out.log
	echo PID:
	cat pid.log
}

do_stop() {
	PID=`cat pid.log`
	kill $PID
	rm -f pid.log
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

