import Employee from "@/Database/models/employee";
import bcrypt from "bcrypt"
import ConnectDB from '@/Database';


async function handler(req : Request) {
    try {
        const {name,password} = await req.json();
        await ConnectDB();
        if(name==="Admin"){
            if(password===process.env.ADMIN_PASSWORD){
                return new Response(JSON.stringify({msg:"ok",name}), { status: 200 })
            }
            else{
                return new Response(JSON.stringify({msg:"Invalid credentials"}), { status: 401 })
            }
        }
        else{
            const emp = await Employee.findOne({name});
            if(!emp) return new Response(JSON.stringify({msg:"User Not Found"}), { status: 400 })
            const isMatch = await bcrypt.compare(password,emp.password)
            if(!isMatch) return new Response(JSON.stringify({msg:"Invalid Password"}), { status: 400 })
            return new Response(JSON.stringify({msg:"ok",name,id:emp._id}), { status: 201 })
        }
    }
    catch(err){
        return new Response(JSON.stringify({msg:"Invalid credentials"}), { status: 401 })

    }
}

export { handler as POST }