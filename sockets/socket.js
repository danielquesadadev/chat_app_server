const { checkJWT } = require("../helpers/jwt");
const { io } = require("../index");
const {
  userConnected,
  userDisconnected,
  saveMessage,
} = require("../controllers/socket");

// Mensajes de Sockets
io.on("connection", (client) => {
  const [valid, uid] = checkJWT(client.handshake.headers["x-token"]);

  // Verify auth
  if (!valid) {
    return client.disconnect();
  }

  // User auth
  userConnected(uid);

  // Join user to private room
  // global - client.id
  client.join(uid);

  // Listen private message of client
  client.on("message-private", async (payload) => {
    await saveMessage(payload);
    io.to(payload.to).emit("message-private", payload);
  });

  client.on("disconnect", () => {
    userDisconnected(uid);
  });
});
