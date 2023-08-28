import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

// pug 설정
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// static 설정
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
// 어떤 URL요청이든 /로 redirect
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on port http://localhost:3000/`);
// app.listen(3000, handleListen);
// http.createServer(app).listen(3000, handleListen);

// http, webSocket 서버
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 아래 코드로 변경
// function handleConnection(socket) { // 여기서의 socket은 연결된 브라우저를 뜻함
//     console.log(socket);
// }

// frontend가 연결하기 위해 필수로 해야 하는 것은 아님
// event listen
const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log('Connected to Browser ✅');
    socket.on("close", () => { console.log("Disconnected from Browser ✖️"); });
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        
        switch (message.type) {
            case "new_message":
                sockets.forEach((aSocket) => 
                    aSocket.send(`${socket.nickname}: ${message.payload}`)
                );
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
    });
});

server.listen(3000, handleListen);