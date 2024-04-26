function runShifter_Clicked() {
    var input = getInput();
    if (input != "") {
        var shifterData = {};
        var vals = shiftedValueArray(input);
        var output = "";
        for (var i = 1; i < vals.length; i++) {
            output += "Shift " + i + ": " + vals[i] + "\n";
            shifterData["Shift " + i] = vals[i];
        }
        graphShifterData(Object.keys(shifterData).slice(0,50),Object.values(shifterData).slice(0,50) ,shifterplot_1);
        graphShifterData(Object.keys(shifterData).slice(51,100),Object.values(shifterData).slice(51,100) ,shifterplot_2 );
    }
}

function graphShifterData(labels,data ,location) {
    // Create data trace
    var trace = {
        x: labels, // Use data for x-axis
        y: data, // Use labels for y-axis
        type: "bar",
        marker: {
            color: "rgba(54, 162, 235, 0.6)",
            line: {
                color: "rgba(54, 162, 235, 1)",
                width: 1.0,
            },
        },
    };

    // Layout options
    var layout = {
        title: "Vegineer Shifter",
        xaxis: {
            title: "Shifts",
        },
        yaxis: {
            title: "Number of coincidence",
        },
    };

    // Plot the graph inside the placeholder div
    Plotly.newPlot(location, [trace]);
}

function shiftedValueArray(inputString) {
    const inputLength = inputString.length;
    const shifterMatches = new Array(inputLength).fill(0);

    for (let shiftLength = 1; shiftLength < inputLength; shiftLength++) {
        let matchCount = 0;
        const comparisonString =
            inputString.slice(inputLength - shiftLength) +
            inputString.slice(0, inputLength - shiftLength);
        
        for (let index = 0; index < inputLength; index++) {
            if (inputString[index] === comparisonString[index]) {
                matchCount++;
            }
        }
        shifterMatches[shiftLength] = matchCount;
    }
    return shifterMatches;
}


function charChunks(input, numStrips) {
    var strips = new Array(numStrips).fill("");
    var stripIndex = 0;

    for (var i = 0; i < input.length; i++) {
        var character = input.charAt(i).toUpperCase();
        if (/^[a-zA-Z]$/.test(character)) {
            strips[stripIndex] += character;
            stripIndex = (stripIndex + 1) % numStrips;
        }
    }

    return strips;
}


function getInput() {
    return document.getElementById("inputText").value.replace(/[^a-zA-Z]/g, "");
}
