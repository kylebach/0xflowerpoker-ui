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
    stage('Build and Publish Docker image'){
     sh 'git submodule update --init'
     sh 'cd ./0xflowerpoker && npm install && cd ..'
     sh 'npm install'
     sh 'docker build -t 0xflowerpoker .'
     sh 'docker tag 0xflowerpoker docker.i.bachin.ski:5011/0xflowerpoker'
     sh 'docker push docker.i.bachin.ski:5011/0xflowerpoker'
    }
    stage('Deploy Docker image'){
      if(env.BRANCH_NAME == 'master' || env.BRANCH_NAME == null){
        sh 'docker rmi -f 0xflowerpoker docker.i.bachin.ski:5011/0xflowerpoker'
        sh 'docker stop 0xflowerpoker || true'
        sh 'docker rm 0xflowerpoker || true'
        sh 'docker run -d --restart unless-stopped --name 0xflowerpoker -p 3050:3000 docker.i.bachin.ski:5011/0xflowerpoker'
      }
    }
  }
  catch (err) {
    throw err
  }
}
