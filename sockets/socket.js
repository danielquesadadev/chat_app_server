const { checkJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { userConnected, userDisconnected } = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', client => {
        
    const [valid, uid] = checkJWT(client.handshake.headers['x-token']);

    // Verify auth
    if (!valid) { return client.disconnect(); }

    // User auth
    userConnected( uid );

    client.on('disconnect', () => {
        userDisconnected(uid);
    });

    /* client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    }); */


});
