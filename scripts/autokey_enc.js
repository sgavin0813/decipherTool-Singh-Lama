var plainText;
var keyword;
var cipherText;
var cipherType;
const alphabetMap = {
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

function cleanAndUpperCase(cleanedStr) {
  // Remove non-alphabetic characters and spaces using regular expression
  cleanedStr = cleanedStr.replace(/[^a-zA-Z]/g, "");
  return cleanedStr.toUpperCase();
}
// Function to add elements using a keyword and input text, along with an alphabet mapping
function addElements(keyword, inputText) {
  let result = "";
  for (let i = 0; i < inputText.length; i++) {
    const char1 = keyword[i % keyword.length];
    const char2 = inputText[i];
    const index = (alphabetMap[char1] + alphabetMap[char2]) % 26;
    result += findKeyByValue(index);
  }
  return result;
}

// Find char based on index
function findKeyByValue(value) {
  for (const key in alphabetMap) {
    if (alphabetMap.hasOwnProperty(key)) {
      if (alphabetMap[key] === value) {
        return key;
      }
    }
  }
  return null; // Return null if value not found
}
function generateKey(keyword, substring) {
  return keyword + substring;
}

function extendedByCipherText(plaintext, key) {
  let ciphertext = "";
  for (let i = 0; i < plaintext.length; i++) {
    ciphertext += addElements(key[i], plaintext[i]);
    key += ciphertext.charAt(ciphertext.length - 1);
  }
  return ciphertext;
}

function encrypt() {
  getInputs();
  if (cipherType === "BYPLAINTEXT") {
    newKey = generateKey(
      keyword,
      plainText.substring(0, plainText.length - keyword.length)
    );
    cipherText = addElements(newKey, plainText);
    document.getElementById("cipher-text").value = cipherText;
    console.log(cipherText);
  }
  if (cipherType === "BYCIPHERTEXT") {
    cipherText = extendedByCipherText(plainText, keyword);
    document.getElementById("cipher-text").value = cipherText;
  }
}

function getInputs() {
  plainText = cleanAndUpperCase(document.getElementById("plain-text").value);
  keyword = cleanAndUpperCase(document.getElementById("keyword").value);
  cipherType = cleanAndUpperCase(
    document.getElementById("select-option").value
  );
}
