import express from "express";
import dotenv from "dotenv";
import AppDataSource from "./database/db";
import routes from "./routes/routes";
import cors from 'cors';
// import fs from 'fs';
// import https from 'https';
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { startExpiringNotificationsCron, changeStatusOfExpiredAuthorizations } from "./cron/expiringNotificationsCron";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", routes);


const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// const HTTPS_PORT = 3443;

// const httpsOptions = {
//   key: fs.readFileSync("server.key"),
//   cert: fs.readFileSync("server.cert"),
// }

app.get('/', (_req, res) => {
  res.send(`
    <h1>🚀 Backend activo en Railway 🚀</h1>
    <p>El servidor está funcionando correctamente.</p>
  `);
});

startExpiringNotificationsCron();
changeStatusOfExpiredAuthorizations();

AppDataSource.initialize()
  .then(() => {
    const httpServer = createServer(app);
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: 'https://gestion-transporte-escolar-two.vercel.app',
        credentials: true // si usás cookies o headers de autenticación
      },
    });

    const ubicacionesChoferes = new Map<number, any>();

    io.on("connection", (socket) => {
      console.log("Cliente conectado", socket.id);

      socket.on("chofer-ubicacion", (data: { lat: number, lng: number, tripId: number }) => {
        ubicacionesChoferes.set(data.tripId, data);
        socket.broadcast.emit("nueva-ubicacion", data);
      });

      // Padre pide la última ubicación del chofer usando tripId
      socket.on("pedir-ultima-ubicacion", (tripId: number) => {
        const data = ubicacionesChoferes.get(tripId);
        if (data) {
          socket.emit("ultima-ubicacion", data);
        } else {
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
