import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import store from './store'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import 'antd/dist/antd.css';
ReactDOM.render(
	<React.StrictMode>
		<Router>
			<Provider store={store}>
				<App />
			</Provider>
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
)
