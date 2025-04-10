pipeline {
    agent any
    stages{
        stage("Build Docker image")
        {
            steps {
                echo ' Building Docker Image... '
                sh ' docker build --no-cache --tag cw2/webserver:latest .'
            }
        }
        stage("Test Docker image")
        {
            steps{
                echo ' Testing Docker Image... '
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE'){
                    sh 'docker stop cw2'
                    sh 'docker rm cw2'
                }
                sh 'docker image inspect cw2/webserver:latest'
                sh 'docker run --name cw2 -p 3620:3620 -d -v "${pwd}/db:/app/db" cw2/webserver:latest'
                //sh 'docker stop cw2'
            }
        }
        /*
        stage("Deploy application...")
        {
            steps{
                echo ' Deploying Application... '
                sshagent(credentials: ['9ebc0e51-9700-44b8-a262-5981f4c57a95']){
                                    sh 'rsync --progress ./* agent@192.168.6.204:/home/agent/'
                                    sh 'ssh agent@192.168.6.204 docker start cw2'
                                }
            }
        }*/
    }
}
