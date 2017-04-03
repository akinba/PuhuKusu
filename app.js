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
Bina.findAll({
	limit:1,
	where: {
		geometry: {
			$overlap: Bina.sequelize.fn('ST_MakeEnvelope', 
				29.039443550109862,
				40.9504949760437,
				29.080556449890135,
				40.9895050239563)
		}
	}
}).then((data)=>{
	console.log(data);
});


var server 	= http.createServer(app);
var io 		= socketIO(server);



app.get('/',(req,res)=>{
	//tables.forEach
	tables.Bina.findAll({
		limit: 10/*,
		where: [
			Bina.sequelize.fn('ST_CONTAINS',Bina.sequelize.literal('geometry'),Bina.sequelize.literal('ST_MakePoint(-126.4, 45.32)'))
			]
		*/
	}).then((rows)=>{
		console.log(rows[0].$options.attributes);
		//console.log(rows[0].dataValues);
		var binaGJ={"type":"FeatureCollection","features":[]};
		rows.forEach((row)=>{
			//console.log(row.dataValues);
			binaGJ.features.push(row.dataValues);
		});
		console.log(binaGJ);
		res.render('index',{data: binaGJ, tables: rows[0].$options.attributes});
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
	socket.on('geoData',(data)=>{
		console.log(data.data);
	});
});

server.listen( port, ()=>{
	console.log(`Sunucu ${port}'de calisiyor`  );
});