import React, { useContext, useEffect } from 'react'
import { Link,useHistory } from 'react-router-dom'
import UserContext from './UserContext'
import axios from 'axios'

export default function Home({ history}) {
	var userCtx = useContext(UserContext)
	//var history = useHistory()
	
	return (
		<div>
			<Link to='/create' >单选</Link>
			<Link to='/create?multiSelect' >多选</Link>
		</div>
	)
}
