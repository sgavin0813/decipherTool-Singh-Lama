// Get references to the elements
const cipherTextElement = document.getElementById("cipher-text");
const keywordLengthElement = document.getElementById("keyword-length");
const decryptButton = document.getElementById("decrypt-btn");
const plainTextElement = document.getElementById("plain-text");
alphabetMap = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13,
  O: 14,
  P: 15,
  Q: 16,
  R: 17,
  S: 18,
  T: 19,
  U: 20,
  V: 21,
  W: 22,
  X: 23,
  Y: 24,
  Z: 25,
};
function splitStringIntoChunks(stringToSplit) {
  var chunks = [];

  // Split the input string into chunks of 15 characters each
  for (var i = 0; i < stringToSplit.length; i += 15) {
    chunks.push(stringToSplit.substring(i, i + 15));
  }

  return chunks;
}

function removeNonAlphaChars(inputString) {
  // Remove non-alphabetic characters using regex
  var cleanedString = inputString.replace(/[^a-zA-Z]/g, "");
  return cleanedString.toUpperCase();
}
function keyGenerator(keyword_spaces, cipherText) {
  original_length = cipherText.length;
  for (let i = 0; i < keyword_spaces; i++) {
    cipherText = "#" + cipherText;
  }
  return cipherText.substring(0, original_length);
}
function subtractElements(key, ciphertext) {
  let result = "";
  for (let i = 0; i < ciphertext.length; i++) {
    char1 = key[i] === "#" || key[i] === "-"? key[i] : key[i].toUpperCase();
    char2 = ciphertext[i].toUpperCase();

    if (char1 === "#") {
      result += "-";
    } else {
      let decryptedValue = (alphabetMap[char2] - alphabetMap[char1] + 26) % 26;
      result += findKeyByValue(decryptedValue);
    }
  }
  return result;
}
function addElements(key, plaintext) {
  let result = "";
  for (let i = 0; i < plaintext.length; i++) {
    let char1 = key[i];
    let char2 = plaintext[i];

    if (char1 === "#") {
      result += "-";
    } else {
      let encryptedValue = (alphabetMap[char2] + alphabetMap[char1]) % 26;
      result += findKeyByValue(encryptedValue);
    }
  }
  return result;
}

function findKeyByValue(value) {
  for (let key in alphabetMap) {
    if (alphabetMap[key] === value) {
      return key;
    }
  }
  return null; // Return null if value not found
}

function addSpace(inputString) {
  var result = "";
  for (var i = 0; i < inputString.length; i += 5) {
    result += inputString.substring(i, i + 5) + " ";
  }
  return result.trim(); // Remove trailing space
}

function decryption() {
  const cipherTextElement = document.getElementById("cipher-text");
  const keywordLengthElement = document.getElementById("keyword-length");

  cipherText = removeNonAlphaChars(cipherTextElement.value);
  keyword_spaces = keywordLengthElement.value;
  keyword = keyGenerator(keyword_spaces, cipherText);
  plainText = subtractElements(keyword, cipherText);
  createTables(cipherText, keyword, plainText);
}
function createTables(inputString1, inputString2, inputString3) {
  // Get input strings for each row
  var inputStrings = [inputString1, inputString2, inputString3];
  var chunkedInputs = [];

  // Split each input string into chunks of 15 characters each
  inputStrings.forEach(function(inputString) {
    var chunks = [];
    for (var i = 0; i < inputString.length; i += 15) {
      chunks.push(inputString.substring(i, i + 15));
    }
    chunkedInputs.push(chunks);
  });

  var tablesHtml = "";

  // Iterate over each chunk and create corresponding rows in the table
  var chunkValue = 0;
  for (var index = 0; index < chunkedInputs[0].length; index++) {
    tablesHtml += "<table>";
    for (var row = 0; row < 3; row++) {
      tablesHtml += "<tr>";
      var rowData = chunkedInputs[row][index];
      tablesHtml +=
        "<td colspan='16'>" +
        (row === 0
          ? "<b>Cipher Text</b>"
          : row === 1
          ? "<b>Presumed Key</b>"
          : "<b>Plain Text</b>") +
        "</td>";
      for (var i = 0; i < rowData.length; i++) {
        // Generate unique ID based on row and column
        var uniqueId = row + "," + i + "," + chunkValue;
        // Check if it's the first row, if so, add the readonly attribute
        var readonlyAttribute = row === 0 ? "readonly" : "";
        // Convert "#" or "-" to blank space
        var cellValue = rowData[i] === "#" || rowData[i] === "-" ? " " : rowData[i];
        tablesHtml +=
          "<td><input type='text' id='" +
          uniqueId +
          "' value='" +
          cellValue +
          "' onchange='cellInputChanged(this)' " +
          readonlyAttribute +
          "></td>";
      }

      tablesHtml += "</tr>";
    }
    tablesHtml += "</table><br>";
    chunkValue++;
  }

  document.getElementById("tableContainer").innerHTML = tablesHtml;
}


function cellInputChanged(input) {
  // Get the unique ID of the input element
  var uniqueId_of_cell = input.id;
  console.log("uniqueId_of_cell "+ uniqueId_of_cell)
  var unique_id_array = uniqueId_of_cell.split(",");
  
  // key changed 
  if (unique_id_array[0] == 1) {
    console.log("Key changed")
    //cipher
    uniqueId_0 = "0," + unique_id_array[1] + "," + unique_id_array[2];

    //Plain Text
    uniqueId_2 = "2," + unique_id_array[1] + "," + unique_id_array[2];

    key = document.getElementById(uniqueId_of_cell).value.trim();
    cipher = document.getElementById(uniqueId_0).value;

    console.log("cipher" + cipher);
    console.log("key" + key);

    new_plain = subtractElements(key, cipher).trim();
    document.getElementById(uniqueId_2).value = new_plain;


  }
  // "plain changed"
  else if (unique_id_array[0] == 2) {
    // "keyword"
    uniqueId_2 = "1," + unique_id_array[1] + "," + unique_id_array[2];
    // "Cipher"
    uniqueId_3 = "0," + unique_id_array[1] + "," + unique_id_array[2];

    plain = document.getElementById(uniqueId_of_cell).value.trim();
    key = document.getElementById(uniqueId_2).value.trim();
    cipher = document.getElementById(uniqueId_3).value.trim();

    console.log("In Update Function");
    console.log("cipher" + cipher);
    console.log("plain" + plain);

    new_key = subtractElements(plain, cipher);
    document.getElementById(uniqueId_2).value = new_key;
  }
}
