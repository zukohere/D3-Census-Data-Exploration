var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.


d3.csv("assets/data/data.csv").then(function (censusData) {
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function (data) {
        Object.keys(data).forEach(function (key) {
            if (Boolean(parseFloat(data[key]))) {
                data[key] = + data[key]
            }
            else {
                data[key] = data[key]
            }
        })
    });
    var censusKeys = ["poverty", "povertyMoe", "age",
        "ageMoe", "income", "incomeMoe", "healthcare", "healthcareLow",
        "healthcareHigh", "obesity", "obesityLow", "obesityHigh",
        "smokes", "smokesLow", "smokesHigh"]

    censusKeys.forEach(function (key1) {
        censusKeys.forEach(function (key2) {
            if (key1 !== key2) {
                var svg = d3.select("#scatter")
                    .append("svg")
                    .attr("width", svgWidth)
                    .attr("height", svgHeight);

                var chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);
                var xLinearScale = d3.scaleLinear()
                    .domain(d3.extent(censusData, d => d[key1]))
                    .range([0, width]);
                var yLinearScale = d3.scaleLinear()
                    .domain(d3.extent(censusData, d => d[key2]))
                    .range([height, 0]);
                // Step 3: Create axis functions
                // ==============================
                var bottomAxis = d3.axisBottom(xLinearScale);
                var leftAxis = d3.axisLeft(yLinearScale);
                // Step 4: Append Axes to the chart
                // ==============================
                chartGroup.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(bottomAxis);

                chartGroup.append("g")
                    .call(leftAxis);

                // Step 5: Create Circles
                // ==============================
                var circlesGroup = chartGroup.selectAll("circle")
                    .data(censusData)
                    .enter()
                    .append("circle")
                    .attr("cx", d => xLinearScale(d[key1]))
                    .attr("cy", d => yLinearScale(d[key2]))
                    .attr("r", "15")
                    .attr("fill", "pink")
                    .attr("opacity", ".5");
                // Step 6: Initialize tool tip
                // ==============================
                var toolTip = d3.tip()
                    .attr("class", "d3-tip")
                    .offset([80, -60])
                    .html(function (d) {
                        return(Object.entries(d).map(([k,v])=>`${k}: ${v}<br>`))
                    });

                // Step 7: Create tooltip in the chart
                // ==============================
                chartGroup.call(toolTip);
                // Step 8: Create event listeners to display and hide the tooltip
                // ==============================
                circlesGroup.on("mouseover", function (data) {
                    toolTip.show(data, this);
                })
                    // onmouseout event
                    .on("mouseout", function (data, index) {
                        toolTip.hide(data);
                    });

                //x axis
                chartGroup.append("text")
                    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
                    .attr("class", "axisText")
                    .text(key1);

                //y axis
                // Create axes labels
                chartGroup.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left + 40)
                    .attr("x", 0 - (height / 2))
                    .attr("dy", "1em")
                    .attr("class", "axisText")
                    .text(key2);

            }
        })
    })






}).catch(function (error) {
    console.log(error)
});