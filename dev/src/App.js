import React, { Suspense, useEffect, useState } from 'react'
import { NavLink as Link, Switch, Route, Redirect, useHistory } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import CreateVote from './CreateVote'
import ViewVote from './ViewVote'
import My from './My'
import UserContext from './UserContext'
import axios from 'axios'
export default function App() {
	const [userInfo, setUserInfo] = useState()
	const history = useHistory()
	async function logout() {
		await axios.get('/account/logout')
		history.push('/login')
	}
	useEffect(() => {
		(async () => {
			if (!userInfo) {
				try {
					var info = (await axios.get('/account/userinfo')).data
					setUserInfo(info)
				} catch (e) {
					history.push("/login")
				}
			}
		})()
	}, [userCtx.userInfo])
	return (
		<UserContext.Provider value={{ userInfo: userInfo, setUserInfo: setUserInfo }} >
			<div className='App'>
				{
					userInfo
						? <>
							<span>欢迎,{userInfo.name}用户</span>
							<Link to='/home'>创建</Link>
							<Link to='/my'>我的</Link>
							<button onClick={logout}>退出登录</button>
						</>
						: <>
							<Link to='/login'>登录</Link>
							<Link to='/register'>注册</Link>
						</>
				}

				<Switch>
					<Route exact path='/'>
						<Redirect to='/home'></Redirect>
					</Route>
					<Route path='/login' component={Login} />
					<Route path='/register' component={Register} />
					<Route path='/home' component={Home} />
					<Route path='/create' component={CreateVote} />
					<Route path='/my' component={My} />
					<Route path='/vote/:id' component={ViewVote} >
						<Suspense fallback={'...loading'}></Suspense>
						<ViewVote />
					</Route>
				</Switch>
			</div>
		</UserContext.Provider>
	)
}
