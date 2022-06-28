const { sequelize, User } = require('./db')

const express = require('express')

const accountRouter = express.Router()
module.exports = accountRouter

// {name, password, email, gender, avatar}
accountRouter.post('/register', async (req, res, next) => {
	var body = req.body
	try {
		var user = await User.create({
			...body
		})
		res.end()
	} catch (e) {
		res.status(400).json(e)
	}
})

// {name, password}
accountRouter.post('/login', async (req, res, next) => {
	try {
		console.log('body', req.body)

		var user = await User.findOne({
			attributes: ['name', 'gender', 'avatar', 'id'],
			where: {
				name: req.body.name,
				password: req.body.password
			}
		})
		res.cookie('user', req.body.name, {
			signed: true
		})
		res.json(user.toJSON())
	} catch (e) {
		res.status(400).end(e.toString())
	}
})

// 获取已登陆用户的信息
accountRouter.get('/userinfo', async (req, res, next) => {
	if (req.user) {//当前cookie对应的已登陆用户
		var user = await User.findOne({
			attributes: ['name', 'gender', 'avatar', 'id'],
			where: {
				name: req.user.name,
			}
		})
		res.json(user.toJSON())
	} else {
		res.status(401).json({
			code: -1,
			msg: '用户未登陆'
		})
	}
})

accountRouter.get('/logout', async (req, res, next) => {
	res.clearCookie('user')
	res.end()
})
