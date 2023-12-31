# Node.js Express User Authorization Microservice
Welcome to the Node.js Express User Authorization Microservice! This project is a work in progress. Once completed, it will provide comprehensive functionality for managing user access, including signup, sign-in, user profile editing and deletion, authorization checks, and password reset. 

Stay tuned for updates as we continue to enhance and refine this microservice. Also, feel free to explore the code and don't hesitate to reach out with any questions or feedback!

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
* Save developers time and effort by eliminating the need to develop user authentication from scratch. Developers can clone or fork this repository and integrate it into their projects.
* Serve as a learning resource for developing RESTful APIs to manage user authentication, incorporating cutting-edge technologies such as password encryption, Jason Web Tokens (JWT), and Passport.js authentication.
* Guide developing automated procedures for user signup, sign-in, account confirmation, password resets (Forgot password) through email, and more.

<!--
(#features)
-->

## Completed Features

### Endpoints

* Signup.
* Sign-in (Login).
* Get user data.
* Edit user data.
* Change password.
* Authorization check (Token validation) for user sign operation type.

### User data

* Passwords are hash-encrypted before saving user data.
* User documents record the number of failed login attempts; when a threshold is reached, the user changes status to locked.
* The API records the following dates for user documents: date of creation, date of last user data update, last access date, and last successful login date.

### Technical features

* Sigin with a passport.js local strategy, issuing a JWT Token for further authentication (client sends login and password once. Then, they can use the token for authentication until it expires).
* Route protection with Passport, with a JWT token strategy. JWT Tokens are acquired through sign-in (which uses a passport local strategy), at signup (for email verification), when requesting a password reset, or other operations. Afterward, the client must send appropriate tokens to gain access to protected routes.
* Operation types are signed-on tokens such as sign-in, signup verification (email confirmation) and password resets. As a result, tokens issued for one purpose cannot be used for another.
* Schema-based request data validation with middleware functions that execute before handlers.
* The endpoints follow a route, handler, service, and DB service structure.
* Encapsulated database configuration, modeling and access functionality, separated from other programming logic.
* Environment variables file segregated from the API Source code.
* Testing configuration and tests with Jest. It also includes HTTP server testing with the "supertest" library.
* Include testing to ensure that user data sent to data creation and modification endpoints is correctly saved in the database. To this end, the test accesses the database directly and compares saved data against expected results. Among these database tests are data comparison tests, user log date updates and user status updates.

<!--
(#Planned Features)
-->

## Planned Features

### Endpoints

* Signup email confirmation.
* Signup resend email confirmation.
* Delete user.
* Authorization check (Token validation) for email confirmation operation type.
* Authorization check (Token validation) for password reset operation type.
* Password send reset code.
* Password reset.

<!--
(#tech-stack-used)
-->

## Technologies

### Stack

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

### Tools and Libraries

![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![EsLint](	https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)

### Libraries Description

- **Passport**: Flexible and modular authentication middleware for Node.js that provides a simple and customizable way to handle user authentication in web applications. This project uses a local strategy for user sign-in, which sends a JWT token to the client. Afterward, a JWT strategy is used to authenticate users with a valid sign-in JWT Token.
- **JSON web token:** Generate and verify JSON Web Tokens (JWTs) for authentication and authorization purposes in web applications. In this microservice, tokens are issued at user sign-in after validating credentials. As a result, users authenticate only once and then use tokens to access protected routes until the token expires.
- **bcrypt:** Hashing passwords securely in JavaScript (Used in this project at user signup).
- **Joi:** Schema validation library for enforcing constraints on JavaScript objects. They are used to apply data validations as middleware before executing route handlers.
- **joi-objectid:** A Joi extension that adds support for validating MongoDB ObjectIds.
- **Mongoose:** Used for modeling and interacting with MongoDB databases.
- **dotenv:** Loading environment variables from a .env file in Node.js applications. (The Database URI is loaded this way)
- **Supertest:** Testing Node.js HTTP servers by making HTTP requests and asserting responses, without having to start an HTTP server (Used in conjunction with Jest for testing)
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

**Note:** While this codebase utilizes MongoDB, you can easily adapt it to work with another database system. The database  [configuration](./src/config/database.js), [models](./src/models) and [database access services](./src/services/dbservices) are encapsulated, allowing you to modify these files to support a different database without needing to change the utility, services, middleware, and handlers code. This flexibility becomes increasingly valuable as your applications scale in size.

### Setup Procedure

- Download or clone Repo.
- Navigate to the project's folder and install its dependencies using npm by entering the command:
```
npm install
```

### Environment variables file (.env)

Before running this project, you must create a .env file and add the following environment variables.

**`APP_PORT`**  
Listening port for the Node Express Rest API (e.g., 4000).

**`DB_URI`**  
Database URL or URI. If you use a localhost installation of MongoDB, you may enter a localhost URL. If you are using a MongoDB cloud service, you must specify the URI provided by the service provider. Here are a couple of examples:

Local MongoDB URL:  
`http://localhost:27017/<Name of Database>`

Cloud Atlas MongoDB URI:  
`mongodb+srv://<Cloud Atlas database username>:<Cloud Atlas database password@appcluster0.ckkhqvp.mongodb.net/<Name of the database>?retryWrites=true&w=majority`

**`JWT_SECRET`**
A random hex secret key is required to issue the JWT Tokens for user sign-in, email confirmation, password resets or any other
operation (64 characters or more recommended).

This project includes a .env.template file that you may fill and rename to .env.

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
.eslintrc.json
app.js
jest.config.js
LICENSE
package-lock.json
package.json
README.md
[src]
    ├── app.js
    ├── [config]
        ├── app.js
        ├── database.js
        ├── parameters.js
        ├── passport-config.js
        └── passport-strategies.js
    ├── [handlers]
        ├── sign-in.js
        ├── sign-up.js
        └── users.js
    ├── [middleware]
        ├── auth.js
        └── [request-validations]
            ├── sign-in.js
            ├── sign-up.js
            └── users.js
    ├── [models]
        └── user.js
    ├── [services]
        ├── [auth]
            ├── check-user-auth-status.js
            └── check-user-password.js
        ├── [dbservices]
            └── user.js
        ├── sign-in-auth.js
        ├── sign-up.js
        └── users.js
    └── [utils]
        ├── check-password.js
        ├── [db]
            └── validate-doc-id.js
        ├── encrypt-pwd.js
        ├── res-error.js
        ├── sign-jwt-token.js
        ├── user-updates.js
        └── [validators]
            ├── sign-in.js
            ├── sign-up.js
            ├── str-formats.js
            ├── token-payload.js
            └── users.js
[test]
    ├── [fixtures]
        ├── create-signed-up-user.js
        ├── create-user.js
        ├── [mock-data]
            ├── sign-in-check-auth.js
            ├── sign-in.js
            ├── sign-up.js
            ├── users-get.js
            ├── users-password-patch.js
            └── users-patch.js
        └── sign-mock-jwt.js
    ├── [setup]
        ├── parameters.js
        └── setup-tests.js
    ├── [teardowns]
        └── delete-user.js
    ├── [test-end-to-end]
        ├── sign-in-check-auth.test.js
        ├── sign-in.test.js
        ├── sign-up.test.js
        ├── users.get.test.js
        ├── users.password.patch.test.js
        └── users.patch.test.js
    └── [utils]
        ├── check-password.js
        ├── db-find-users.js
        ├── delay.js
        ├── verif-db-id-type.js
        └── verif-types.js
```

<!--
(#project-status)
-->

## Project Status

The project is **In progress**.

Feel free to make suggestions on how to improve the project.

<!--
(#contact-me)
-->

## Contact

Created by **Ricardo Rodriguez** - contact me on the following links:

[![Ricardo's Github Profile](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rodmor59)
[![Ricardo's Linkedin Profile](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ricartrodrig)
