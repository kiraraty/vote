import axios from "axios"
import { useEffect, Suspense, useState, useMemo } from "react"
import { useHistory, useRouteMatch } from "react-router"
import { useUserInfo } from './UserContext'
import { voteFetcher } from './data-fetcher'
import uniqBy from 'lodash/uniqBy'
import io from 'socket.io-client'

export default function ViewVote() {
	var match = useRouteMatch()
	var history = useHistory()


	var { vote, options } = voteFetcher.read(match.params.id)
	var [optionsInfo, setOptionsInfo] = useState(options)

	useEffect(() => {
		setOptionsInfo(options)
	}, [options])


	var userInfo = useUserInfo()//当前登陆用户

	// 向某个选项投票
	/**
	 * id 选项id
	 * selected 当前用户是否选中该选项
	 */
	async function voteOption(id, selected) {
		if (!userInfo) {
			history.push('/login')
			return
		}
		if (!selected) {
			await axios.post('/vote/voteup/' + id)
			console.log('vote ok')
		} else {
			await axios.post('/vote/cancel/' + id)
			console.log('cancel ok')
		}
	}

	useEffect(() => {
		// 如果没过期
		if (vote.deadline > new Date().toISOString()) {
			var socket = io({
				// transports: ['websocket', 'polling']
			})
			socket.emit('select root', vote.id)
			//收到了本问题下投票的新信息
			socket.on('voting info', info => {
				console.log(info)
				setOptionsInfo(info)
			})
			return () => socket.disconnect()
		}
	}, [vote.id])

	var allUsers = useMemo(() => {
		var users = optionsInfo.reduce((ary, option) => {
			ary.push(...option.Users)
			return ary
		}, [])
		var uniqUsers = uniqBy(users, 'id')
		return uniqUsers
	}, [optionsInfo])

	return (
		<div>
			<h1>{vote.title}</h1>
			<h2>{vote.desc}</h2>
			{optionsInfo.map((option, idx) => {
				var selected = option.Users.some(user => {
					return userInfo && user.id == userInfo.id
				})
				return (
					<div key={idx}>
						<div onClick={() => voteOption(option.id, selected)}>
							{option.content}
							----
							{selected ? '✅' : ''}
							----
							({option.Users.length}票)
							----
							({(option.Users.length / allUsers.length * 100).toFixed(2)}%)
						</div>
						{!vote.anonymous &&
							<div>
								{option.Users.map((user, idx) => {
									return <span key={idx} style={{ display: 'inline-block', width: 20, height: 20, borderRadius: '9999px', border: '1px solid' }}>{user.name.slice(0, 1).toUpperCase()}</span>
								})}
							</div>
						}
					</div>
				)
			})}
		</div>
	)
}
