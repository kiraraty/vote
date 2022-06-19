
import React,{ useEffect, useState,} from 'react'
import { produce } from 'immer'
import { useInput,useQuery } from './hooks'
import { useHistory, useRouteMatch } from 'react-router-dom'
import axios from 'axios'
export default function CreateVote() {
	var [optionStrs,setOptions]=useState(['',''])
	var title=useInput('')
	var desc=useInput('')
	var deadline=useInput(new Date(Date.now()+86400000).toISOString().slice(0,16))
	var anonymous=useInput(false)
	var restricted = useInput(false)
	var match= useRouteMatch()
	var query= useQuery()
	var history=useHistory()
	function addOption(){
		setOptions([...optionStrs,''])
	}
	function deleteOption(idx){
		setOptions(optionStrs.filter((it,index)=>index!==idx))
	}
	function setOptionStr(e,idx){
	setOptions(produce(draft=>{
			optionStrs[idx]=e.target.value
		}))
	}
async	function createVote(){
	try{
		var vote = (await axios.post('/vote/create', {
			title: title.value,
			desc: desc.value,
			deadline: deadline.value,
			multiSelect: query.has('multiSelect'),
			anonymous: anonymous.checked,
			restricted: restricted.checked,
			options: optionStrs
		})).data
		history.pushState('/vote/' + vote.id)
	}catch (e) {
		alert(e)
	}
	

	}
	return (
		<div>
			<form>
				<div>Title:<input type="text" {...title}/></div>
				<div>Desc:<input type="text"{...desc} /></div>
				Options:
				{
					optionStrs.map((optionStr,idx)=>{
						return <div key={idx}>
							 <button onClick={()=>deleteOption(idx)}>-</button>
							<input type="text" value={optionStr} onChange={e => setOptionStr(e,idx)}/> 
							 </div>
					})}
				<div><button onClick={addOption}>Add Options</button></div>
				<div>Deadline:<input type="datetime-local" {...deadline}/></div>
				<div>Anonymous:<input type="checkbox" {...anonymous}/></div>
				<div>Restricted:<input type="checkbox" {...restricted}/></div>
				<button onClick={createVote}> Create</button>
			</form>
		</div>
	)
}
