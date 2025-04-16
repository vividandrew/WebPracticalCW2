# WebPractical - CW2

#### A full stack web application built wuth **Node.js**, **Express**, **Mustache** and **NeDB**. a web application that is a course management system

---

## Features

- Anonymous Users
  - View course & company details
  - Register as a user
- Users
  - Authentication
  - Can enroll in courses
  - Management of courses enrolled in
- Staff
  - User Management, creation and deletion
  - Course management, creation and deletion
  - Print course list containing students and course information

---
## Getting Started

## Prerequisites
- Docker installation
  - Docker Installed on local system
  - git
- Bare Metal installation
  - Node.js (Latest installation as of 16/04/2025)
  - npm (Included with Node.js)
  - git

### Instalation Instructions
#### Docker
1. Clone Repository
'''bash
git clone https://github.com/vividandrew/WebPracticalCW2
cd WebPracticalCW2
2. Building Docker image and run docker image
'''bash
   docker build --no-cache --tag cw2/webserver:latest .
   docker run --name cw2 -p 3620:3620 -d -v ./db:/app/db cw2/webserver:latest
##### Maintenance
- Some Changes that should be made before the installation is changing the port exposed you must change the run command to

   '''bash
   docker run --name cw2 -p {{PORT_NUMBER}}:3620 -d -v ./db:/app/db cw2/webserver:latest
- Stopping the docker container
    '''bash
    docker stop cw2
- Docker mounts the volumes attached to the database to the local directory in ./db folder this ensures consistency over each restart of the application
#### Bare Metal
1. Clone Repository
   '''bash
   git clone https://github.com/vividandrew/WebPracticalCW2
   cd WebPracticalCW2
2. Install packages essential to application
   '''bash
    npm install
3. Build Application and run
   '''bash
   npm run build
   npm run start

##### Maintenance
- Stop application by pressing Ctrl+C

### Environment Variables
During Installation there is a number of Environment variables that should be changed including
- BUSINESS_NAME: This will be used throughout the websaite
- PORT: only to be changed in the bare metal installation should not be changed on docker installation
- ACCESS_TOKEN_SECRET: This should be changed for each indviidual person to a random string of your choice, this is used to encrypt sesesion keys not changing this is a security risk
- ACCESS_TOKEN_LIFE: This should be changed to whatever value the user is comfortable with having the user session to allow for before having to log back in