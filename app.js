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
		type: sequelize.GEOMETRY('Polygon',4326)
	}
},
{
	freezeTableName: true
});
db.sync({force: false});

bina.findOrCreate(
{
	where: {
		gid: 3
	},
	defaults: {
		bina_adi: 'test',
		geom: {
			type: 'Polygon',
			coordinates: [
				[[26.9668150773239,39.5980355463212],
				[26.9669486288099,39.5980339361376],
				[26.9669409282849,39.597970679018],
				[26.9668196798476,39.5979788857023],
				[26.9668150773239,39.5980355463212]]
			],
			crs: {type: 'name', properties: {name: 'EPSG:4326'}}
		}
	}
}).spread((bina,created)=>{});

/*bina.create({bina_adi: 'test', geom: { type: 'Polygon', coordinates: [
			[[26.9668150773239,39.5980355463212],
			[26.9669486288099,39.5980339361376],
			[26.9669409282849,39.597970679018],
			[26.9668196798476,39.5979788857023],
			[26.9668150773239,39.5980355463212]]
                ],
            	crs: { type: 'name', properties: { name: 'EPSG:4326'}}}
            }).then((ress)=>{
            	console.log(ress);
            });*/

app.get('/',(req,res)=>{
	db.query("select json_build_object(\
				'type','FeatureCollection',\
				'features', json_agg(\
				json_build_object(\
				'type', 'Feature',\
				'properties', json_build_object(\
				'gid', gid \
				) :: JSON,\
				'geometry', st_asgeojson(geom) :: JSON)\
				)\
				) from bina where gid<500",
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