stage('Collect Logs') {
  steps {
    sh '''
      kubectl get pods -l job-name=<your-job-label> -o name | while read pod; do
        echo "===== Logs for $pod ====="
        kubectl logs $pod
      done
    '''
  }
}




Use Cases:

Faster Troubleshooting:
Instantly correlate spikes in CPU/memory/disk with application logs to pinpoint root causes.

Capacity Planning:
Analyze historical trends to forecast resource needs and optimize spending.

Compliance & Reporting:
Maintain a complete audit trail of system performance for regulatory or internal reviews.


Unified Metrics Collection

Integrates data from Splunk, infrastructure (CPU, memory, disk), and other sources for holistic visibility.

Eliminates context switching-view logs, metrics, and traces together in one dashboard.

Historical Data Storage

All metrics are stored in a time-series database for long-term trend analysis, anomaly detection, and capacity planning.

Enables comparison of current and historical performance to identify patterns and prevent incidents.

Real-Time Monitoring & Alerts

Live dashboards with customizable alerts for proactive issue detection.

Drill down from high-level trends to granular root cause-across applications and infrastructure.

Seamless Integration

Out-of-the-box connectors for Splunk and leading infrastructure monitoring tools.

Cloud-agnostic and extensible for hybrid environments.

User-Friendly Interface

Intuitive, visually rich UI with interactive charts and filters for rapid insight.

Customizable views for different teams and stakeholders.





import java.util.Random

def randomizeValue(String value) {
    Random random = new Random()
    
    // Check if the value ends with a number
    def numberMatcher = value =~ /(\d+)$/
    
    if (numberMatcher.find()) {
        // If it ends with a number, modify the numerical part
        def numberPart = numberMatcher.group(1)
        def nonNumberPart = value[0..-numberPart.length()-1] // The part before the number
        
        // Randomly decide to add or remove digits
        if (random.nextBoolean()) {
            // Add a random digit
            def randomDigit = random.nextInt(10)
            numberPart += randomDigit
        } else if (numberPart.length() > 1) {
            // Remove one digit if possible
            numberPart = numberPart[0..-2]
        }
        
        return nonNumberPart + numberPart
    } else {
        // If it ends with characters, modify the character part
        def chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        
        // Randomly decide to add or remove characters
        if (random.nextBoolean()) {
            // Add a random character
            def randomChar = chars[random.nextInt(chars.length())]
            return value + randomChar
        } else if (value.length() > 1) {
            // Remove one character if possible
            return value[0..-2]
        }
    }
    
    return value
}

def processFufFile(String inputFilePath, String outputFilePath) {
    File inputFile = new File(inputFilePath)
    File outputFile = new File(outputFilePath)
    
    outputFile.withWriter { writer ->
        inputFile.eachLine { line ->
            // Match lines that have tags and values in the FUF format
            def matcher = line =~ /^\[(.{15})\]\s+(.*)$/
            
            if (matcher.matches()) {
                def tag = matcher[0][1]  // The tag part (including brackets)
                def value = matcher[0][2]  // The value part
                
                // Randomize the value
                def randomizedValue = randomizeValue(value)
                
                // Write back the tag and randomized value to a new file
                writer.writeLine("[${tag}] ${randomizedValue}")
            } else {
                // If the line doesn't match, write it as is (e.g., blank lines, comments)
                writer.writeLine(line)
            }
        }
    }
}

// Example usage: process an input FUF file and save it to an output file with randomized values.
processFufFile("/path/to/input.fuf", "/path/to/output_randomized.fuf")


















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
