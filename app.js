const express	= require("express");
const app		= express();
const bodyparser = require("body-parser");
const morgan	= require("morgan");
const socketIO	= require("socket.io");
const http		= require("http");
//var tables		= require("./models");
var port=process.env.PORT||3005;

//console.log(tables.Bina.attributes);

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.set("view engine", "ejs");
app.use(express.static('static'));

app.set('models', require('./models'));
var tables= app.get('models');
var Bina= tables.Bina;



var server 	= http.createServer(app);
var io 		= socketIO(server);



app.get('/',(req,res)=>{
	//tables.forEach
	tables.Bina.findAll({
		limit: 20
	}).then((rows)=>{
		console.log(rows[0].$options.attributes);
		//console.log(rows[0].dataValues);
		var binaGJ={"type":"FeatureCollection","features":[]};
		rows.forEach((row)=>{
			//console.log(row.dataValues);
			binaGJ.features.push(row.dataValues);
		});
		console.log(binaGJ);
		res.render('index'/*,{data: binaGJ, tables: rows[0].$options.attributes}*/);
	});
});

app.get('/test/:katman',(req,res)=>{
	res.send(req.params.katman);

	// (req.params.katman).all({limit: 1}).then((data)=>{
	// 	console.log(data);
	// });
});

io.on('connection',(socket)=>{
	console.log(`${socket.id} connected`);
	socket.on('bbox',(data)=>{
		console.log(data);
		Bina.findAll({
			//limit:1,
			where: {
				geometry: {
					$overlap: Bina.sequelize.fn('ST_MakeEnvelope', 
						data[0],
						data[1],
						data[2],
						data[3])
				}
			}
		}).then((rows)=>{
			console.log(rows);
			var binaGJ={"type":"FeatureCollection","features":[]};
			rows.forEach((row)=>{
				binaGJ.features.push(row.dataValues);
			});
			io.sockets.sockets[socket.id].emit('layerBina', binaGJ);
		});
	});
});

server.listen( port, ()=>{
	console.log(`Sunucu ${port}'de calisiyor`  );
});