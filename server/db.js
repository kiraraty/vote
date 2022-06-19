const {Sequelize,DataTypes,Model}=require('sequelize')
const path=require('path')
const dbFile = path.join(__dirname, 'db.sqlite3')
var sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: dbFile,
	logging: false,//关闭sql log
});

class User extends Model { }
exports.User = User
exports.sequelize = sequelize

User.init({
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	salt: {
		type: DataTypes.STRING,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	gender: {
		type: DataTypes.ENUM('f', 'm'),
		allowNull: false,
	},
	avatar: {
		type: DataTypes.STRING,
	}
}, {
	sequelize, // We need to pass the connection instance
	modelName: 'User' // We need to choose the model name
})
class Vote extends Model { }
exports.Vote = Vote
Vote.init({
	title: DataTypes.STRING,
	desc: DataTypes.STRING,
	deadline: DataTypes.DATE,
	multiSelect: DataTypes.BOOLEAN,//单选 or 多选
	anonymous: DataTypes.BOOLEAN,//匿名投票
	restricted: DataTypes.BOOLEAN,//限制传播
}, {
	sequelize, // We need to pass the connection instance
	modelName: 'Vote' // We need to choose the model name
})
User.hasMany(Vote)
Vote.belongsTo(User)

class Option extends Model { }
exports.Option = Option
Option.init({
	content: DataTypes.STRING,
	count: DataTypes.INTEGER,
}, {
	sequelize, // We need to pass the connection instance
	modelName: 'Option', // We need to choose the model name
	timestamps: false, // 关闭时间戳
})

Vote.hasMany(Option)
Option.belongsTo(Vote)

User.belongsToMany(Option, {
	through: 'UserVoting',
	timestamps: false,
})
Option.belongsToMany(User, {
	through: 'UserVoting',
	timestamps: false,
})
sequelize.sync()
