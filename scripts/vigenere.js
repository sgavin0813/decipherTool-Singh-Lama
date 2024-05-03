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

// Function to clean and convert a string to uppercase
function cleanAndUpperCase(cleanedStr) {
  // Remove non-alphabetic characters and spaces using regular expression
  cleanedStr = cleanedStr.replace(/[^a-zA-Z]/g, "");
  return cleanedStr.toUpperCase();
}

// Function to add spaces to a string for better readability
function addSpaces(string, every = 5) {
  var result = "";
  for (var i = 0; i < string.length; i += every) {
    result += string.slice(i, i + every) + " ";
  }
  return result.trim();
}

// Function to adjust the keyword to match the length of the input text
function trimKey(keyword, inputText) {
  if (inputText.length > keyword.length) {
    const trimmedKey =
      keyword.repeat(Math.floor(inputText.length / keyword.length)) +
      keyword.slice(0, inputText.length % keyword.length);
    return trimmedKey;
  } else {
    return keyword;
  }
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

// FUNCTION to calulcate frequencies
function calculateLetterFrequencies(text) {
  // Initialize frequencies with all letters and default frequency 0
  const frequencies = {};
  for (let charCode = 65; charCode <= 90; charCode++) {
    const char = String.fromCharCode(charCode);
    frequencies[char] = 0;
  }

  // Convert text to uppercase to ignore case sensitivity
  text = text.toUpperCase();

  // Iterate over each character in the string
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    // Check if the character is a letter
    if (/^[A-Z]$/.test(char)) {
      // Increment the frequency count for the letter
      frequencies[char]++;
    }
  }
  return frequencies;
}

// Function to encrypt the input text using a keyword
function encrypt() {
  var cipherDiv = document.getElementById("cipherDiv");
  if (cipherDiv.style.display === "none") {
    cipherDiv.style.display = "block";
  } else {
    cipherDiv.style.display = "none";
  }
  // Retrieve and preprocess input values
  var keyword = cleanAndUpperCase(document.getElementById("keyword").value);
  const inputText = cleanAndUpperCase(
    document.getElementById("plain-text").value
  );
  // Show error message if keyword is empty
  var errorMessage = document.querySelector("#keyword-error-message");
  if (keyword.trim() === "") {
    errorMessage.innerText = "Please enter a keyword.";
    return;
  } else {
    errorMessage.innerText = ""; // Clear error message if keyword is not empty
  }

  // in case keyword is
  keyword = trimKey(keyword, inputText);

  // Core decryption LOGIC
  encryptedText = addElements(keyword, inputText);

  // Output the decrypted text with spaces
  document.getElementById("cipher-text").value = addSpaces(encryptedText);
}

// Function to Decrypt the CIPHER text using a keyword
function decrypt() {

  var plainDiv = document.getElementById("plainDiv");
  if (plainDiv.style.display === "none") {
    plainDiv.style.display = "block";
  } else {
    plainDiv.style.display = "none";
  }

  // Retrieve and preprocess input values
  var keyword = cleanAndUpperCase(document.getElementById("keyword").value);
  var cipherText = cleanAndUpperCase(
    document.getElementById("cipher-text").value
  );

  // Show error message if keyword is empty
  var errorMessage = document.querySelector("#keyword-error-message");

  if (keyword.trim() === "") {
    errorMessage.innerText = "Please enter a keyword.";
    return;
  } else {
    errorMessage.innerText = ""; // Clear error message if keyword is not empty
  }
  keyword = trimKey(keyword, cipherText);

  // Core decryption logic
  var plainText = subtractElements(keyword, cipherText);
  // Output the encrypted text with spaces
  document.getElementById("plain-text").value = addSpaces(plainText);
}

function subtractElements(keyword, inputText) {
  let result = "";
  for (let i = 0; i < inputText.length; i++) {
    const char1 = keyword[i % keyword.length];
    const char2 = inputText[i];
    const index = (alphabetMap[char2] - alphabetMap[char1] + 26) % 26;
    result += findKeyByValue(index);
  }
  return result;
}

function getLetterFrequencies(input, numAlphabets) {
  var frequencies = new Array(numAlphabets);
  for (var alphabetIndex = 0; alphabetIndex < numAlphabets; alphabetIndex++) {
    frequencies[alphabetIndex] = new Array(26).fill(0); // Initialize frequency arrays with zeros
  }
  for (var charIndex = 0; charIndex < input.length; charIndex++) {
    var char = input.charAt(charIndex).toUpperCase();
    var alphabetIndex = charIndex % numAlphabets; // Get the index of the alphabet array
    if (/[A-Z]/.test(char)) {
      frequencies[alphabetIndex][char.charCodeAt(0) - "A".charCodeAt(0)]++;
    }
  }
  return frequencies;
}

