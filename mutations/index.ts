
const ADD_CLIENT : string = `
mutation AddClient($name: String!) {
    addClient(
      name: $name
    ) {
      name
    }
}`

const ADD_EMPLOYEE : string = `
mutation AddEmployee($name: String!, $password: String!) {
    addEmployee(
      name: $name
      password: $password
    ) {
      name
    }
}`

const ADD_PROJECT : string = `
mutation AddProject($title: String!, $description: String!, $status: String!, $client: String!, $employees: [String!]!) {
    addProject(
      title: $title
      description: $description
      status: $status
      client: $client
      employees: $employees
    ) {
      id
      title
      description
      status
      client
      employees
    }
  }`

const ADD_COMMENT : string = `
mutation AddComment($id: ID!, $name: String!, $content: String!) {
    addComment(
      id: $id
      name: $name
      content: $content
    ) {
      id
      title
      updates {
        name
        content
        createdAt
      }
    }
}`

const UPDATE_PROJECT : string = `
mutation UpdateProject($id: ID!, $title: String!, $description: String!, $status: String!, $client: String!, $employees: [String!]!) {
    updateProject(
      id: $id
      title: $title
      description: $description
      status: $status
      client: $client
      employees: $employees
    ) {
      id
      title
      description
      status
      client
      employees
    }
}`

const DELETE_PROJECT : string = `
mutation DeleteProject($id: ID!) {
    deleteProject(
      id: $id
    )
}`

export { ADD_CLIENT , ADD_COMMENT , ADD_EMPLOYEE , ADD_PROJECT , UPDATE_PROJECT , DELETE_PROJECT }