
import mongoose from "mongoose";


let isConnected : boolean = false

const ConnectDB = async() =>{
    if(isConnected) return;
    const url : string = typeof(process.env.MONGO_URL)!=="string" ? "" : process.env.MONGO_URL
    try{
        if(url==="") console.log("Invalid url")
        await mongoose.connect(url)
        .then(()=>{isConnected=true})
        
    }
    catch(err){
        console.log(err)
    }
}

export default ConnectDB