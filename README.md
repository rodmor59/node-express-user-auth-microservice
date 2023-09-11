# Node.js Express REST API Demo and Starter
Welcome to the Node.js Express REST API demo repository! This project showcases how to develo a basic RESTful API using Node.js, Express, and Jest. It provides a standardized project structure, an example endpoint, and it's corresponding Jest tests, serving as a valuable resource for learning and kickstarting the development of more complex RESTful APIs.

Feel free to explore the code and don't hesitate to reach out with any questions or feedback you may have!

<!--
(#table-of-contents)
-->

## Table of Contents

* [About this Project](#about-this-project)
* [Features](#features)
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

* Showcase how to develop a basic RESTful API using Node.js and Express.
* Demonstrate industry-standard project organization practices, emphasizing separation of concerns, modularity, and code reusability.
* Provide a learning resource for developing RESTful APIs, facilitating getting started with Node, Express and Jest.
* Provide a clear example of a project structure, an API endpoint and its tests.
* Offer a standardized project structure as a starting point for more complex API developments, saving time and effort.

<!--
(#features)
-->

## Features

*A fully functional demo endpoint (sign-up) that receives data for a new user, encrypts his password and saves the document to the database. The endpoint follows a route, handler, service, and DB service structure.
* Middleware function that uses schemas to validate data received in the request. This function executes as middleware before the route handler.
* The database configuration, modeling and access functionality are encapsulated and separated from other programming logic.
* Password encryption utility function for the demo endpoint.
* Environment variables file segregated from the API Source code.
* Testing configuration and tests with Jest. It also includes HTTP server testing with the "supertest" library.

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
.
├── src
│   ├── config
│   │   ├── app.js
│   │   ├── dabase.js
│   │   └── parameters.js
│   ├── handlers
│   │   └── sign-up.js
│   ├── middleware
│   │   └── request-validations
│   │       └── sign-up.js
│   ├── models
│   │   └── user.js
│   ├── routes
│   │   └── sign-up.js
│   ├── services
│   │   ├── dbservices
│   │   │   └── user.js
│   │   └── sign-up.js
│   ├── utils
│   │   ├── validators
│   │   │   ├── validate-req-sign-up.js
│   │   │   └── validate-str-formats.js
│   │   ├── encrypt-pwd.js
│   │   └── res-error.js
│   └── app.js
├── test
│   ├── routes
│   │   └── sign-up.test.js
│   └── setupTests.js
├── .env.template
├── .eslintrc.json
├── app.js
├── jest.config.js
├── LICENSE
├── package-lock.json
├── package.json
└── README.md

```

<!--
(#project-status)
-->

## Project Status

Project is: Complete. 

I am open to suggestions on how to improve with better coding and architecting practices, while preserving the project aim and tech stack

<!--
(#contact-me)
-->

## Contact

Created by **Ricardo Rodriguez** - feel free to contact me on the following links:

[![Ricardo's Github Profile](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rodmor59)
[![Ricardo's Linkedin Profile](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ricartrodrig)