"use client"

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import toast, { Toaster } from 'react-hot-toast';
import { GET_CLIENTS, GET_EMPLOYEES } from '@/queries';
import { Spinner } from "@chakra-ui/react"
import { ADD_PROJECT, UPDATE_PROJECT } from '@/mutations';
import { projectFormSchema, ProjectFormData } from '../validator';
import { ZodError } from 'zod';




interface ProjectFormProps {
    id?: string;
    title?: string;
    description?: string;
    client?: string;
    selectedEmployees?: string[];
    status?: string;
  }  

const ProjectForm= ({
  id,
  title: initialTitle = '',
  description: initialDescription = '',
  client: initialClient = '',
  selectedEmployees: initialSelectedEmployees = [],
  status: initialStatus = 'Not Started',
} : ProjectFormProps) => {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  if(id && !initialTitle) router.push("/dashboard")
  const [description, setDescription] = useState(initialDescription);
  const [employees, setEmployees] = useState<string[]>([]);
  const [clients, setClients] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>(initialClient);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(initialSelectedEmployees);
  const [searchTermClient, setSearchTermClient] = useState<string>(initialClient);
  const [searchTermEmployee, setSearchTermEmployee] = useState<string>('');
  const [showEmployeeList, setShowEmployeeList] = useState<boolean>(false);
  const [showClientList, setShowClientList] = useState<boolean>(false);
  const [status, setStatus] = useState<string>(initialStatus);
  const [submitting,setSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (localStorage.getItem('name') !== 'Admin') router.push('/');

    const getClients = async() => {
      const response = await fetch("/api/graphql", {
        method: "POST",
        body: JSON.stringify({
          source: GET_CLIENTS,
          variableValues: {}
        })
      });

      const { data } = await response.json();
      const clientNames = data.clients.map((client : {name:string})=>client.name)
      setClients(clientNames)
    }

    const getEmployees = async () => {
      const response = await fetch("/api/graphql", {
        method: "POST",
        body: JSON.stringify({
          source: GET_EMPLOYEES,
          variableValues: {}
        })
      });
  
      const { data } = await response.json();
      const employeeNames = data.employees.map((employee: { name: string }) => employee.name);
      setEmployees(employeeNames);
    };
  
    getEmployees();
    getClients();
  }, []);

  const handleInputFocus = (inputType: string) => {
    if (inputType === 'employee') {
      setShowEmployeeList(true);
      setShowClientList(false); // Hide client list
    } else if (inputType === 'client') {
      setShowClientList(true);
      setShowEmployeeList(false); // Hide employee list
    }
  };

  const handleClientSelection = (client: string) => {
    setSelectedClient(client);
    setSearchTermClient(client);
    setShowClientList(false); // Hide client list
  };

  const handleEmployeeSelection = (employee: string) => {
    setSelectedEmployees([...selectedEmployees, employee]);
    setSearchTermEmployee(''); // Clear search term
    setShowEmployeeList(false); // Hide employee list
  };

  const handleEmployeeDeselection = (employee: string) => {
    setSelectedEmployees(selectedEmployees.filter((emp) => emp !== employee));
  };

  const handleSubmit = async() => {
    try {
      const formData: ProjectFormData = projectFormSchema.parse({
        title,
        description,
        client: selectedClient,
        employees : selectedEmployees,
        status,
      });
    } catch (err) {
      // Handle validation errors
      if(err instanceof ZodError){
        toast.error(err.errors[0].message);
      }
      else toast.error("Unknown error");
      return;
    }
    setSubmitting(true)
    if(id){
      try{
        const response = await fetch("/api/graphql",{
          method:"POST",
          body : JSON.stringify({
            source : UPDATE_PROJECT,
            variableValues : {
              id,
              title,
              description,
              status,
              client:selectedClient,
              employees : selectedEmployees
            }
          })
        })
        toast.success("Project Updated")
        router.push(`/project/${id}`)
      }
      catch(err){
        console.log(err)
      }
    }
    else{
      try{
        const response = await fetch("/api/graphql",{
          method : "POST",
          body : JSON.stringify({
            source : ADD_PROJECT,
            variableValues : {
              title,
              description,
              status,
              client:selectedClient,
              employees : selectedEmployees
            }
          })
        })
        toast.success("Project Created")
        router.push("/dashboard")
      }
      catch(err){
        console.log(err)
      }
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.toLowerCase().includes(searchTermEmployee.toLowerCase()) && !selectedEmployees.includes(emp)
  );

  const filteredClients = clients.filter((client) =>
    client.toLowerCase().includes(searchTermClient.toLowerCase())
  );

  return (
    <div className='w-full h-full min-h-95vh text-center flex flex-col gap-2 bg-white p-4 rounded-md opacity-85'>
      <Toaster />
      <span className='mb-4 block text-lg font-bold'>{id ? 'Edit' : 'Create'} Project</span>
      <input
        type='text'
        placeholder='Project Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='border border-gray-300 rounded-md p-2 mb-4 w-full'
      />
      <div>
        <ReactQuill placeholder='Project Description' theme='snow' value={description} onChange={setDescription} />
      </div>
      <div className="relative">
        <input
          type='text'
          placeholder='Select Client'
          value={searchTermClient}
          onFocus={() => handleInputFocus('client')}
          onChange={(e) => setSearchTermClient(e.target.value)}
          className='border border-gray-300 rounded-md p-2 mt-4 mb-4 w-full'
        />
        {showClientList && (
          <button
            className="absolute top-4 right-2 mr-2 mt-2"
            onClick={() => setShowClientList(false)}
          >
            ❌
          </button>
        )}
        {showClientList && (
          <div className='mb-4 max-h-40 overflow-y-auto'>
            {filteredClients.map((client) => (
              <div
                key={client}
                className='cursor-pointer border border-gray-300 rounded-md p-2 mb-1'
                onClick={() => handleClientSelection(client)}
              >
                {client}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <input
          type='text'
          placeholder='Select Employees'
          value={searchTermEmployee}
          onFocus={() => handleInputFocus('employee')}
          onChange={(e) => setSearchTermEmployee(e.target.value)}
          className='border border-gray-300 rounded-md p-2 mb-4 w-full'
        />
        {showEmployeeList && (
          <button
            className="absolute top-0 right-2 mr-2 mt-2"
            onClick={() => setShowEmployeeList(false)}
          >
            ❌
          </button>
        )}
        {showEmployeeList && (
          <div className='mb-4 max-h-40 overflow-y-auto'>
            {filteredEmployees.map((emp) => (
              <div
                key={emp}
                className='cursor-pointer border border-gray-300 rounded-md p-2 mb-1'
                onClick={() => handleEmployeeSelection(emp)}
              >
                {emp}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='mb-4'>
        {selectedEmployees.map((emp) => (
          <div
            key={emp}
            className='border border-gray-300 rounded-md p-2 mb-1 inline-block mr-2'
          >
            <span>{emp}</span>
            <button
              onClick={() => handleEmployeeDeselection(emp)}
              className='ml-2 text-red-500'
            >
              &#x2715;
            </button>
          </div>
        ))}
      </div>
      {id && (
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      )}
      <div className='text-center'>
      {
  !submitting ? (
    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
      {id ? 'Update Project' : 'Create Project'}
    </button>
  ) : (
    <Spinner 
      thickness='3px'
      speed='0.65s'
      emptyColor='white'
      color='blue.500'
      size='lg'
    />
  )
}
      </div>
      
    </div>
  );
};

export default ProjectForm;
