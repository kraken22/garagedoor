const express = require('express');
const app = express();
const server = app.listen(7000);
app.use(express.static('public'));

const io = require('socket.io')(server);

var gpioState = false;

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
  console.log('Written ' + on + " to pin");
}
