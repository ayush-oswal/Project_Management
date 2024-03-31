//display project details (id)
"use client"

import { ADD_COMMENT, DELETE_PROJECT } from '@/mutations';
import { GET_PROJECT } from '@/queries';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';


interface ProjectUpdate {
    name: string;
    content: string;
    createdAt: string;
}

interface ProjectProps {
    id?: string;
    title?: string;
    description?: string;
    updates?: ProjectUpdate[];
    client?: string;
    employees?: string[];
    status?: string;
    createdAt?: string;
}

const Page = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [project, setProject] = useState<ProjectProps>({});
    const [update,setUpdate] = useState<string>("")
    const [name,setName] = useState<string | null>("")
    const [ct,setCt] = useState<number>(0)
    const router = useRouter()

    useEffect(() => {
        const storedName = localStorage.getItem("name");
        setName(storedName)
        const getProject = async () => {
            const response = await fetch("/api/graphql", {
                method: "POST",
                body: JSON.stringify({
                    source: GET_PROJECT,
                    variableValues: { id }
                })
            });
            response.json().then((res): void => { setProject(res.data.project) });
        };
        getProject();
    }, [id,ct]);



    const handleSubmit = async() =>{
        if(update===""){
            toast.error("update cannot be empty!")
            return;
        }
        try{
            await fetch("/api/graphql",{
                method: "POST",
                body : JSON.stringify({
                    source : ADD_COMMENT,
                    variableValues : {
                        id,
                        name,
                        content : update
                    }
                })
            })
            setCt(ct+1)
            setUpdate("")
        }
        catch(err){
            console.log(err)
        }
    }

    const renderUpdates = () => {
        // Reverse the updates array
        const reversedUpdates = [...(project.updates || [])].reverse();
        
        return reversedUpdates.map((update, index) => (
            <div key={index} className="my-4 text-center w-full md:w-3/5 mx-auto">
                <div className="flex justify-between">
                    <div className='font-bold'>
                        <p>{update.name}</p>
                    </div>
                    <div>
                        <p>{renderCreatedAtDate(update.createdAt)}</p>
                    </div>
                </div>
                <div className='text-start'>
                    <p>{update.content}</p>
                </div>
                <hr className="my-4 border-gray-300" />
            </div>
        ));
    };
    
    

    const renderCreatedAtDate = (createdAt : string | number | null | undefined) => {
        if (!createdAt) return null;
    
        // Convert timestamp to milliseconds since the Unix epoch
        const createdAtDate = new Date(parseInt(createdAt.toString()));
    
        return createdAtDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit"
        });
    };

    const handleEditClick = () => {
        router.push(`/project/${id}/edit`)
    }

    const handleDelete = async () => {
        // Show confirmation dialog to confirm deletion
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                await fetch("/api/graphql", {
                    method: "POST",
                    body: JSON.stringify({
                        source: DELETE_PROJECT,
                        variableValues: {
                            id
                        }
                    })
                });
                toast.success("Project Deleted");
                router.push("/dashboard");
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleBackToDashboard = () => {
        router.push("/dashboard");
    };

    
    

    return (
        <div className='w-full h-full'>
        
            <Toaster />
            
                <div className="px-4 py-8 bg-white rounded-lg shadow-lg text-center">
                    <div>
                        <div className="flex justify-center mb-8">
                            <button onClick={handleBackToDashboard} className="px-4 py-2 bg-red-500 text-white rounded-md"> &lt;- Back</button>
                        </div>
                        <div className="mb-6">
                            <h1 className="text-4xl underline font-medium text-gray-800">{project.title}</h1>
                            <p className="text-sm mt-2 text-gray-600">Created at: {renderCreatedAtDate(project.createdAt)} | Status: <span className="font-bold">{project.status}</span></p>
                        </div>
                        {
                            name === "Admin" && (
                                <div className='text-center justify-center mb-5 flex gap-4'>
                                    <button onClick={handleEditClick} className='px-4 py-2 bg-blue-500 text-white rounded-md'>Edit</button>
                                    <button onClick={handleDelete} className='px-4 py-2 bg-red-500 text-white rounded-md'>Delete</button>
                                </div>
                            )
                        }
                        <div className="project-details mb-8">
                            <div className="flex justify-center items-center mb-2">
                                <span className="text-sm text-gray-600 mr-2">Client:</span>
                                <span className="font-bold text-gray-700">{project.client}</span>
                            </div>
                            <div className="flex justify-center text-center items-center mb-2">
                                <span className="text-sm text-gray-600 mr-2">Employees:</span>
                                <div className="flex flex-wrap gap-2">
                                    {project.employees?.map((employee) => (
                                        <span key={employee} className="px-3 py-2 rounded-md bg-gray-200 text-sm text-gray-700">{employee}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="project-description mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Project Description</h2>
                            <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: project.description || "" }} />
                        </div>
                        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Updates [{project.updates?.length}] :</h2>
                        <div className='max-h-40 overflow-y-scroll no-scrollbar'>{renderUpdates()}</div>
                        <div className="flex justify-center flex-col items-center gap-5">
                            <input className='w-full md:w-3/5 p-3 block rounded-md bg-slate-200' type='text' placeholder='Add update' value={update} onChange={(e) => { setUpdate(e.target.value) }} />
                            <button className='px-3 py-2 bg-blue-500 rounded-md text-white' onClick={handleSubmit}>Add Update</button>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default Page;

