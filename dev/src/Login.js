import axios from 'axios'
import React, { useEffect, useRef, useState,useContext } from 'react'
import UserContext from './UserContext'

export default function Login({ history }) {
	var usernameRef = useRef()
	var passwordRef = useRef()
	var userCtx = useContext(UserContext)

	async function login() {
		try {
			var userInfo = (await axios.post('/account/login',{
				name:usernameRef.current.value,
				password:passwordRef.current.value
			})).data
			userCtx.setUserInfo(userInfo)
			history.push('/home')
		} catch (e) {
			alert(e.toString())
		}
	}
	return (
		<div>
				Username:<input />
				Password:<input />
				<button onClick={login}>登录</button>
		</div>
	)
}
