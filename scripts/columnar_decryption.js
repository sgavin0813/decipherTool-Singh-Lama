function cleanString(inputString) {
  // Removes spaces, non-alphabetic characters, and converts to uppercase
  return inputString.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

function calculateDimensions(cipherText, keyword) {
  // Calculates the number of rows and columns based on the keyword
  var numColumns = keyword.length;
  var numRows = Math.ceil(cipherText.length / numColumns);
  return [numRows, numColumns];
}

function trimKeyword(keyword, plaintextLength) {
  if (keyword.length > plaintextLength) {
    return keyword.slice(0, plaintextLength);
  }
  return keyword;
}

function getSortedKeywordIndex(keyword) {
  // Returns the indices of keyword elements in sorted order
  return Array.from(keyword)
    .map((_, index) => index)
    .sort((a, b) => keyword.charCodeAt(a) - keyword.charCodeAt(b));
}
function sort_arrays_combined(arr1, arr2) {
  // Combine elements into pairs
  const combined = arr1.map((value, index) => [value, arr2[index]]);

  // Sort the pairs based on the elements of array 1
  combined.sort((a, b) => a[0].localeCompare(b[0]));

  // Separate the sorted pairs back into two separate arrays
  const sorted_arr1 = combined.map((pair) => pair[0]);
  const sorted_arr2 = combined.map((pair) => pair[1]);

  return [sorted_arr1, sorted_arr2]; // Return as an array
}

function getColumnsWithLessElements(
  keywordCleaned,
  cipherTextCleaned,
  numColumns,
  numRows
) {
  var desiredLen = numColumns * numRows;
  if (desiredLen > cipherTextCleaned.length) {
    var columnsWithLessElementsSize = desiredLen - cipherTextCleaned.length;
    keywordArray = keywordCleaned.split("");

    idArray = [];
    for (let i = 0; i < keywordArray.length; i++) {
      idArray.push(i);
    }
    var columnsWithLessElements = idArray.slice(
      -columnsWithLessElementsSize
    );
    [keywordArraySorted,idArraySorted] = sort_arrays_combined(keywordArray,idArray)
    const less_elements_indexed = [];
    for(let i = 0 ; i < columnsWithLessElements.length ; i++){
      less_elements_indexed.push(idArraySorted.indexOf(columnsWithLessElements[i]));
    }
    return less_elements_indexed;
  } else {
    return [];
  }
}

function createMatrix(rows, columns, columnsIndexLessElements) {
  var matrix = [];
  for (var i = 0; i < rows; i++) {
    var row;
    if (i === rows - 1) {
      row = Array.from({ length: columns }, (_, j) =>
        columnsIndexLessElements.includes(j) ? -1 : 0
      );
    } else {
      row = Array.from({ length: columns }, () => 0);
    }
    matrix.push(row);
  }
  return matrix;
}

function fillMatrixColumnWise(matrix, string, rows, columns) {
  var matrixSize = rows * columns;

  if (matrixSize > string.length) {
    string += "-".repeat(matrixSize - string.length);
  } else if (matrixSize < string.length) {
    return null;
  }

  var stringIndex = 0;

  for (var col = 0; col < columns; col++) {
    for (var row = 0; row < rows; row++) {
      if (matrix[row][col] !== -1) {
        matrix[row][col] = string[stringIndex];
        stringIndex++;
      }
    }
  }

  return matrix;
}
function rearrangeColumns(array2D, order) {
  array2D.unshift(order);

  var sortedIndices = array2D[0]
    .slice(0)
    .sort((a, b) => array2D[0][a] - array2D[0][b]);

  var sortedMatrix = array2D
    .slice(1)
    .map((row) => sortedIndices.map((index) => row[index]));

  return sortedMatrix;
}

function flattenOutput(array2D) {
  var flattenedArray = [];

  // Step 1: Flatten the 2D array, ignoring elements equal to -1
  array2D.forEach((row) => {
    row.forEach((element) => {
      if (element !== -1) {
        flattenedArray.push(element);
      }
    });
  });

  // Step 2: Convert the flattened array to a string
  var arrayToString = flattenedArray.join("");

  // Step 3: Format the output string with spaces every 5 characters
  var formattedOutput = "";
  for (var i = 0; i < arrayToString.length; i += 5) {
    formattedOutput += arrayToString.slice(i, i + 5) + " ";
  }

  return formattedOutput.trim();
}

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
      // If cellData is "-1", set the text content to an empty string
      cell.textContent = cellData === -1 ? "" : cellData;
      row.appendChild(cell);
    });

    table.appendChild(row);
  });

  tableContainer.appendChild(table);
}

function decrypt() {
  // Get the keyword and cipher text from the input fields
  var keyword = document.getElementById("keyword").value.trim();
  var cipherText = document.getElementById("cipher-text").value.trim();
  var plainText = document.getElementById("plain-text");

  keyword = cleanString(keyword);
  cipherText = cleanString(cipherText);

  // Trim the keyword if it's longer than the plaintext
  keyword = trimKeyword(keyword, cipherText.length);

  let [numRows, numColumns] = calculateDimensions(cipherText, keyword);

  var sortedKeywordIndex = getSortedKeywordIndex(keyword);
  var columnsIndexLessElements = getColumnsWithLessElements(
    keyword,
    cipherText,
    numColumns,
    numRows
  );


  var matrix = createMatrix(numRows, numColumns, columnsIndexLessElements);

  var matrixFilled = fillMatrixColumnWise(
    matrix,
    cipherText,
    numRows,
    numColumns
  );

  var matrixRearranged = rearrangeColumns(matrixFilled, sortedKeywordIndex);

  createTable(matrixRearranged, keyword.split(""));
  console.log(matrixRearranged)
  var flatenedArray = flattenOutput(matrixRearranged);
  plainText.value = flatenedArray;
}
