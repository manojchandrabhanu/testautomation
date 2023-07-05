

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
