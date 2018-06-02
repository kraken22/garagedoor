const gpio = require('rpi-gpio');
const express = require('express');
const app = express();
const server = app.listen(7000);
app.use(express.static('public'));

const io = require('socket.io')(server);

var gpioState = false;

// Setup gpio pin
const PIN_NUMBER = 12;
gpio.setup(PIN_NUMBER, gpio.DIR_OUT, function () {
  writeToPin(false);
});

var socketNum = 0;

io.on('connection', function (socket) {
  socketNum++;
  socket.socketNum = socketNum;
  console.log('Socket number ' + socket.socketNum + ' connected!');

  socket.emit('btnState', gpioState);

  socket.on('doorBtnDown', function () {
      if(!gpioState){
        gpioState = true;
        writeToPin(gpioState);
        io.sockets.emit('btnState', gpioState);
      }
  });

  socket.on('doorBtnUp', function () {
    if(gpioState){
      gpioState = false;
      writeToPin(gpioState);
      io.sockets.emit('btnState', gpioState);
    }
  });

  socket.on('disconnect', function () {
    console.log('Socket number ' + socket.socketNum + ' disconnected.');
  });

});

function writeToPin(on) {
  gpio.write(PIN_NUMBER, on, function (err) {
    if (err) throw err;
    console.log('Wrote ' + on + ' to pin');
  })
}
