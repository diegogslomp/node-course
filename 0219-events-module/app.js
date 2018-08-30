const EventEmitter = require('events');
const emitter = new EventEmitter();

// Registe a listener
emitter.on('messageLogged', (arg) => {
  console.log('Listener called', arg);
});

//Raise an event
emitter.emit('messageLogged', { id: 1, url: 'http://' });

// Raise: logging (data: message)
emitter.on('logging', (data) => {
  console.log(data);
});

emitter.emit('logging', 'message');