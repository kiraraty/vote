import axios from 'axios'
import React from 'react'
import { useEffect,useState,Suspense } from 'react'
import {useRouteMatch} from 'react-router-dom'
import {voteFetcher} from './data-fetcher'
import io from 'socket.io-client'
export default function ViewVote({match}) {
 var match=useRouteMatch()
	var voteInfo = voteFetcher.read(match.params.id)
var [votingInfo,setVotingInfo]=useState([]) 
 async function voteOption(id){
	axios.post('/vote/voteup'+id)
	alert('ok')
 }
 useEffect(()=>{
	if(voteInfo.deadline<new Date().toISOString()){
		var socket=io()
		socket.emit('select root',voteInfo.id)
		socket.on('voting info',info=>{  //收到了最新的投票信息
			setVotingInfo(info)
			  
		})
	}
 },[voteInfo.id])
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
