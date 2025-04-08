pipeline {
    agent any
    stages{
        stage("Build Docker image")
        {
            steps {
                echo ' Building Docker Image... '
                sh ' docker build --no-cache --tag vividsoushi/uniwebserver:latest .'
            }
        }
        stage("Test Docker image")
        {
            steps{
                echo ' Testing Docker Image... '
                sh 'docker stop webserver'
                sh 'docker rm webserver'
                sh 'docker image inspect vividsoushi/uniwebserver:latest'
                sh 'docker run --name webserver -p 3620:3620 -d vividsoushi/webserver:latest'
                sh 'docker stop webserver'
            }
        }
        stage("Deploy application...")
        {
            steps{
                echo ' Deploying Application... '
                sshagent(credentials: ['9ebc0e51-9700-44b8-a262-5981f4c57a95']){
                                    sh 'rsync --progress ./* agent@192.168.6.204:/home/agent/'
                                    sh 'ssh agent@192.168.6.204 docker start webserver'
                                }
            }
        }
    }
}
