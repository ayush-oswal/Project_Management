//Edit project of id

"use client"

import ProjectForm from '@/Components/ProjectForm';
import { GET_PROJECT } from '@/queries';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface ProjectProps {
    id?: string;
    title?: string;
    description?: string;
    client?: string;
    employees?: string[];
    status?: string;
    createdAt?: string;
}

const page = ({ params }: { params: { id: string } }) => {
    const {id} = params
    const [project, setProject] = useState<ProjectProps>({});
    const router = useRouter()

    useEffect(() => {
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
        if(!project) router.push("/dashboard")
    }, [id]);

  return (
    <div className='h-full w-full'>
        {project.title && <ProjectForm id={id} title={project.title} description={project.description} status={project.status} client={project.client} selectedEmployees={project.employees} />}
    </div>
  )
}

export default page