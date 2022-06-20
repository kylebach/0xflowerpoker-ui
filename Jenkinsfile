node {
  try {
    stage('Checkout') {
      checkout scm
    }
    stage('Environment') {
      sh 'git --version'
      echo "Branch: ${env.BRANCH_NAME}"
      sh 'docker -v'
      sh 'printenv'
    }
    stage('Build Contract') {
      sh 'git submodule update --init'
      sh 'cd 0xflowerpoker && npm install && ./node_modules/.bin/hardhat compile'
    }
    stage('Build'){
     sh 'docker build -t 0xflowerpoker .'
     sh 'docker tag 0xflowerpoker localhost:5555/0xflowerpoker'
     sh 'docker push localhost:5555/0xflowerpoker'
    }
    stage('Deploy Docker image'){
      if(env.BRANCH_NAME == 'master' || env.BRANCH_NAME == null){
        sh 'docker rmi -f bachin.ski localhost:5555/0xflowerpoker'
        sh 'docker stop 0xflowerpoker || true'
        sh 'docker rm 0xflowerpoker || true'
        sh 'docker run -d --restart unless-stopped --name 0xflowerpoker -p 3050:3000 localhost:5555/0xflowerpoker'
      }
    }
  }
  catch (err) {
    throw err
  }
}
