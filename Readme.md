# Back-End of Todapp

This is the code of the server that you need for the Todapp.

## Express - Node server

This is a node server that includes three main models

- Project
- Task
- Users

### Validation

The project implements **JWT** in the login and the sign up, in the case of the end points with auth requiered is necesary to send the JWT by headers ( x-auth-token )

### Routes

#### Auth (/api/auth)

**Post** Login 
- email
- password

**GET** Get the current user

#### Users (/api/users)

**Post** Create a user
- email,
- password

#### Projects (/api/projects) - Auth required

**Post** Create a project
- projectName

**GET** Get all projects

**PUT** Update a project
- projectName

**DELETE** Delete a project by url send the id like /api/projects/1

#### Task (/api/tasks) - Auth required

**Post** Create a task
- taskName
- projectId

**GET** Get all task of a project
- projectId

**PUT** Update a task, in the url the id of the task like /api/task/1
- projectId
- taskName
- state

**DELETE** Update a task, in the url the id of the task like /api/task/1
- projectId
