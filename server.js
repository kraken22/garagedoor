const gpio = require('rpi-gpio');
const express = require('express');
const app = express();
const server = app.listen(7000);
app.use(express.static('public'));

const io = require('socket.io')(server);

var gpioState = false;

// Setup gpio pin
const PIN_NUMBER = 8;
gpio.setup(PIN_NUMBER, gpio.DIR_OUT, function () {
  writeToPin(false);
});

io.on('connection', function (socket) {

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



});

function writeToPin(on) {
  gpio.write(PIN_NUMBER, on, function (err) {
    if (err) throw err;
    
  })
}
