# WebPractical - CW2

#### A full stack web application built with **Node.js**, **Express**, **Mustache** and **NeDB**. a web application that is a course management system

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
    ```bash
    git clone https://github.com/vividandrew/WebPracticalCW2
    cd WebPracticalCW2

3. Building Docker image and run docker image
    ```bash
   docker build --no-cache --tag cw2/webserver:latest .
   docker run --name cw2 -p 3620:3620 -d -v ./db:/app/db cw2/webserver:latest
##### Maintenance
- Some Changes that should be made before the installation is changing the port exposed you must change the run command to

   ```bash
   docker run --name cw2 -p {{PORT_NUMBER}}:3620 -d -v ./db:/app/db cw2/webserver:latest
- Stopping the docker container
    ```bash
    docker stop cw2
- Docker mounts the volumes attached to the database to the local directory in ./db folder this ensures consistency over each restart of the application
#### Bare Metal
1. Clone Repository
   ```bash
   git clone https://github.com/vividandrew/WebPracticalCW2
   cd WebPracticalCW2
2. Install packages essential to application
   ```bash
    npm install
3. Build Application and run
   ```bash
   npm run build
   npm run start

##### Maintenance
- Stop application by pressing Ctrl+C

### Environment Variables
During Installation there is a number of Environment variables that should be changed including
- BUSINESS_NAME: This will be used throughout the website
- PORT: only to be changed in the bare metal installation should not be changed on docker installation
- ACCESS_TOKEN_SECRET: This should be changed for each individual person to a random string of your choice, this is used to encrypt session keys not changing this is a security risk
- ACCESS_TOKEN_LIFE: This should be changed to whatever value the user is comfortable having the user session to allow for before having to log back in

## After installation
Some essential things to note, there is a default user, that contains the follow
- Username: Admin
- Password: changeme

These details should be updated within the admin tools on user management to a more secure password

Each installation also contains some default courses, if there are no current course in the database already this will populate the installation with some pre-set courses to allow you to see how they are viewed

Both of these happen during the first installation and any time you make a fresh install of the web application