"use client"

import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";


import { GET_ALL_PROJECTS, GET_EMPLOYEE } from '@/queries';
import Link from 'next/link';
import { ADD_CLIENT, ADD_EMPLOYEE } from '@/mutations';
import ProjectCard from '@/Components/ProjectCard';


interface Project {
  id: string;
  title: string;
  status : string;
}


const Page = () => {
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [id, setId] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isClientModalOpen, setClientModalOpen] = useState(false);
  const [isEmployeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const router = useRouter()


  useEffect(() => {

    const storedName = localStorage.getItem("name");
    const storedIsAdmin = localStorage.getItem("isAdmin") === "true";
    const storedId = localStorage.getItem("id");
    setName(storedName || "");
    setIsAdmin(storedIsAdmin);
    setId(storedId || "");
    if(!storedName) router.push("/") 

    async function getProjects() {
      if(storedIsAdmin){
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: GET_ALL_PROJECTS,
            variableValues: {}
          }),
        });
        await response.json().then(res=>{setProjects(res.data.projects)})
      }
      else{
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: GET_EMPLOYEE,
            variableValues: {
              id:storedId
            }
          }),
        });
        await response.json().then(res=>{setProjects(res.data.employee.projects)})
      }
    }
    getProjects()

  }, []);


  const handleClientSubmit = async() => {
    try {
      if (!clientName.trim()) {
        toast("❌ Client name cannot be empty");
        return;
      }
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: ADD_CLIENT,
          variableValues: {
            name : clientName
          }
        }),
      })
      toast(`✅ Client ${clientName} added`)
      setClientModalOpen(false);
      setClientName("")
    }
    catch(err){
      console.log(err)
    }
  };


  const handleEmployeeSubmit = async() => {
    try{
      if (!employeeName.trim()) {
        toast("❌ Employee name cannot be empty");
        return;
      }
      if (employeePassword.length < 4) {
        toast("❌ Password must be at least 4 characters long");
        return;
      }
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: ADD_EMPLOYEE,
          variableValues: {
            name : employeeName,
            password : employeePassword
          }
        }),
      });
      toast(`✅ Employee ${employeeName} added`)
      setEmployeeModalOpen(false);
      setEmployeeName("")
      setEmployeePassword("")
    }
    catch(err){
      console.log(err)
    }
  };


  const handleSearch = (search:string) => {
    const filteredProjects : Project[] = projects.filter(project =>
      project.title.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filteredProjects);
  }

  const handleLogout = () => {
    localStorage.setItem("name", "");
    router.push("/");
  };

  return (
    <div className='w-full min-h-95vh flex flex-col bg-white p-4 rounded-md opacity-85'>
      <Toaster />
      <div className={`fixed pr-20 z-50 w-full flex gap-3 items-center ${isAdmin ? 'justify-between' : 'justify-center'}`}>
        <div className="md:hidden">
          {isAdmin && (
            <button className="block text-gray-500 m-2 focus:outline-none" onClick={() => setDrawerOpen(true)}>
              Menu
            </button>
          )}
        </div>
        <div className="hidden md:block w-fit">
          {isAdmin && (
            <div className='w-fit'>
              <button
                className='m-2 p-2 bg-lime-500 text-white rounded-md'
                onClick={() => setClientModalOpen(true)}
              >
                + Add Client
              </button>
              <button
                className='m-2 p-2 bg-blue-500 text-white rounded-md'
                onClick={() => setEmployeeModalOpen(true)}
              >
                + Add Employee
              </button>
            </div>
          )}
        </div>
        <div className={`lg:w-5/12 ${!isAdmin && 'text-center'}`}>
          <input
            className='p-2 w-full box-border border-black rounded-md bg-slate-300'
            type='text'
            placeholder='Search'
            onChange={(e) => {handleSearch(e.target.value)}}
          />
        </div>
        {isAdmin && (
          <div className="hidden md:block">
            <Link href={"/project"} className='m-2 p-2 bg-red-500 text-white rounded-md'>
              + New Project
            </Link>
          </div>
        )}
        <div className={`${isAdmin&&'hidden'} max-w-fit mr-3 md:block ml-auto`}>
          <Button onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      {/* render projectcard with colour based on status */}
      <div className='w-full min-h-full p-10 pt-32 flex flex-wrap gap-6 justify-center'>
        {(searchResults.length > 0 ? searchResults : projects).map(project => (
          <Link key={project.id} href={`/project/${project.id}`}>
            <ProjectCard id={project.id} title={project.title} status={project.status} />  
          </Link>
        ))}
      </div>

      {/* Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>

          <DrawerBody>
            {isAdmin && (
              <>
                <Button
                  colorScheme="green"
                  className='m-2 p-2 rounded-md'
                  onClick={() => setClientModalOpen(true)}
                >
                  + Add Client
                </Button>
                <Button
                  colorScheme="blue"
                  className='m-2 p-2 rounded-md'
                  onClick={() => setEmployeeModalOpen(true)}
                >
                  + Add Employee
                </Button>
                <Link href={"/project"} className='m-2 p-2 pr-3 pl-3 w-fit font-bold bg-red-500 text-white rounded-md block'>
                  + New Project
                </Link>
                <div className="mt-4">
                  <Button onClick={handleLogout} className="w-full">
                    Logout
                  </Button>
                </div>
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Client Modal */}
      <Modal isOpen={isClientModalOpen} onClose={() => setClientModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Client</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleClientSubmit}>
              Submit
            </Button>
            <Button onClick={() => setClientModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Employee Modal */}
      <Modal isOpen={isEmployeeModalOpen} onClose={() => setEmployeeModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Employee Name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
            <Input
              mt={4}
              type="password"
              placeholder="Password"
              value={employeePassword}
              onChange={(e) => setEmployeePassword(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEmployeeSubmit}>
              Submit
            </Button>
            <Button onClick={() => setEmployeeModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Page;
