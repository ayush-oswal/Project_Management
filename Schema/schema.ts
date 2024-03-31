
import bcrypt from "bcrypt"
import Client from "@/Database/models/client";
import Employee from "@/Database/models/employee";
import Project from "@/Database/models/project";
import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";




//Types

const updateType = new GraphQLObjectType({
    name : "Update",
    fields : () => ({
        name : {type:GraphQLString},
        content : {type:GraphQLString},
        createdAt : {type:GraphQLString}
    })
})

const projectType = new GraphQLObjectType({
    name : "Project",
    fields : () => ({
        id : {type : GraphQLID},
        title : {type : GraphQLString},
        description : {type : GraphQLString},
        updates : {type : new GraphQLList(updateType)},
        status : {type : GraphQLString},
        client : {type : GraphQLString},
        employees : {type : new GraphQLList(GraphQLString)},
        createdAt : {type:GraphQLString},
        updatedAt : {type:GraphQLString}
    })
})

const employeeType = new GraphQLObjectType({
    name : "Employee",
    fields : () => ({
        name : {type:GraphQLString},
        projects : {
            type : new GraphQLList(projectType),
            resolve : async(parent,args)=>{
                const projects = await Project.find({ _id: { $in: parent.projects } });
                const sortedProjects = projects.sort((a, b) => {
                    // Define the order of status values
                    const statusOrder : { [key: string]: number } = {
                        'Not Started': 0,
                        'In Progress': 1,
                        'Completed': 2,
                    };
                
                    // Compare statuses first
                    const statusComparison = statusOrder[a.status] - statusOrder[b.status];
                    if (statusComparison !== 0) {
                        return statusComparison;
                    } else {
                        const updatedAtA = new Date(a.updatedAt).getTime();
                        const updatedAtB = new Date(b.updatedAt).getTime();
                        return updatedAtB - updatedAtA;
                    }
                });
                
                return sortedProjects;
            }
        }
    })
})

const clientType = new GraphQLObjectType({
    name : "Client",
    fields : () => ({
        name : {type : GraphQLString}
    })
})


//Query

const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields : {
        projects : {
            type : new GraphQLList(projectType),
            resolve : async(parent,args)=>{
                const projects = await Project.find();
                const sortedProjects = projects.sort((a, b) => {
                    // Define the order of status values
                    const statusOrder : { [key: string]: number } = {
                        'Not Started': 0,
                        'In Progress': 1,
                        'Completed': 2,
                    };
                
                    // Compare statuses first
                    const statusComparison = statusOrder[a.status] - statusOrder[b.status];
                    if (statusComparison !== 0) {
                        return statusComparison;
                    } else {
                        const updatedAtA = new Date(a.updatedAt).getTime();
                        const updatedAtB = new Date(b.updatedAt).getTime();
                        return updatedAtB - updatedAtA;
                    }
                });
                
                return sortedProjects;
                
            }
        },
        project : {
            type : projectType,
            args : {
                id : {type : GraphQLID}
            },
            resolve : async(parent,args) => {
                return await Project.findById(args.id)
            }
        },
        clients : {
            type : new GraphQLList(clientType),
            resolve : async(parent,args)=>{
                return await Client.find();
            }
        },
        employees : {
            type : new GraphQLList(employeeType),
            resolve : async(parent,args)=>{
                return await Employee.find();
            }
        },
        employee : {
            type : employeeType,
            args : {
                id : {type : new GraphQLNonNull(GraphQLID)}
            },
            resolve : async(parent,args) => {
                return await Employee.findById(args.id)
            }
        }
    }
});


//Mutations

const mutation = new GraphQLObjectType({
    name : "Mutation",
    fields : {
        //Client
        addClient : {
            type : clientType,
            args : {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve : async(parent,args)=>{
                const newClient = new Client({
                    name : args.name
                })
                return await newClient.save();
            }
        },
        //Employee
        addEmployee : {
            type : employeeType,
            args : {
                name : { type: new GraphQLNonNull(GraphQLString) },
                password : { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve : async(parent,args)=>{
                const salt: string = await bcrypt.genSalt();
                const hash = await bcrypt.hash(args.password,salt);
                const newEmployee = new Employee({
                    name : args.name,
                    password : hash
                })
                return await newEmployee.save()
            }
        },
        //Project
        addProject : {
            type : projectType,
            args : {
                title : { type: new GraphQLNonNull(GraphQLString) },
                description : { type: new GraphQLNonNull(GraphQLString) },
                status : { type : new GraphQLNonNull(GraphQLString) },
                client : { type : new GraphQLNonNull(GraphQLString) },
                employees : { type : new GraphQLNonNull( new GraphQLList(GraphQLString)) }
            },
            resolve : async(parent,args)=>{
                const newProject = new Project({
                    title : args.title,
                    description : args.description,
                    status : args.status,
                    client : args.client,
                    employees : args.employees
                })
                const savedProject = await newProject.save();
                // Update each employee with the new project id
                await Employee.updateMany(
                    { name: { $in: args.employees } },
                    { $addToSet: { projects: savedProject._id } }
                );
                return savedProject;  
            }
        },
        addComment : {
            type : projectType,
            args : {
                id : { type : new GraphQLNonNull(GraphQLID) },
                name : { type : new GraphQLNonNull(GraphQLString) },
                content : { type : new GraphQLNonNull(GraphQLString) }
            },
            resolve : async(parent,args) => {
                const project = await Project.findById(args.id)
                const newComment = {
                    name : args.name,
                    content : args.content
                }
                project.updates.push(newComment);
                return await project.save()
            }
        },
        updateProject: {
            type: projectType,
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) },
              title: { type: new GraphQLNonNull(GraphQLString) },
              description: { type: new GraphQLNonNull(GraphQLString) },
              status: { type: new GraphQLNonNull(GraphQLString) },
              client: { type: new GraphQLNonNull(GraphQLString) },
              employees: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) }
            },
            resolve: async (parent, args) => {
              try {
                // Update the project
                await Project.updateOne({ _id: args.id }, {
                  $set: {
                    title: args.title,
                    description: args.description,
                    status: args.status,
                    client: args.client,
                    employees: args.employees
                  }
                });
          
                // Remove project ID from employees who are not in the updated list
                await Employee.updateMany(
                  { projects: args.id }, // Select employees associated with the project
                  { $pull: { projects: args.id } } // Remove project ID from their projects array
                );
          
                // Add project ID to the updated list of employees
                await Employee.updateMany(
                  { name: { $in: args.employees } }, // Select employees in the updated list
                  { $addToSet: { projects: args.id } } // Add project ID to their projects array
                );
          
                // Return the updated project
                return await Project.findById(args.id);
              } catch (err) {
                console.log(err);
                throw new Error("Failed to update project.");
              }
            }
          },
          deleteProject: {
            type: GraphQLString,
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve: async (parent, args) => {
              try {
                // Delete the project
                await Project.deleteOne({ _id: args.id });
          
                // Remove project ID from all employees
                await Employee.updateMany(
                  { projects: args.id }, // Select employees associated with the project
                  { $pull: { projects: args.id } } // Remove project ID from their projects array
                );
          
                return "ok";
              } catch (err) {
                console.log(err);
                throw new Error("Failed to delete project.");
              }
            }
          }
    }
})

const schema = new GraphQLSchema({
    query : RootQuery,
    mutation
})

export default schema