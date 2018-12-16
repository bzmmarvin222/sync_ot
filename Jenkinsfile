#!groovy​

node {
    stage('checkout sources') {
        final scmResult = checkout(scm)
        echo "Commit is: ${scmResult.GIT_COMMIT}"
        echo "Branch name is: ${env.BRANCH_NAME}"
    }

    docker.image('node:carbon').inside {
        stage('npm install') {
            echo "Using node version:"
            sh 'node -v'
            echo "Running npm install and audit fix"
            sh 'npm install --only=production && npm audit fix'
        }

        stage('npm build') {
            echo "Running npm build"
            sh 'npm run build'
        }

        stage('npm test') {
            echo "Running npm test"
            sh 'npm test'
        }
    }
}
