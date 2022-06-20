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
    }
    stage('Build'){
     sh 'docker build -t 0xflowerpoker .'
     sh 'docker tag 0xflowerpoker localhost:5011/0xflowerpoker'
     sh 'docker push localhost:5011/0xflowerpoker'
    }
    stage('Deploy Docker image'){
      if(env.BRANCH_NAME == 'master' || env.BRANCH_NAME == null){
        sh 'docker rmi -f 0xflowerpoker localhost:5011/0xflowerpoker'
        sh 'docker stop 0xflowerpoker || true'
        sh 'docker rm 0xflowerpoker || true'
        sh 'docker run -d --restart unless-stopped --name 0xflowerpoker -p 3050:3000 localhost:5011/0xflowerpoker'
      }
    }
  }
  catch (err) {
    throw err
  }
}
