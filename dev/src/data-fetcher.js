import axios from "axios"
const voteCache=Object.create(null)
function getVote(id) {
		return axios.get('/vote/'+id)
}
export const voteFetcher={
	read(id){
		if(id in voteCache){
				return voteCache[id]
		}else{
			throw getVote(id).then(v=>{
				voteCache[id]=v
			})
		}
	}
}