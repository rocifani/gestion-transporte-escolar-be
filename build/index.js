"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./database/db"));
const routes_1 = __importDefault(require("./routes/routes"));
const cors_1 = __importDefault(require("cors"));
// import fs from 'fs';
// import https from 'https';
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const expiringNotificationsCron_1 = require("./cron/expiringNotificationsCron");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/", routes_1.default);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
// const HTTPS_PORT = 3443;
// const httpsOptions = {
//   key: fs.readFileSync("server.key"),
//   cert: fs.readFileSync("server.cert"),
// }
app.get('/', (_req, res) => {
    res.send(`
    <h1>🚀 Backend activo en Railway</h1>
    <p>El servidor está funcionando correctamente. 🚀 </p>
  `);
});
(0, expiringNotificationsCron_1.startExpiringNotificationsCron)();
(0, expiringNotificationsCron_1.changeStatusOfExpiredAuthorizations)();
db_1.default.initialize()
    .then(() => {
    const httpServer = (0, http_1.createServer)(app);
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: 'https://gestion-transporte-escolar-two.vercel.app',
            credentials: true // si usás cookies o headers de autenticación
        },
    });
    const ubicacionesChoferes = new Map();
    io.on("connection", (socket) => {
        console.log("Cliente conectado", socket.id);
        socket.on("chofer-ubicacion", (data) => {
            ubicacionesChoferes.set(data.tripId, data);
            socket.broadcast.emit("nueva-ubicacion", data);
        });
        // Padre pide la última ubicación del chofer usando tripId
        socket.on("pedir-ultima-ubicacion", (tripId) => {
            const data = ubicacionesChoferes.get(tripId);
            if (data) {
                socket.emit("ultima-ubicacion", data);
            }
            else {
                console.warn(`No se encontró ubicación para el tripId ${tripId}`);
            }
        });
        socket.on("disconnect", () => {
            console.log("Cliente desconectado", socket.id);
        });
    });
    httpServer.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor HTTP con Socket.IO en puerto ${PORT}`);
    });
})
    .catch((error) => console.error(error));
