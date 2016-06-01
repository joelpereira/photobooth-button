#!/bin/sh

PORT=7999

ADMIN_LOG=log/admin_out.log
ADMIN_PID=log/admin_pid.log
WWW_DIR=admin

# functions
do_start () {
	sudo /usr/bin/php5 -S 0.0.0.0:$PORT -t "$WWW_DIR"   >$ADMIN_LOG 2>>$ADMIN_LOG &
	echo $! > $ADMIN_PID
	echo "Started Admin Web Console"
}

do_stop() {
	PID=`cat $ADMIN_PID`
	sudo kill $PID >/dev/null 2>/dev/null
	rm -f $ADMIN_PID
	echo "Stopped Admin Web Console"
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

