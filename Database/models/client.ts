import mongoose, { models } from "mongoose";


const clientSchema = new mongoose.Schema({
    name : {
        type : String,
        unique : true,
    }
})

const Client = models.Client || mongoose.model("Client",clientSchema);

export default Client