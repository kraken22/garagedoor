var socket = io(window.location.href);
var connectedState = document.getElementById('connectedState');
var garageBtn = document.getElementById('garageBtn');

garageBtn.addEventListener('touchstart', btnDown);
garageBtn.addEventListener('touchend', btnUp);

socket.on('connect', function () {
  connectedState.className = "connected";
  connectedState.innerHTML = "Connected";
});

socket.on('disconnect', function () {
  connectedState.className = "not-connected";
  connectedState.innerHTML = "Not Connected";
});

socket.on('btnState', function (state) {
  if(!state) {
    garageBtn.className = "connected";
  } else {
    garageBtn.className = "not-connected";
  }
});

function btnDown(e){
  socket.emit('doorBtnDown');
  cancelEvent(e);
}

function btnUp(e){
  socket.emit('doorBtnUp');
  cancelEvent(e);
}

function cancelEvent(event) {
  var e = event || window.event;
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}
