import { useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import UserContext from './UserContext'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'

export default function Home() {
	console.log('home render')
	var history = useHistory()
	var user = useSelector(state => state.user)
	var tried = useSelector(state => state.triedLogin)

	var dispatch = useDispatch()

	useEffect(() => {
		(async () => {
			if (user) {
				return
			}
			if (tried) {
				history.push('/login')
			}
			if (!user) {
				dispatch({ type: 'get-user-info' })
			}
		})()
	}, [user, tried])

	return (
		<div>
			<div><Link to="/create">创建单选</Link></div>
			<div><Link to="/create?multiSelect">创建多选</Link></div>
		</div>
	)
}
