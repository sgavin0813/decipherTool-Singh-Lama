// Input validation and sanitization functions
function validateInputs(input, keyword) {
  if (typeof input !== "string" || typeof keyword !== "string") {
    console.error("Input and keyword must be strings.");
    return;
  }

  input = input.replace(/[^a-zA-Z]/g, "").toUpperCase();
  keyword = keyword.replace(/[^a-zA-Z]/g, "").toUpperCase();

  if (input.trim() === "") {
    console.error("Input text is empty!");
    return;
  }

  if (keyword.trim() === "") {
    console.error("Keyword is empty!");
    return;
  }

  // Trim keyword if it's longer than input
  if (keyword.length > input.length) {
    keyword = keyword.slice(0, input.length);
  }

  return [input.trim(), keyword.trim()];
}

// Functions related to grid manipulation
function createGrid(string, keyword) {
  var numColumns = keyword.length;
  var numRows = Math.ceil(string.length / numColumns);
  var grid = new Array(numRows);

  for (var i = 0; i < numRows; i++) {
    grid[i] = new Array(numColumns).fill("");
  }

  var index = 0;
  for (var row = 0; row < numRows; row++) {
    for (var col = 0; col < numColumns; col++) {
      if (index < string.length) {
        grid[row][col] = string.charAt(index);
        index++;
      } else {
        grid[row][col] = "#"; // Padding character
      }
    }
  }

  return grid;
}

function sortKeyword(keyword) {
  var charIndexDict = {};

  for (var index = 0; index < keyword.length; index++) {
    var char = keyword.charAt(index);
    if (!(char in charIndexDict)) {
      charIndexDict[char] = [index];
    } else {
      charIndexDict[char].push(index);
    }
  }

  return charIndexDict;
}

// Helper functions for encryption
function getColumnOrder(keyword, sortedKeyword) {
  var columnOrder = [];
  var usedChars = {};

  for (var i = 0; i < sortedKeyword.length; i++) {
    var char = sortedKeyword.charAt(i);
    if (!(char in usedChars)) {
      for (var j = 0; j < keyword.length; j++) {
        if (keyword.charAt(j) === char) {
          columnOrder.push(j);
        }
      }
      usedChars[char] = true;
    }
  }

  return columnOrder;
}

function transposeGrid(stringGrid, columnOrder) {
  var numRows = stringGrid.length;
  var numColumns = stringGrid[0].length;
  var transposedGrid = new Array(numRows);

  for (var row = 0; row < numRows; row++) {
    transposedGrid[row] = new Array(numColumns).fill("");
    for (var col = 0; col < numColumns; col++) {
      transposedGrid[row][col] = stringGrid[row][columnOrder[col]];
    }
  }

  return transposedGrid;
}

function flattenColumnWise(transposedGrid) {
  const numColumns = transposedGrid[0].length;
  const flattened = [];

  for (let col = 0; col < numColumns; col++) {
    for (let row = 0; row < transposedGrid.length; row++) {
      // Check if the element is not '#'
      if (transposedGrid[row][col] !== "#") {
        // Push the element at the current row and column to the flattened array
        flattened.push(transposedGrid[row][col]);
      }
    }
  }

  return flattened;
}

function addSpaces(array) {
  // Convert the array to a string
  let stringWithoutSpaces = array.join("");

  // Use a regular expression to add a space after every 5 characters
  let stringWithSpaces = stringWithoutSpaces.replace(/(.{5})/g, "$1 ");

  // Return the string with spaces
  return stringWithSpaces;
}

// Function to create and populate the table
function createTable(data, headings) {
    const tableContainer = document.getElementById("table-container");
    
    // Remove previous table if exists
    while (tableContainer.firstChild) {
      tableContainer.removeChild(tableContainer.firstChild);
    }
  
    const table = document.createElement("table");
  
    // Create table header
    const headerRow = document.createElement("tr");
    headings.forEach((heading) => {
      const th = document.createElement("th");
      th.textContent = heading;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
  
    // Iterate over each row of the array
    data.forEach((rowData) => {
      const row = document.createElement("tr");
  
      // Iterate over each element in the row
      rowData.forEach((cellData) => {
        const cell = document.createElement("td");
        cell.textContent = cellData;
        row.appendChild(cell);
      });
  
      table.appendChild(row);
    });
  
    tableContainer.appendChild(table);
  }
      

// Encryption function
function encrypt() {
  var inputRaw = document.getElementById("input-string").value;
  var keywordRaw = document.getElementById("keyword").value;
  var output = document.getElementById("output");
  let [input, keyword] = validateInputs(inputRaw, keywordRaw);
  var stringGrid = createGrid(input, keyword);
  var sortedKeyword = keyword.split("").sort().join("");
  console.log("Sorted Array " + sortedKeyword)
  var columnOrder = getColumnOrder(keyword, sortedKeyword);
  console.log("column Order " + columnOrder)
  var transposedGrid = transposeGrid(stringGrid, columnOrder);

  var flattened_output = addSpaces(flattenColumnWise(transposedGrid));

  output.value = flattened_output;

  createTable(transposedGrid, keyword.split("").sort());
}

