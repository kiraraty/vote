import axios from "axios"
const voteCache=Object.create(null)
function getVote(id) {
		return axios.get('/vote/'+id)
}
export const voteFetcher={
	read(id){
		if(id in voteCache){
				var ret= voteCache[id]
				delete voteCache[id]
				return ret
		}else{
			throw getVote(id).then(v=>{
				voteCache[id]=v
			})
		}
	}
}