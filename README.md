first_origin=$(grep 'ONLYORIGINS=' /apps/continuity/$VAR_L_ENV/$VAR_L_APPID/config/fof.cfg | cut -d'=' -f2 | cut -d',' -f1)

    # Check if the Origin is the first value in ONLYORIGINS
    if [[ $Origin == $first_origin ]]; then
        sed -i '/ONLYORIGINS=/{h;s/=.*/=NEW_VALUE/;x;d;};x;s/^.*$//;H' /apps/continuity/$VAR_L_ENV/$VAR_L_APPID/config/fof.cfg
        echo "First origin value has been handled."
    else
        sed -i 's/\(ONLYORIGINS=\)\([^,]*\)/\1\2,NEW_ORIGIN/' /apps/continuity/$VAR_L_ENV/$VAR_L_APPID/config/fof.cfg
        echo "Origin has been removed."
    fi


pipeline {
    agent any
    
    parameters {
        string(name: 'IMAGE_VERSION', defaultValue: 'latest', description: 'Docker image version')
        string(name: 'NAMESPACE', defaultValue: 'default', description: 'Kubernetes namespace')
    }
    
    environment {
        DOCKER_IMAGE = "my-docker-registry/my-app:${params.IMAGE_VERSION}"
        KUBE_NAMESPACE = "${params.NAMESPACE}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Checkout the source code from the repository
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                script {
                    // Example build step
                    echo "Building Docker image: ${env.DOCKER_IMAGE}"
                    sh 'docker build -t ${DOCKER_IMAGE} .'
                }
            }
        }
        
        stage('Push') {
            steps {
                script {
                    // Example push step
                    echo "Pushing Docker image: ${env.DOCKER_IMAGE}"
                    sh 'docker push ${DOCKER_IMAGE}'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // Deploy to Kubernetes
                    echo "Deploying to Kubernetes namespace: ${env.KUBE_NAMESPACE}"
                    sh """
                    kubectl apply -f deployment.yaml --namespace ${env.KUBE_NAMESPACE}
                    """
                }
            }
        }
    }
    
    post {
        always {
            // Cleanup steps
            echo 'Cleaning up...'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}


        

```groovy
// A function to sort the list of strings on id
def sortOnId(list) {
  // A helper function to extract the id from a string
  def getId(str) {
    def match = str =~ /id: (\d+)/ // Use regex to find the id
    if (match) {
      return match[0][1] as int // Return the id as an integer
    } else {
      return -1 // Return -1 if no id is found
    }
  }
  // Sort the list using the getId function as a comparator
  return list.sort { a, b -> getId(a) <=> getId(b) }
}

// A function to return age and name if id is given as a parameter
def getAgeAndName(list, id) {
  // Loop through the list of strings
  for (str in list) {
    // Check if the string contains the id
    if (str.contains("id: $id")) {
      // Use regex to find the age and name
      def ageMatch = str =~ /age: (\d+)/
      def nameMatch = str =~ /name: (\w+)/
      // Return a map with age and name as keys and values
      if (ageMatch && nameMatch) {
        return [age: ageMatch[0][1], name: nameMatch[0][1]]
      }
    }
  }
  // Return null if no match is found
  return null
}

// Test the functions with an example list
def list = ["Prediction: [age: 1 | name: alex | id: 2]", "Prediction: [age: 3 | name: alen | id:1]", "Prediction: [age: 7 | name: arrow | id: 6]"]
println(sortOnId(list)) // Prints ["Prediction: [age: 3 | name: alen | id:1]", "Prediction: [age: 1 | name: alex | id: 2]", "Prediction: [age: 7 | name: arrow | id: 6]"]
println(getAgeAndName(list, 2)) // Prints [age:1, name:alex]
println(getAgeAndName(list, 4)) // Prints null
```
