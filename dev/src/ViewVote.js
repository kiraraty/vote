import axios from 'axios'
import React from 'react'
import { useEffect, useState, Suspense } from 'react'
import { useUserInfo } from './UserContext'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { voteFetcher } from './data-fetcher'
import io from 'socket.io-client'
import { useRequest } from './hooks'
export default function ViewVote({ match }) {
	var match = useRouteMatch()
	var history = useHistory()

	var { vote, options } = voteFetcher.read(match.params.id)
	var [optionsInfo, setOptionsInfo] = useState(options)

	useEffect(() => {
		setOptionsInfo(options)
	}, [options])

	//当前登录用户
	var userInfo = useUserInfo()

	//向某个选项投票
	/**
	 * 
	 * @param {*选项id} id 
	 * @param {*当前用户是否选中} selected 
	 */
	async function voteOption(id, selected) {
		if (!userInfo) {
			history.push('/login')
		}
		if (!selected) {
			axios.post('/vote/voteup' + id)
			alert('ok')
		} else {
			axios.post('/vote/cancel' + id)
			alert('cancel ok')
		}

	}

	useEffect(() => {
		//没过期
		if (vote.deadline < new Date().toISOString()) {
			var socket = io({
				transports: ['websocket']
			})
			socket.emit('select root', data.vote.id)
			socket.on('voting info', info => {  //收到了最新的投票信息
				setOptionsInfo(info)
				console.log(info);
			})
			return () => socket.disconnect()
		}
	}, [vote.id])
	if (loading) {
		return <div>loading...</div>
	}
	return (
		<div>
			<h1>{vote.title}</h1>
			<h2>{vote.desc}</h2>
			{
				optionsInfo.Options.map((option, idx) => {
					var selected = option.Users.some(user => userInfo && user.id == userInfo.id)
					return (
						<div key={idx}>
							<div onClick={() => voteOption(option.id, selected)}>
								{option.content}
								{selected ? '✔️' : '✖️'}
								({option.Users.length})票
							</div>
							{
								!vote.anonymous &&
								<div>{
									option.Users.map((user, idx) => {
										return <span className='avatar' style={{ display: 'inline-block', width: 20, height: 20, borderRadius: '9999px', border: '1px solid' }} key={idx}>{user.name.slice(0, 1).toUpperCase()}</span>
									})
								}</div>
							}
						</div>
					)
				})
			}
		</div>
	)
}
