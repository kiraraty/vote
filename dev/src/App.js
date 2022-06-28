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

import { useSelector,useDispatch } from 'react-redux'
export default function App() {

	const history = useHistory()
	const userInfo=useSelector(state=>state.user)
	const dispatch = useDispatch()

	async function logout() {
		dispatch({type: 'logout'})
	}
	//获取用户信息
	useEffect(() => {
		dispatch({type:'get-user-info'})
	}, [])
	return (
		<UserContext.Provider value={{ userInfo: userInfo }} >
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
