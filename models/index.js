const pg		= require("pg");
const sequelize = require("sequelize");
const os		= require("os");

//Database connection
if (os.hostname()=='raspi') {
	var db = new sequelize("postgres://postgres:pi@localhost:5432/puhu");
} else {
	var db = new sequelize("postgres://postgres:pi@www.akinba.com:5432/puhu");
}


var models = [ 'Bina', 'Kapi'];

models.forEach((model)=>{
	module.exports[model] = db.import(__dirname + '/' + model);
});



db.sync({force: false});




module.exports.sequelize = sequelize;