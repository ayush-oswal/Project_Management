"use client"

import { FormEvent, useState } from "react";
import { Spinner } from "@chakra-ui/react"
import useEmpStore from "@/store";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';



export default function Home() {
  const [name,setName] = useState("")
  const [password,setPassword] = useState("")
  const [isLoading,setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    const response = await fetch("/api/auth/login",{
      method:"POST",
      body: JSON.stringify({name,password}),
      headers: {'Content-type' : 'application/json'}
    })
    if(response.ok===false){
      setLoading(false)
      await response.json().then(res=>{toast(`❌ ${res.msg}`)})
    }
    else{
      localStorage.setItem("name",name)
      if(name==="Admin"){
        localStorage.setItem("isAdmin","true")
        localStorage.setItem("id","")
      } 
      else{
        localStorage.setItem("isAdmin","false")
        const res = await response.json()
        const empId = res.id || ""
        localStorage.setItem("id",empId)
      }
      toast("✅ Login Successful")
      router.push("/dashboard")
    }
  };

  return (
    <main className="p-5 mt-44 bg-white opacity-85 rounded-md w-full sm:w-3/5 max-w-md">
      <Toaster />
      <div className="flex flex-col gap-3">
        <div className="text-xl text-center">
          LOGIN
        </div>
        <hr />
        <div className="flex flex-col gap-3 text-center">
            <form onSubmit={handleSubmit}>
              <input value={name} onChange={(e)=>{setName(e.target.value)}} className="block p-3 border-none outline-none w-full" type="text" placeholder="Name" />
              <input value={password} onChange={(e)=>{setPassword(e.target.value)}} className="block p-3 border-none outline-none w-full" type="password" placeholder="Password" />
              
                {
                  isLoading ? <Spinner 
                  thickness='3px'
                  speed='0.65s'
                  emptyColor='white'
                  color='teal.500'
                  size='lg' /> : <button type="submit" className="mt-4 p-2 pr-4 pl-4 rounded-sm text-white bg-teal-500 hover:bg-teal-400">Login</button>
                }
              
            </form>
        </div>
      </div>
    </main>
  );
}
