#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <sys/time.h>
#include <wiringPi.h>
#include <signal.h>

// Pins: http://pi4j.com/pins/model-2b-rev1.html
#define	LED		28	// LED    Pin - wiringPi pin 28 is GPIO 40.
#define	BUTTON		29	// BUTTON Pin - wiringPi pin 29 is GPIO 38.
#define LED_FREQ 	0.4	// LED blinking frequency

float time_diff(struct timeval start);
int change_led (int cur);

void sig_handler(int signo) {
	if (signo == SIGINT)
		printf("Received SIGINT\n");
	else if (signo == SIGKILL)
		printf("Received SIGKILL\n");
	else if (signo == SIGSTOP)
		printf("Received SIGSTOP\n");
	else if (signo == SIGUSR1)
		printf("Received SIGUSR1\n");
	// stop all LEDs or other inputs
	digitalWrite (LED, LOW);
	printf("Stopping LEDs\n");
	exit(0);
}

int main (void) {
	if (signal(SIGINT, sig_handler) == SIG_ERR)
		printf("ERROR: Can't catch SIGINT\n");
	if (signal(SIGUSR1, sig_handler) == SIG_ERR)
		printf("ERROR: Can't catch SIGUSR1\n");
/*	if (signal(SIGKILL, sig_handler) == SIG_ERR)
		printf("ERROR: Can't catch SIGKILL\n");
	if (signal(SIGSTOP, sig_handler) == SIG_ERR)
		printf("ERROR: Can't catch SIGSTOP\n");*/

	struct timeval t_start;
	float seconds;
	int led_status = LOW;

	printf ("Raspberry Pi button & LED blink\n") ;

	wiringPiSetup () ;
 	pinMode (LED, OUTPUT) ;
 	pinMode (BUTTON, INPUT) ;
	gettimeofday(&t_start, NULL);

	// turn LED off first
	digitalWrite (LED, led_status);

	while (1) {
		// Blink LED
		seconds = time_diff(t_start);
		if (seconds >= LED_FREQ) {
			//printf("CHANGE!! %f\n", seconds);
			led_status = change_led(led_status);
			// reset
			gettimeofday(&t_start, NULL);
		}

		// Check button status
		if (digitalRead(BUTTON)) {
			// press Space
			system("xdotool key space");
			printf("Button pressed\n");
			delay (500);	// mS
		}

		delay (50);	// mS
	}
	return 0;
}

int change_led (int cur) {
	if (cur == HIGH) {
		cur = LOW;
	} else {
		cur = HIGH;
	}
	digitalWrite (LED, cur);
	return cur;
}

float time_diff(struct timeval t_start) {
	struct timeval t_cur, t_result;
	float seconds;

	gettimeofday(&t_cur, NULL);
	timersub(&t_cur, &t_start, &t_result);
	seconds = (double)(t_result.tv_sec) + ((float)t_result.tv_usec / 1000000);
	//printf("Time: %f\n", seconds);
	return seconds;
}
