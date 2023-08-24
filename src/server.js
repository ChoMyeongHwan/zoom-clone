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

const handleListen = () => console.log("Listening on port http://localhost:3000/");
app.listen(3000, handleListen);