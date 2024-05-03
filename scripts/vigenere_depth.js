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
  var result = splitStringIntoSubstrings(plainText, keywordLength);
  firstRow = [];

  for (let i = 0; i < keywordLength; i++) {
    firstRow.push("Column " + (i + 1));
  }
  arraySplit.push(firstRow);
  for (let i = 0; i < result.length; i++) {
    arraySplit.push(result[i].split(""));
  }
  printArray(arraySplit);
  generateTableFromMatrix(arraySplit);
}

// Function to print the array
function printArray(array2D) {
  for (let i = 0; i < array2D[0].length; i++) {
      const columnString = getColumnString(array2D, i);
      const currentId = array2D[0][i].replace(/\s+/g, "_");
      createDivAndPrintChart(columnString, currentId);
  }
}

// Function to get the string of elements in a specific column
function getColumnString(array2D, columnIndex) {
  let columnString = "";
  for (let j = 1; j < array2D.length; j++) {
      if (array2D[j][columnIndex] !== undefined) {
          columnString += array2D[j][columnIndex];
      }
  }
  return columnString;
}

// Function to create a div and print the chart
function createDivAndPrintChart(string, id) {
  const newDiv = document.createElement("div");
  newDiv.setAttribute("id", id);
  document.getElementById("container_graph").appendChild(newDiv);

  const frequencies = calculateLetterFrequencies(string);

  const h4Element = document.createElement("h3");
  h4Element.style.color = "blue";
  h4Element.style.fontFamily = "Arial, sans-serif";
  h4Element.style.textAlign = "center"
  h4Element.textContent = id;
  newDiv.appendChild(h4Element);

  chart(frequencies, "#" + id);
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
    .attr("height", "80%") // Make SVG container full height
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
