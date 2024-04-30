var plainText;
var keywordLength;
var table;
function cleanAndUpperCase(cleanedStr) {
  // Remove non-alphabetic characters and spaces using regular expression
  cleanedStr = cleanedStr.replace(/[^a-zA-Z]/g, "");
  return cleanedStr.toUpperCase();
}
function getInputs() {
  plainText = cleanAndUpperCase(document.getElementById("input-text").value);
  keywordLength = parseInt(document.getElementById("keyword-size").value);
  table = document.getElementById("myTable");
}
function splitStringIntoSubstrings(str, chunkSize) {
  var substrings = [];
  for (var i = 0; i < str.length; i += chunkSize) {
    substrings.push(str.substring(i, i + chunkSize));
  }
  return substrings;
}

function generateTableFromMatrix(matrix) {
  // Get reference to the table element
  let table = document.getElementById("myTable");

  // Clear existing table content
  table.innerHTML = "";

  // Iterate through the 2D array and generate table rows and cells
  for (let i = 0; i < matrix.length; i++) {
    // Create a table row
    let row = document.createElement("tr");

    // Iterate through the inner arrays (rows) and create table cells
    for (let j = 0; j < matrix[i].length; j++) {
      // Create a table cell
      let cell = document.createElement("td");

      // Set the cell content to the current element of the 2D array
      cell.textContent = matrix[i][j];

      // Append the cell to the row
      row.appendChild(cell);
    }

    // Append the row to the table
    table.appendChild(row);
  }
}

function calculateDepth() {
  getInputs();
  let arraySplit = [];
  if (isMultipleOfLength(plainText, keywordLength)) {
    var result = splitStringIntoSubstrings(plainText, keywordLength);
    firstRow = [];

    for (let i = 0; i < keywordLength; i++) {
      firstRow.push("Column " + (i + 1));
    }
    console.log(firstRow);
    arraySplit.push(firstRow);
    for (let i = 0; i < result.length; i++) {
      arraySplit.push(result[i].split(""));
    }
    generateTableFromMatrix(arraySplit);
  } else {
    alert("The string does not occur in multiples of the keyword.");
    var result = splitStringIntoSubstrings(plainText, keywordLength);
    firstRow = [];
    for (let i = 0; i < keywordLength; i++) {
      firstRow.push("Column " + (i + 1));
    }
    arraySplit.push(firstRow);
    for (let i = 0; i < result.length; i++) {
      arraySplit.push(result[i].split(""));
    }
    generateTableFromMatrix(arraySplit);
    printArray(arraySplit);
  }
}

function isMultipleOfLength(str, num) {
  return str.length % num === 0;
}

function printArray(array2D) {
  string = ""
    for(let i = 0; i < array2D[0].length; i++){
      for (let j = 0; j < array2D.length; j++) {
        // Print the element at the second index (second column)
        string += array2D[j][i];
    }
    console.log(string);
    }
    string = ""
}
