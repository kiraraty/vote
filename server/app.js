const { sequelize, User, Vote, Option } = require('./db')
const cors = require('cors')
const cookieParser = require('cokie-parser')
const express = require('express')

const accountRouter = require('./account')
const app = express()
const PORT =3005
app.use(cors({
	origin: true,
	maxAge:3600 * 24 * 60 * 60,
	credentials: true, //跨域携带cookie
}))
app.use(express.json())
app.use(cookieParser('secret'))
app.use('./account',accountRouter)
app.use(async (req, res, next) =>{
	if(req.signedCookies.user){
		req.user= await User.findOne({
			where: {
				name:req.signedCookies.user,
			}
		})
	}else{
		req.user=null;
	}
	next()
})
app.listen(PORT,()=>{
	
})