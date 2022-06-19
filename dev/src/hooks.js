import { useCallback, useState } from "react";
import {useLocation} from "react-router-dom"
 export  function useInput(init){
	var [value,setValue] =useState(init)
	var [checked,setChecked] =useState(init)

	var onChange=useCallback(function(e){
		setValue(e.target.value);
		setChecked(e.target.checked);
	},[])
	 return [value, checked, onChange]
}

export function useQuery(){
	return new URLSearchParams(useLocation().search)
}