const express	= require("express");
const app		= express();
const bodyparser = require("body-parser");
const pg		= require("pg");
const sequelize = require("sequelize");
const morgan	= require("morgan");
const socketIO	= require("socket.io");
const http		= require("http");
var port=process.env.PORT||3005;

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.set("view engine", "ejs");
app.use(express.static('static'));

var server 	= http.createServer(app);
var io 		= socketIO(server);

var db = new sequelize("postgres://postgres:pi@www.akinba.com:5432/edremit");

app.get('/',(req,res)=>{
	res.render('index');
});


server.listen( port, ()=>{
	console.log(`Sunucu ${port}'de calisiyor`  );
	//console.log(db.Sequelize);
});