const express	= require("express");
const app		= express();
const bodyparser = require("body-parser");
const pg		= require("pg");
const sequelize = require("sequelize");
const morgan	= require("morgan");
const socketIO	= require("socket.io");
const http		= require("http");
var port=process.env.PORT||3006;

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.set("view engine", "ejs");
app.use(express.static('static'));

var server 	= http.createServer(app);
var io 		= socketIO(server);

var db = new sequelize("postgres://postgres:pi@www.akinba.com:5432/puhu");
var bina= db.define('bina',
{
	gid: {
		type: sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	bina_adi: {
		type: sequelize.STRING
	},
	geom: {
		type: sequelize.GEOMETRY('POLYGON',4326)
	}
},
{
	freezeTableName: true
});
db.sync({force: false});

bina.findOrCreate(
{
	where: {
		gid: 2
	},
	defaults: {
		bina_adi: 'test',
		geom: {
			type: 'POLYGON',
			coordinates: [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],[100.0, 1.0], [100.0, 0.0]],
			crs: {type: 'name', properties: {name: 'EPSG:4326'}}
		}
	}
}).spread((bina,created)=>{});

app.get('/',(req,res)=>{
	db.query("select json_build_object(\
				'type','FeatureCollection',\
				'features', json_agg(\
				json_build_object(\
				'type', 'Feature',\
				'properties', json_build_object(\
				'gid', gid,\
				'bina_adi', bina_adi\
				) :: JSON,\
				'geometry', st_asgeojson(geom) :: JSON)\
				)\
				) from bina",
	{type: sequelize.QueryTypes.SELECT}
	).then((data)=>{
		console.log(data[0].json_build_object);
		res.render('index', {data: data[0].json_build_object});
	});
});

//app.post('/:katman:gid')


server.listen( port, ()=>{
	console.log(`Sunucu ${port}'de calisiyor`  );
});