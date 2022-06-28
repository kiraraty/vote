import { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import UserContext from './UserContext'
import { useDispatch } from 'react-redux'

function Login({ history }) {
	var usernameRef = useRef()
	var passwordRef = useRef()
	var userCtx = useContext(UserContext)
	var dispatch = useDispatch()

	async function login() {
		axios.post('/account/login', {
			name: usernameRef.current.value,
			password: passwordRef.current.value,
		}).then(res => {
			dispatch({
				type: 'user-info',
				user: res.data
			})
			history.go(-1)
		}).catch(e => {
			alert(e.toString())
		})
	}

	return (
		<div>
			Username: <input type="text" ref={usernameRef} />
			Password: <input type="text" ref={passwordRef} />
			<button onClick={login}>Login</button>
		</div>
	)
}

export default Login
