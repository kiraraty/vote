import React, { Suspense, useEffect, useState } from 'react'
import { NavLink as Link, Switch, Route, Redirect, useHistory } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import CreateVote from './CreateVote'
import ViewVote from './ViewVote'
import UserContext from './UserContext'
import axios from 'axios'
export default function App() {
	const [userInfo, setUserInfo] = useState()
	const history =useHistory()
	async function logout() {
		await axios.get('/account/logout')
		history.push('/login')
	}
	return (
		<UserContext.Provider value={{ userInfo: userInfo, setUserInfo: setUserInfo }} >
			<div className='App'>
				<Link to='/login'>登录</Link>
				<Link to='/register'>注册</Link>
				<button onClick={logout}></button>
				<Switch>
					<Route exact path='/'>
						<Redirect to='/home'></Redirect>
					</Route>
					<Route path='/login' component={Login} />
					<Route path='/register' component={Register} />
					<Route path='/home' component={Home} />
					<Route path='/create' component={CreateVote}/>
					<Route path='/vote/:id' component={ViewVote} >
						<Suspense fallback={'...loading'}></Suspense>
						<ViewVote />
						</Route>
				</Switch>
			</div>
		</UserContext.Provider>
	)
}
