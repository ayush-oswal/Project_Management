

const GET_ALL_PROJECTS : string = `
query GetAllProjects {
    projects {
      id
      title
      status
    }
}`

const GET_PROJECT : string = `
query GetProject($id: ID!) {
    project(id: $id) {
      id
      title
      description
      updates{
        name
        content
        createdAt
      }
      status
      client
      employees
      createdAt
      updatedAt
    }
}`

const GET_CLIENTS : string = `
query GetAllClients {
    clients {
      name
    }
}`

const GET_EMPLOYEES : string = `
query GetAllEmployees {
    employees {
      name
    }
}`


const GET_EMPLOYEE : string = `
query GetEmployee($id: ID!) {
    employee(id: $id) {
      name
      projects {
        id
        title
        status
      }
    }
}`

export { GET_ALL_PROJECTS , GET_PROJECT , GET_CLIENTS , GET_EMPLOYEES , GET_EMPLOYEE }