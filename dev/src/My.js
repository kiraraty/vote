import axios from "axios"
import { useEffect, useState } from "react"
import { useUserInfo } from "./UserContext"
import { Link } from 'react-router-dom'
import { useForceLogin } from "./hooks"
import { List, InfiniteLoader, AutoSizer } from 'react-virtualized';

import 'react-virtualized/styles.css'; // only needs to be imported once


export default function My() {
	// var userInfo = useUserInfo()
	var [voteData, setVoteData] = useState({ row: [], count: 10 })
	var [votes, setVotes] = useState([])
	var user = useForceLogin()

	// useEffect(() => {
	//   axios.get('/vote/myvotes?startIndex=0&stopIndex=30').then(res => {
	//     setVotes(res.data.rows)
	//     setVoteData(res.data)
	//   })
	// }, [user])

	if (!votes) {
		return <div>loading...</div>
	}

	function loadMore({ startIndex, stopIndex }) {
		return axios.get(`/vote/myvotes?startIndex=${startIndex}&stopIndex=${stopIndex}`).then(res => {
			setVoteData(res.data)//里面有总条目数
			votes.splice(startIndex, 0, ...res.data.rows)
			setVotes([...votes])
		}).catch(e => {
			console.log(e)
		})
	}

	function rowRenderer({ key, index, style }) {
		// debugger
		if (index >= votes.length) {
			return <div style={style} key={key}>loading...</div>
		}
		return (
			<div style={style} key={key}>
				<Link to={"/vote/" + votes[index].id}>{votes[index].title}</Link>
			</div>
		)
	}

	function isRowLoaded({ index }) {
		return !!votes[index]
	}

	return (
		<div>
			<InfiniteLoader
				isRowLoaded={isRowLoaded}
				loadMoreRows={loadMore}
				rowCount={voteData.count}
			>
				{({ onRowsRendered, registerChild }) => (
					<List
						onRowsRendered={onRowsRendered}
						ref={registerChild}
						width={300}
						height={300}
						rowCount={voteData.count}
						rowHeight={20}
						rowRenderer={rowRenderer}
					/>
				)}
			</InfiniteLoader>
			{/* <ul>
        {votes.rows.map((vote, idx) => {
          return <li key={idx}>
            <Link to={"/vote/" + vote.id}>{vote.title}</Link>
          </li>
        })}
      </ul> */}
		</div>
	)
}
