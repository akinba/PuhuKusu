module.exports = (db,sequelize)=>{
var Bina= db.define('bina',
{
	gid:{
		type: sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	type:{
		type: sequelize.STRING(10),
		defaultValue: 'Feature'
	},
	properties:{
		type: sequelize.JSON
	},
	geometry: {
		type: sequelize.GEOMETRY('Polygon',4326)
	},
	status: {
		type: sequelize.ENUM,
		values: ['active','deleted'],
		defaultValue: 'active'
	},
},{
	freezeTableName: true
});

return Bina;
};