function calculateIndexOfCoincidence(input) {
  var iocDiv = document.getElementById("iocDiv");
  if (iocDiv.style.display === "none") {
    iocDiv.style.display = "block";
  } else {
    iocDiv.style.display = "none";
  }
  var frequencies = getLetterFrequencies(input, 1);
  var totalLetters = input.length;
  var numerator = 0;
  for (var i = 0; i < 26; i++) {
    numerator += frequencies[0][i] * (frequencies[0][i] - 1);
  }
  var denominator = totalLetters * (totalLetters - 1);
  return numerator / denominator;
}

function iocCalculatorCipher() {
  let cipherText = cleanAndUpperCase(
    document.getElementById("cipher-text").value
  );
  if (cipherText.trim() != "") {
    document.getElementById("ioc-text").value =
      calculateIndexOfCoincidence(cipherText);
  } else {
    document.getElementById("ioc-text").value = "Eneter Cipher Text";
  }
}

function iocCalculatoPlain() {
  let plainText = cleanAndUpperCase(
    document.getElementById("plain-text").value
  );
  if (plainText.trim() != "") {
    document.getElementById("ioc-text").value =
      calculateIndexOfCoincidence(plainText);
  } else {
    document.getElementById("ioc-text").value = "Eneter Plain Text above";
  }
}

function chart(frequencies, location) {
  const letters = Object.keys(frequencies).sort();
  const values = Object.values(frequencies);
  const maxFrequency = Math.max(...values);

  // Color Palette (more controlled)
  const colorPalette = d3.schemeTableau10; // Or choose a different scheme
  const colors = {};
  for (let i = 0; i < letters.length; i++) {
    colors[letters[i]] = colorPalette[i % colorPalette.length];
  }

  const margin = { top: 30, right: 50, bottom: 50, left: 60 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Remove any existing SVG within the container
  d3.select(location).select("svg").remove();

  const svg = d3
    .select(location)
    .append("svg")
    .attr("id", location)
    .attr("width", "90%") // Make SVG container full width
    .attr("height", "100%") // Make SVG container full height
    .attr("viewBox", `0 0 ${600} ${400}`) // Preserve aspect ratio
    .attr("preserveAspectRatio", "xMidYMid meet") // Center the chart
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand().domain(letters).range([0, width]).padding(0.1);

  const yTickCount = 5; // Number of desired ticks on the y-axis
  const maxFrequencyCeiled = Math.ceil(maxFrequency / yTickCount) * yTickCount;

  const y = d3
    .scaleLinear()
    .domain([0, maxFrequencyCeiled])
    .nice(yTickCount) // Adjust the scale to ensure nice ticks
    .range([height, 0]);

  // Add y-axis grid lines
  svg
    .append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

  // Add x-axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text") // Optional: Rotate x-axis labels if needed
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Add y-axis
  svg.append("g").call(d3.axisLeft(y));

  // Add x-axis label
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top)
    .attr("text-anchor", "middle")
    .text("Letters");

  // Add y-axis label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Frequency");

  // Bars with Data Labels
  svg
    .selectAll(".bar")
    .data(letters)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d))
    .attr("y", (d) => y(frequencies[d]))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(frequencies[d]))
    .attr("fill", (d) => colors[d])
    .append("text") // Add data labels
    .text((d) => frequencies[d])
    .attr("x", (d) => x(d) + x.bandwidth() / 2)
    .attr("y", (d) => y(frequencies[d]) - 5)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "white"); // Contrast for labels

  // Tooltips
  const tooltip = d3
    .select(location)
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  svg
    .selectAll(".bar")
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(`Letter: ${d}<br>Frequency: ${frequencies[d]}`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 20 + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(200).style("opacity", 0);
    });
}

function plainTextFrequency() {
  const inputText = cleanAndUpperCase(
    document.getElementById("plain-text").value
  );

  if (inputText.trim() != "") {
    // Hide the cipher text chart container
    document.getElementById("chart-container-ciphertext").style.display =
      "none";
    document.getElementById(
      "chart-container-ciphertext-outside"
    ).style.display = "none";

    // Show the plain text chart container
    document.getElementById("chart-container-plaintext").style.display =
      "block";
    document.getElementById("chart-container-plaintext-outside").style.display =
      "block";

    const frequencies = calculateLetterFrequencies(inputText);
    chart(frequencies, "#chart-container-plaintext");
  } else {
    console.log("Plain Text is empty, can't calculate Frequency");
  }
}

function cipherTextFrequency() {
  const cipherText = cleanAndUpperCase(
    document.getElementById("cipher-text").value
  );
  if (cipherText.trim() != "") {
    // Hide the plain text chart container
    document.getElementById("chart-container-plaintext").style.display = "none";
    document.getElementById("chart-container-plaintext-outside").style.display =
      "none";

    // Show the cipher text chart container
    document.getElementById("chart-container-ciphertext").style.display =
      "block";
    document.getElementById(
      "chart-container-ciphertext-outside"
    ).style.display = "block";

    const frequencies = calculateLetterFrequencies(cipherText);
    chart(frequencies, "#chart-container-ciphertext");
  } else {
    console.log("Cipher Text is empty, can't calculate Frequency");
  }
}
