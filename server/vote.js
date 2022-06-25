const { sequelize, User, Vote, Option } = require('./db')
const express = require('express')
const voteRouter = express.Router()
module.exports = voteRouter
const io = require('./servers')
const { options } = require('./account')

io.on('connection', socket => {  //socket.io连接对象
	socket.on('select root', id => {
		socket.join('vote' + id)
		console.log("room", id);
	})
})
// POST /vote/create
/**
 * {title ,description,deadline,...  options:['','']}
 */

// GET /vote/5
voteRouter.get('/:id', async (req, res, next) => {
	try {
		var vote = await Vote.findByPk(req.params.id, { include: Option })
		res.json({
			vote: vote.toJSON(),
			options: await Option.findAll(
				{
					where: { VoteId: req.params.id },
					include: [{ model: User, attributes: ['name', 'gender', 'avatar', 'id'] }]
				}
			)
		})
	} catch (e) {
		res.status(400).json(e)
	}
})
//判断登录状态，未登录不允许执行后续操作
voteRouter.use(async (req, res, next) => {
	if (req.user) {
		next()
	} else {
		res.status(401).json({
			code: -1,
			msg: '未登陆'
		})
	}
})
voteRouter.post('/create', async (req, res, next) => {
	var { options, ...body } = req.body
	if (req.user) {
		try {
			var vote = await Vote.create(body)
			//大数据量
			vote.setUser(req.user) //当前登录用户
			var ary = await Promise.all(options.map(str => {
				return Option.create({
					content: str
				})
			}))
			vote.addOptions(ary)
			res.json(vote.JSON())
		} catch (e) {
			res.status(400).json(e)
		}
	} else {
		req.status(401).json({
			code: -1,
			msg: 'user not login'
		})
	}
})
// 向某个选项投票  post /vote/voteup/5
voteRouter.post('/voteup/:optionId', async (req, res, next) => {
	if (req.user) {

	}
	var option = await Option.findByPk(req.params.optionId, { include: Vote })
	if (option) {
		if (option.Vote.deadline.getTime() > Date.now()) {
			if (option.Vote.multiSelect) {//多选
				await option.addUser(req.user)
			} else {//单选  需要删除当前用户对其他选项得投票
				//之前投过的所有选项
				var thisVoteOPtions = await Option.findAll({
					where: {
						VoteId: option.Vote.id
					}
				})
				await req.user.removeOptions(thisVoteOPtions)
				await req.user.addOption(option)
			}
			//给房间的连接广播状态
			io.to('vote' + option.VoteId).emit(
				'voting info',
				//每个选项和及为其投票的观众
				await Option.findAll(
					{
						where: { VoteId: option.VoteId },
						include: [{ model: User, attributes: ['name', 'gender', 'avatar', 'id'] }]
					}
				)
			)
		}
		res.end()
	} else {
		res.status(404).end({
			code:-1,
			msg:'选项不存在'
		})
	}
	
})
//取消某个选项 /vote/cancel/5
voteRouter.post('/cancel/:optionId', async (req, res, next) => {
	var option = await Option.findByPk(req.params.optionId)
	if (option ) {
	if(option.Vote.deadline.getTime() > Date.now()){
		await option.removeUser(req.user)
		//给房间的连接广播状态
		io.to('vote' + option.VoteId).emit(
			'voting info',
			//每个选项和及为其投票的观众
			await Option.findAll(
				{
					where: { VoteId: option.VoteId },
					include: [{ model: User, attributes: ['name', 'gender', 'avatar', 'id'] }]
				}
			)
		)
	}
	res.end()
		
	}else{
		res.status(404).end({
			code: -1,
			msg: '选项不存在'
		})
	}
	
})
// DELETE /vote/5
voteRouter.delete('/logout', async (req, res, next) => {

})
//myVote
voteRouter.get('/myVotes', async (req, res, next) => {
	var votes = await Vote.findAll({
		where: {
			UserId: require.user.id
		}
	})
	res.json(votes)
})