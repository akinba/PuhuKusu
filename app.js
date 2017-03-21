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
console.log(tables.Bina.attributes);

var server 	= http.createServer(app);
var io 		= socketIO(server);


//tables = [{name: "bina", type:"Polygon", srid:4326},{name: "kapi", type:"Point", srid:4326}]


app.get('/',(req,res)=>{
	//tables.forEach
	tables.Bina.all({
		//attributes: ['type','gid','properties', 'geometry'],
		limit: 20 }).then((rows)=>{
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


// app.get('/',(req,res)=>{
// 	db.query("select json_build_object(\
// 				'type','FeatureCollection',\
// 				'features', json_agg(\
// 				json_build_object(\
// 				'type', 'Feature',\
// 				'properties', json_build_object(\
// 				'gid', gid \
// 				) :: JSON,\
// 				'geometry', st_asgeojson(geom) :: JSON)\
// 				)\
// 				) from bina where gid<200",
// 	{type: sequelize.QueryTypes.SELECT}
// 	).then((data)=>{
// 		console.log(data[0].json_build_object);
// 		res.render('index', {data: data[0].json_build_object, tables: tables});
// 	});
// });

//app.post('/:katman:gid')


server.listen( port, ()=>{
	console.log(`Sunucu ${port}'de calisiyor`  );
});