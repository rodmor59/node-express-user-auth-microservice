# Node.js Express User Authorization Microservice
Welcome to the Node.js Express User Authorization Microservice! This project is a work in progress. Once completed, it will provide comprehensive functionality for managing user access, including signup, sign-in, user profile editing and deletion, authorization checks, and password reset. 

Stay tuned for updates as we continue to enhance and refine this microservice. Also, feel free to explore the code and don't hesitate to reach out with any questions or feedback you may have!

<!--
(#table-of-contents)
-->

## Table of Contents

* [About this Project](#about-this-project)
* [Completed Features](#completed-features)
* [Planned Features](#planned-features)
* [Technologies](#technologies)
* [Setup](#setup)
* [Usage](#usage)
* [Project Architecture and Folder Structure](#project-architecture-and-folder-structure)
* [Project Status](#project-status)
* [Contact](#contact)

<!--
(#general-information)
-->

## About This Project

This project aims to:

* Provide a standard Node.js Express microservice with a comprehensive set of features for managing user access.
* Address the common need for user authentication in almost all applications, following industry-standard project organization practices, emphasizing separation of concerns, modularity, and code reusability.
* Save developers time and effort by eliminating the need to develop user authentication from scratch. Developers can simply clone or fork this repository and integrate it into their projects.
* Serve as a learning resource for developing RESTful APIs to manage user authentication, incorporating cutting-edge technologies such as password encryption, Jason Web Tokens (JWT), and Passport.js authentication.
* Provide guidance on developing automated procedures for user signup, sign-in, account confirmation, password resets (Forgot password) through email, and more.

<!--
(#features)
-->

## Completed Features

### Endpoints

* Signup.

### Technical features

* Password encryption.
* Schama based request data validation with middleware functions that execute before handlers.
* The endpoints follows a route, handler, service, and DB service structure.
* Encapsulated database configuration, modeling and access functionality, separated from other programming logic.
* Environment variables file segregated from the API Source code.
* Testing configuration and tests with Jest. It also includes HTTP server testing with the "supertest" library.

<!--
(#Planned Features)
-->

## Planned Features

### Endpoints

* Signup email confirmation.
* Signup resend email confirmation.
* Signin (Login)
* Get user data.
* Edit user data.
* Delete user.
* Change password.
* Autorization check (Token validation).
* Password send reset code.
* Password reset.

### Technical features

* Issuing of JWT Tokens at user signup.
* Route protection with Passport, with a JWT token strategy. All routes except user signup will be protected.

<!--
(#tech-stack-used)
-->

## Technologies

### Stack

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

### Libraries

- **Mongoose:** Used for modeling and interacting with MongoDB databases.
- **Joi:** Schema validation library for enforcing constraints on JavaScript objects. Used to apply data validations ass middleware, before executing route handlers.
- **dotenv:** Loading environment variables from a .env file in Node.js applications. (The Database URI is loaded this way)
- **bcrypt:** Hashing passwords securely in JavaScript. (Used in the signup example endpoint)
- **Supertest:** Testing Node.js HTTP servers by making HTTP requests and asserting responses, withput having to start an http server (Used in conjunction with Jest for testing)
- **esLint:** JavaScript linter for identifying code quality issues and enforcing coding standards. Used to stream software development.

### Dependencies

Check the [package.json](./package.json) file.

### Tests

Test are written with Jest, [here](./test/).

<!--
(#instalation-instructions)
-->

## Setup

### Prerequisites

- Install Node.
- Install npm.
- Install MongoDB (Alternatively, you may use a MongoDB Cloud Service, such as MongoDB Atlas).

Note: While this codebase utilizes MongoDB, you can easily adapt it to work with another database system. The database  [configuration](./src/config/database.js), [models](./src/models) and [database access services](./src/services/dbservices) are encapsulated, allowing you to modify these files to support a different database without needing to change the utility, services, middleware, and handlers code. This flexibility becomes increasingly valuable as your applications scale in size.

### Setup Procedure

- Download or clone Repo.
- Navigate to the project's folder and install its dependencies using npm by entering the command:
```
npm install
```

### Environment variables file (.env)

before running this project, you need to create an .env file and add the following environment variables.

**`APP_PORT`**  
Listening port for the Node Express Rest API (e.g., 4000).

**`DB_URI`**  
Database URL or URI. If you are using a localhost installation of MongoDB, you may enter a localhost URL. If you are using a MongoDB cloud service, you must specify the URI provided by the service provider. Here are a couple of examples:

Local MongoDB URL:  
`http://localhost:27017/<Name of Database>`

Cloud Atlas MongoDB URI:  
`mongodb+srv://<Cloud Atlas database username>:<Cloud Atlas database password@appcluster0.ckkhqvp.mongodb.net/<Name of the database>?retryWrites=true&w=majority`

This project includes a .env.template file that you may fill and then rename to .env.

<!--
(#instructions-for-testing-and-starting-the-REST-API)
-->

## Usage

### Start Node Rest API

```
npm run start
```

### Run Jest tests

```
npm run test
```

<!--
(#project-architecture-and-folder-structure)
-->

## Project Architecture and Folder Structure

```
[src]
    ├── app.js
    ├── [config]
        ├── app.js
        ├── database.js
        └── parameters.js
    ├── [handlers]
        └── sign-up.js
    ├── [middleware]
        └── [request-validations]
            └── sign-up.js
    ├── [models]
        └── user.js
    ├── [services]
        ├── [dbservices]
            └── user.js
        └── sign-up.js
    └── [utils]
        ├── encrypt-pwd.js
        ├── res-error.js
        └── [validators]
            ├── validate-req-sign-up.js
            └── validate-str-formats.js
[test]
    ├── [fixtures]
        ├── create-user.js
        └── mock-data.js
    ├── [setup]
        └── setup-tests.js
    ├── [teardowns]
        └── delete-user.js
    └── [test-end-to-end]
        └── sign-up.test.js
.env.template
.eslintrc.json
app.js
jest.config.js
LICENSE
package-lock.json
package.json
README.md
```

<!--
(#project-status)
-->

## Project Status

Project is: In Progress. 

Feel free to make suggestions on how to improve the project.

<!--
(#contact-me)
-->

## Contact

Created by **Ricardo Rodriguez** - contact me on the following links:

[![Ricardo's Github Profile](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rodmor59)
[![Ricardo's Linkedin Profile](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ricartrodrig)