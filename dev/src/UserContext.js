import { createContext, useContext } from "react";
const UserContext=createContext()
UserContext.displayName = "UserContext"
export default UserContext
export function useUserInfo(){
	var userCtx=useContext(UserContext)
	return userCtx.userInfo
}