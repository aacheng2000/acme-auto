// index.js
const Sequelize = require ('sequelize')

const STRING = Sequelize.DataTypes.STRING;
const INTEGER = Sequelize.DataTypes.INTEGER;
const BOOLEAN = Sequelize.DataTypes.BOOLEAN;
const UUID = Sequelize.DataTypes.UUID;
const UUIDV4 = Sequelize.DataTypes.UUIDV4;

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/db')





const User = conn.define('user', {
	id : {
		type: UUID,
		defaultValue: UUIDV4,
		primaryKey: true
	},
	name: STRING
});

const Car = conn.define('car', {
	 id : {
		 type: UUID,
		 defaultValue: UUIDV4,
                 primaryKey: true
         },
	name: STRING
})

const Sale = conn.define('sale', {
 id : {
                 type: UUID,
                 defaultValue: UUIDV4,
                 primaryKey: true
	         },
	extendedWarranty: {
		type: BOOLEAN,
		defaultValue: false
	}
});

Sale.belongsTo(User);
Sale.belongsTo(Car);

const syncAndSeed = async()=> {
	await conn.sync({force:true});
	const [moe,lucy,larry]=await Promise.all(
		['moe','lucy','larry'].map(name => User.create({name}))
	)
	const [ford,toyota,audi] = await Promise.all(['Ford','Toyota','Audi'].map(name => Car.create({name})))
	const sales = await Promise.all([
		Sale.create({userId: moe.id, carId: ford.id}),
		Sale.create({userId: moe.id, carId: ford.id, extendedWarranty: true })
	])
}

module.exports = {
	models: {
		User,
		Car,
		Sale
	},
	conn,
	syncAndSeed
}
