import axios from 'axios'
import { useState, useCallback, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

export function useInput(init) {
	var [value, setValue] = useState(init)
	var [checked, setChecked] = useState(init)

	var onChange = useCallback(function (e) {
		setValue(e.target.value)
		setChecked(e.target.checked)
	}, [])

	return { value, checked, onChange }
}

export function useQuery() {
	return new URLSearchParams(useLocation().search);
}

export function useRequest(url) {
	var [data, setData] = useState(null)
	var [loading, setLoading] = useState(true)

	useEffect(() => {
		axios.get(url).then((res) => {
			setData(res.data)
			setLoading(false)
		})
	}, [url])

	return [data, loading]
}


export function useForceLogin() {
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

	return user
}
