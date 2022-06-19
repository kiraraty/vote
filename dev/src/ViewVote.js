import axios from 'axios'
import React from 'react'
import { useEffect,useState,Suspense } from 'react'
import {useRouteMatch} from 'react-router-dom'
import {voteFetcher} from './data-fetcher'
export default function ViewVote({match}) {
 var match=useRouteMatch()
	var voteInfo = voteFetcher.read(match.params.id)

 async function voteOption(id){
	axios.post('/vote/voteup'+id)
	alert('ok')
 }
	return (
		<div>
			<h1>{voteInfo.title}</h1>
			<h2>{voteInfo.desc}</h2>
			{
				voteInfo.Options.map(option=>{
					return (
							<div>
							<div onClick={() => voteOption(option.id)}>{option.content}</div>
								{
									!voteInfo.anonymous&&
									<div>投票人头像</div>
								}
							</div>
					)
				})
}	
		</div>
	)
}
