import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { put, takeEvery, takeLatest, call } from 'redux-saga/effects'
import axios from 'axios'

const saga = createSagaMiddleware()

const initialState = {
	user: null,
	votes: {},
	triedLogin: false,//尝试登陆但没成功时为真
}

const store = createStore((state = initialState, action) => {
	switch (action.type) {
		case 'user-info':
			return {
				...state,
				user: action.user
			}
		case 'remove-user-info':
			return {
				...state,
				user: null
			}
		case 'try-login-failed':
			return {
				...state,
				triedLogin: true
			}
		default:
			return state
	}
}, applyMiddleware(saga))

export default store

function* getUserInfo(action) {
	try {
		var res = yield axios.get('/account/userinfo')
		yield put({ type: 'user-info', user: res.data })
	} catch (e) {
		yield put({ type: 'try-login-failed' })
	}
}

function* login(action) {
	try {
		var res = yield axios.post('/account/login', {
			name: action.name,
			password: action.password,
		})
		yield put({ type: 'user-info', user: res.data })
	} catch (e) {
		throw e
	}
}

function* logout(action) {
	var res = yield axios.get('/account/logout')
	yield put({ type: 'remove-user-info' })
}

function* rootSaga() {
	yield takeEvery('get-user-info', getUserInfo)
	yield takeEvery('login', login)
	yield takeEvery('logout', logout)
}

saga.run(rootSaga)
