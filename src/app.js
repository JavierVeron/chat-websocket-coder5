import express from "express"
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import {Server, Socket} from "socket.io"
import viewsRouter from "./routes/viewsRouter.js"

const app = express()
const port = 8080
const httpServer = app.listen(port, () => {
    console.log("Servidor activo: " + port);
})
const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.get("/", viewsRouter);

// Array de mensajes
const mensajes = [];

const generarId = () => {
    return mensajes.length + 1;
}

socketServer.on("connection", socket => {
    console.log("Nuevo Usuario Conectado!");

    socket.on("nuevoUsuario", data => {
        socket.broadcast.emit("nuevoUsuario", data + " se ha unido al Chat!");
    })

    // Envio los mensajes
    socket.emit("mensajes", mensajes);

    // Recibo los mensajes
    socket.on("mensajes", data => {
        const nuevoMensaje = {socketId:generarId(), usuario:data.usuario, mensaje:data.mensaje};
        mensajes.push(nuevoMensaje);
        socketServer.emit("mensajes", mensajes);
    })
})