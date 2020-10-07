const { io } = require('../server');
const {TicketControl} = require('../classes/ticket-control');


const ticketControl = new TicketControl();

io.on('connection', (client) => {

  client.on('siguienteTicket', (data, callback) => {
      let next = ticketControl.siguiente();
    console.log(next);
    callback(next);
  });

  client.emit('estadoActual',  {
    actual: ticketControl.getUltimoTicket(),
    ultimos4:ticketControl.getUltimos4()
  });
  client.on('atenderTicket', (data,callback) => {
    if(!data.escritorio){
      return callback({
        err:true,
        msg:'El escritorio es necesario'
      });
    }
    let atenderTicket = ticketControl.atenderTicket(data.escritorio);

    callback(atenderTicket);
    // actualizar/ notificar cambios en los ULTIMOS 4
    client.broadcast.emit('ultimos4',{
      ultimos4:ticketControl.getUltimos4()
    });
  });

});