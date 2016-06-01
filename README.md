Initial Setup:
```
git clone https://github.com/joelpereira/photobooth-button; cd photobooth-button
sudo apt-get install xdotool
make
```

Start:
```
./admin-console.sh restart
```

It will start the button code along with a php web server for managing the whole thing.
```
http://<server_name>:8001/
```


To just start the button control:
```
./button
```

