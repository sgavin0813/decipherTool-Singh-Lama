const cipherTextElement = document.getElementById("cipher-text");
const cribElement = document.getElementById("crib");
const decryptButton = document.getElementById("decrypt-btn");

var cipherText;
var cribText;

function removeNonAlphaChars(inputString) {
  // Remove non-alphabetic characters using regex
  var cleanedString = inputString.replace(
    /(^_+)|[^a-zA-Z]/g,
    (match, group1) => group1 || ""
  );
  return cleanedString.toUpperCase();
}
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
function subtractElements(key, ciphertext) {
    console.log("In substract Function")
  let result = "";
  for (let i = 0; i < key.length; i++) {
    let char1 = key[i];
    let char2 = ciphertext[i];
  
    if (char1 === "#" || char1 === "#") {
      result += "_";
    } else {
      let decryptedValue = (alphabetMap[char2] - alphabetMap[char1] + 26) % 26;
      result += findKeyByValue(decryptedValue);
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
  return "_"; // Return null if value not found
}

function createTables(inputString1, inputString2, inputString3) {
  // Get input strings for each row
  var inputStrings = [inputString1, inputString2, inputString3];
  var chunkedInputs = [];

  // Split each input string into chunks of 15 characters each
  inputStrings.forEach(function (inputString) {
    var chunks = [];
    for (var i = 0; i < inputString.length; i += 15) {
      chunks.push(inputString.substring(i, i + 15));
    }
    chunkedInputs.push(chunks);
  });

  var tablesHtml = "";

  // Counter for generating unique IDs

  // Iterate over each chunk and create corresponding rows in the table
  chunk_value = 0;
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
          ? "<b>Crib</b>"
          : "<b>Plain Text</b>") +
        "</td>";
      for (var i = 0; i < rowData.length; i++) {
        // Generate unique ID based on row and column
        var uniqueId = row + "," + i + "," + chunk_value;
        // Check if it's the first row, if so, add the readonly attribute
        var readonlyAttribute = row === 0 ? "readonly" : "";
        tablesHtml +=
          "<td><input type='text' id='" +
          uniqueId +
          "' value='" +
          rowData[i] +
          "' onchange='cellInputChanged(this)' " +
          readonlyAttribute +
          "></td>";
      }

      tablesHtml += "</tr>";
    }
    tablesHtml += "</table><br>";
    chunk_value++;
  }

  document.getElementById("tableContainer").innerHTML = tablesHtml;
}

function cellInputChanged(input) {
  // Get the unique ID of the input element
  var uniqueId_1 = input.id;
  uniqueId_2 = "";
  uniqueId_3 = "";
  var parts = uniqueId_1.split(",");

  // "keyword changed"
  if (parts[0] == 1) {
    //cipher
    uniqueId_2 = "0," + parts[1] + "," + parts[2];
    //plain text
    uniqueId_3 = "2," + parts[1] + "," + parts[2];

    key = document.getElementById(uniqueId_1).value.substring(0, 1).trim();
    cipher = document.getElementById(uniqueId_2).value;
    plain = document.getElementById(uniqueId_3).value.substring(0, 1).trim();
    new_plain = subtractElements(key, cipher).substring(0, 1);
    document.getElementById(uniqueId_1).value = key;
    document.getElementById(uniqueId_3).value = new_plain;
  }
  // "plain changed"
  else if (parts[0] == 2) {
    // "keyword"
    uniqueId_2 = "1," + parts[1] + "," + parts[2];
    // "Cipher"
    uniqueId_3 = "0," + parts[1] + "," + parts[2];

    plain = document.getElementById(uniqueId_1).value.substring(0, 1).trim();
    key = document.getElementById(uniqueId_2).value.substring(0, 1).trim();
    cipher = document.getElementById(uniqueId_3).value;

    new_key = subtractElements(plain, cipher);
    document.getElementById(uniqueId_2).value = new_key;
    document.getElementById(uniqueId_1).value = plain;
  }
  document.getElementById(uniqueId_1).value;
  document.getElementById(uniqueId_2).value;
  document.getElementById(uniqueId_3).value;
}

var firstTime = true;
function decryption(buttonPressed) {
  cipherText = removeNonAlphaChars(cipherTextElement.value);

  if (buttonPressed == "shiftRight") {
    if (!firstTime) {
      cribText = "_" + cribText;
    } else {
      firstTime = false;
      cribText = removeNonAlphaChars(cribElement.value);
    }
    console.log("cribText" + cribText)
    console.log("cipherText" + cipherText)
    // Calculate plainText without placeholders
    plainText = subtractElements(cribText, cipherText);

    // Update cribText and plainText to ensure consistent lengths
    const maxLength = Math.max(cipherText.length, cribText.length, plainText.length);
    cribText = cribText.padEnd(maxLength, "_");
    plainText = plainText.padEnd(maxLength, "_"); // Or use another default character as needed

    createTables(cipherText, cribText, plainText);

  } else if (buttonPressed == "shiftLeft") {
    cribText = cribText.substring(1);
    // Calculate plainText without placeholders
    plainText = subtractElements(cribText, cipherText);
    // Ensure consistent lengths 
    const maxLength = Math.max(cipherText.length, cribText.length, plainText.length);
    cribText = cribText.padEnd(maxLength, "_");
    plainText = plainText.padEnd(maxLength, "_"); // Or use another default character as needed

    createTables(cipherText, cribText, plainText);
  }
}

function reloadPage() {
  // Reload the page
  location.reload();
}