const { sequelize, User, Vote, Option } = require('./db')
const express = require('express')
const voteRouter = express.Router()
module.exports = voteRouter


io.on('connection',socket=>{  //socket.io连接对象
	socket.on('select root',id=>{
		socket.join('vote'+id)
	})
})
// POST /vote/create
/**
 * {title ,description,deadline,...  options:['','']}
 */
voteRouter.post('/create', async (req, res, next) => {
	var {options,...body} = req.body
	if(req.user){
	try {
		var vote = await Vote.create(body)
		//大数据量
		vote.setUser(req.user) //当前登录用户
		var ary=await Promise.all(options.map(str=>{
				return Option.create({
					content:str
				}) 
		}))
		vote.addOptions(ary)
		res.json(vote.JSON())
	} catch (e) {
		res.status(400).json(e)
	}
	}else{
		req.status(401).json({
			code:-1,
			msg:'user not login'
		})	
	}
})
// GET /vote/5
voteRouter.get('/:id', async (req, res, next) => {
	try {
		var vote = await Vote.findByPk(req.params.id,{include:Option})
	
		res.json(vote.toJSON())
	} catch (e) {
		res.status(400).json(e)
	}
})
// PUT /vote/5
voteRouter.post('/voteup/:optionId', async (req, res, next) => {
	var option = await Option.findByPk(req.params.optionId)
	option.addUser(req.user)
	res.end()
	//给房间的连接广播状态
	io.to('vote'+option.VoteId).emit( 
		'voting info',
		//每个选项和及为其投票的观众
		await Option.findAll({where:{VoteId:option.VoteId},include:[User]})
	)
})
// DELETE /vote/5
voteRouter.delete('/logout', async (req, res, next) => {
	
})
//myVote
voteRouter.get('/logout', async (req, res, next) => {
	
})