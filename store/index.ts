import { create } from "zustand"

interface State {
    name : String,
    id : String,
    isAdmin : Boolean
}

const useEmpStore = create<State>()((set)=>({
    name:"",
    id:"",
    isAdmin:false
}));

export default useEmpStore