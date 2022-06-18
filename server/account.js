const { sequelize, User, Vote, Option } = require('./db')
const express = require('express')

const accountRouter=express.Router()
module.exports =accountRouter
//{username,password,email,gender,avatar}
accountRouter.post('/register',async(req,res,next)=>{
	var body=req.body
	try{
	var user=	await User.create({
			...body
	})
	res.end()
}catch(e){
	res.status(400).json(e)
	}
})
//{name,password}
accountRouter.post('/login',async(req,res,next)=>{
	try{
		var user = await User.findOne({
			attributes:['name','gender','avatar'],
			where: {
				name: req.body.name,
				password: req.body.password
			}
		})
		res.cookie('user',req.body.name,{
			signed: true,
		})
		res.json(user.toJSON())
	} catch(e){
		res.status(400).json(e)
	}
 
})
accountRouter.get('/userinfo',async(req,res,next)=>{
	if(req.user){
		res.json(req.user.toJSON())
	}else{
		res.status(401).json({
			code:-1,
			msg:'用户未登录'
		})
	}
})

accountRouter.get('/logout',async(req,res,next)=>{
	res.clearCookie('name')
})
