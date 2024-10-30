const cookieParser = require("cookie-parser");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
// const { createClient } = require("redis");
require("dotenv").config();
const userRoute = require("./routes/userRoute");
const connectDB = require("./config/database");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
// const client = createClient({
//   password: 'Cg469ceAYfcDTqnJY54wd9N3TZ1BBFOv',
//   socket: {
//     host: 'redis-14651.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
//     port: 14651,
//   },
// });

// client.connect().then(() => {
//   console.log("Connected to Redis");
// }).catch(err => {
//   console.error("Redis connection error:", err);
// });
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const CorsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(CorsOptions));
app.use("/api/v6/users", userRoute);
io.on("connection", async (socket) => {
  const { userId, role,metamaskId } = socket.handshake.query;
  console.log(`User connected: ID=${userId}, Role=${role}, SocketID=${socket.id}`);
  socket.role = role;
  socket.userId = userId;
  socket.metamaskId=metamaskId;
  try {
    // await client.sAdd(`user:${role}`, userId);
    console.log(`User added to Redis with Role=${role}, ID=${userId}`);
  } catch (err) {
    console.error("Error adding user to Redis:", err);
  }
  socket.on("sendsinglenotification", async (data) => {
    console.log("Button click received");
    try {
      // await client.lPush(`notification:${data.metamaskId}`, JSON.stringify(data));
      console.log(`Notification sent to ${data.metamaskId}`);
    } catch (err) {
      console.error("Error sending single notification:", err);
    }
  });
 ////still not tested
  // socket.on("sendtoallbuyers", async (data) => {
  //   try {
  //     const buyers = await client.sMembers("user:buyer");
  //     for (const id of buyers) {
  //       await client.lPush(`notification:${id}`, JSON.stringify(data));
  //     }
  //     console.log("Notification sent to all buyers");
  //   } catch (err) {
  //     console.error("Error sending to all buyers:", err);
  //   }
  // });
  // const notificationInterval = setInterval(async () => {
  //   try {
  //     const result = await client.rPop(`notification:${socket.metamaskId}`);
  //     console.log(result)
  //     if (result) {
  //       console.log(result)
  //       const message = JSON.parse(result);
  //       console.log("meaage arived",message)
  //       socket.emit("notification", message);
  //     }
  //   } catch (err) {
  //     console.error("Error retrieving notification:", err);
  //   }
  // }, 1000); 
  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);
    // clearInterval(notificationInterval);
    try {
      // await client.sRem(`user:${role}`, userId);
      console.log(`User removed from Redis with Role=${role}, ID=${userId}`);
    } catch (err) {
      console.error("Error removing user from Redis:", err);
    }
  });
});
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
