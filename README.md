# Overview
This is a Task Manager API that was built using Node.JS, Express, and Mongo DB.

The purpose of this project was to build the backend for a task manager application that gave users functionality to: 

- Create a user profile with e-mail and password.
- Log in to user profile
- Log out of user profile
- Create, View, Update, and Delete tasks with respect to their own profile
- Upload an avatar (profile picture)
- Delete an avatar (profile picture)

In addition to the above, authorization was also implemented so that only authorized users were able to perform certain actions in the application.


# Usage/Installation

This application is currently live on: https://amansukhani-task-manager.herokuapp.com/

To use this application, you must install Postman or another API development platform. You can use the platform to make requests to the server with various methods that will be described in the next section. For this particular application, the four main requests include GET, POST, PATCH, and DELETE.

To make a request, you should ideally follow this pattern: 


# Features

The routes that are supported by this application (base URL: https://amansukhani-task-manager.herokuapp.com/) include: 

- POST: /users: creates a user if you supply a json object with name, email, and password in the body of the request

- POST: /users/login: logs in the user based on the email and password that is provided in the body of the request. Log in also generates a token for authorization)

- POST: /users/logout: logs the user out of the current session

- POST: /users/logoutAll: logs the user out of all sessions

- POST: /tasks: creates a task for the user if you supply a json object with a description field and completed field in the body of the request

- POST: /users/me/avatar: uploads an image if you supply an image in the body of the request using the form-data method with key "avatar"

- GET: /users/me: response displays information about the user, which includes age, name, and email.

- GET: /tasks: response displays all the tasks that the user has created. This method also supports query strings to sort and filter the response.

- GET: /tasks/id: response displays information about the task that was requested with the task id

- PATCH: /users/me: updates the current user's information based on the json that is provided in the body of the request.

- PATCH: /tasks/id: updates the task that was provided using the id based on the json that is provided in the body of the   request.

- DELETE: /users/me: deletes the current user/user information from the application

- DELETE: /tasks/id: deletes the task based on the task id that was proivded by the user

- DELETE: /users/me/avatar: deletes the user's avatar