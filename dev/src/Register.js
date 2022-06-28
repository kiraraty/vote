import axios from "axios"
import { useState } from "react"
import { useInput } from './hooks'


function Register() {
	var name = useInput('')
	var password = useInput('')
	var gender = useInput('')
	var email = useInput('')
	var [previewUrl, setPreviewUrl] = useState(null)

	async function register() {
		await axios.post('/account/register', {
			name: name.value,
			password: password.value,
			gender: gender.value,
			email: email.value,
			avatar: previewUrl,
		})
		alert('ok')
	}

	async function upload(e) {
		var fd = new FormData()
		fd.set('file', e.target.files[0])
		var res = await axios.post('/upload', fd)
		setPreviewUrl(res.data.url)
	}

	return (
		<div>
			<div>Username: <input type="text" {...name} /></div>
			<div>Password: <input type="password" {...password} /></div>
			<div>Gender: <input type="text" {...gender} /></div>
			<div>Email: <input type="text" {...email} /></div>
			<div>Avatar: <input type="file" onChange={upload} /></div>
			<img src={previewUrl} />
			<button onClick={register}>Register</button>
		</div>
	)
}

export default Register
