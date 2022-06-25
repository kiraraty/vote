import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserInfo } from './UserContext'

export default function My() {
	var userInfo=useUserInfo()
	var [votes,setVotes]=useState(null)

	useEffect(() => {
		axios.get('/vote/myvotes').then(res=>{
				setVotes(res.data)
		})
	},[userInfo])
	if(!votes){
		return <div> loading...</div>
	}
	return (
		<div>
			<ul>
				{
					votes.map((vote,idx)=>{
						return <li key={idx}>
						<Link to={"/vote/"+vote.id}>{vote.title}  </Link>	
							</li>
					})
				}
			</ul>
		</div>
	)
}
