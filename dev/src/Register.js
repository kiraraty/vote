import axios from 'axios'
import React, { useRef } from 'react'
import {useInput} from './hooks'
export default function Register() {
	var name = useInput('')
	var password = useInput('')
	var gender = useInput('')
	var email = useInput('')
	async  function register() {
	  await	axios.post('/account/register', {
			name:name.value,
			password:password.value,
			gender:gender.value,
			email:email.value
		})
		alert('ok')
	}
	return (
		<div>
			<form>
				Username:<input {...name} />
				Password:<input {...password} />
				Gender:<input {...gender} />
				Email:<input {...email} />
				<button onClick={register}>注册</button>
			</form>
		</div>
	)
}
