const { sequelize, User, Vote, Option } = require('./db')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const express = require('express')
const {io } =require('./servers')
const accountRouter = require('./account')
const voteRouter = require('./vote')
const app = express()
const PORT =3009
app.use(cors({
	origin: true,
	maxAge:3600 * 24 * 60 * 60,
	credentials: true, //跨域携带cookie
}))
app.use(express.json())
app.use(cookieParser('secret'))
app.use('./account',accountRouter)
app.use('/vote',voteRouter)
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

const {server}=require('./servers') //http server对象

server.on('request',app)

io.attach(server,{serveClient:false})


app.listen(PORT,()=>{
	
})

