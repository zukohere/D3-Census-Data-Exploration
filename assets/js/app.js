function init() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // svg params
  var col = document.querySelector('#svgCol') // https://stackoverflow.com/questions/38005739/bootstrap-get-width-of-div-column-in-pixels
    .getBoundingClientRect()


  var svgWidth = col.right - col.left;
  var svgHeight = 0.75 * svgWidth;


  var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height",svgHeight);

  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // // Initial Params
  chosenXAxis="poverty";
  chosenYAxis="obesity";
  
  // function used for updating x-scale var upon click on axis label
  function xScale(censusData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain(d3.extent(censusData, d => d[chosenXAxis]))
      .range([0, width]);

    return xLinearScale;

  }
  function yScale(censusData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain(d3.extent(censusData, d => d[chosenYAxis]))
      .range([height, 0]);

    return yLinearScale;

  }
  // function used for updating xAxis var upon click on axis label
  function renderXaxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

    return xAxis;
  }
  // function used for updating yAxis var upon click on axis label
  function renderYaxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
      .duration(1000)
      .call(leftAxis);

    return yAxis;
  }
  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
  }
  // function used for updating circles group with a transition to
  // new circle text
  function renderCircletext(circleText, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circleText.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));

    return circleText;
  }

  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var labelX;

    if (chosenXAxis === "poverty") {
      labelX = "Poverty (%): ";
    }
    else if (chosenXAxis === "age") {
      labelX = "Age (Median): ";
    }
    else {
      labelX = "Income: ";
    }

    var labelY;

    if (chosenYAxis === "obesity") {
      labelY = "Obese (%): ";
    }
    else if (chosenYAxis === "smokes") {
      labelY = "Smokes (%): ";
    }
    else {
      labelY = "Lacks Healthcare: ";
    }

    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function (d) {
        return (`${d.state}<br>${labelX} ${d[chosenXAxis]}<br>${labelY} ${d[chosenYAxis]}`);
      });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function (data, index) {
        toolTip.hide(data);
      });

    return circlesGroup;
  }

  // Retrieve data from the CSV file and execute everything below
  d3.csv("assets/data/data.csv").then(function (censusData, err) {
    if (err) throw err;

    // parse data
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

    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);

    // Create y scale function
    var yLinearScale = yScale(censusData, chosenYAxis)

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
      .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("stroke", "white")
    // .attr("r", 20)
    // .classed("stateCircle", true)


    var circleText = chartGroup.selectAll(null)
      .data(censusData)
      .enter()
      .append("text")
      .text(d => d.abbr)
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .classed("stateText", true)


    // Create group for three x-axis labels
    var labelsXGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`)
      .attr("id", "labelsX");

    var povertyLabel = labelsXGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");

    var ageLabel = labelsXGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");
    var incomeLabel = labelsXGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");

    // Create group for the three y axis labels
    var labelsYGroup = chartGroup.append("g")
      .attr("id", "labelsY");
    var obeseLabel = labelsYGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 50)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("value", "obesity") // value to grab for event listener
      .attr("transform", "rotate(-90)")
      .classed("active", true)
      .text("Obese (%)");
    var smokesLabel = labelsYGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 25)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes (%)");
    var healthcareLabel = labelsYGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "healthcare") // value to grab for event listener
      .classed("inactive", true)
      .text("Lacks Healthcare (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    labelsXGroup.selectAll("text")
      .on("click", function () {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = value;

          // console.log(chosenXAxis)

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(censusData, chosenXAxis);

          // updates axes with transition
          xAxis = renderXaxes(xLinearScale, xAxis);
          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
          circleText = renderCircletext(circleText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          // changes X label classes to change bold text
          if (chosenXAxis === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false)
            ageLabel
              .classed("active", false)
              .classed("inactive", true)
            incomeLabel
              .classed("active", false)
              .classed("inactive", true)

          }
          else if (chosenXAxis === "age") {
            ageLabel
              .classed("active", true)
              .classed("inactive", false)
            incomeLabel
              .classed("active", false)
              .classed("inactive", true)
            povertyLabel
              .classed("active", false)
              .classed("inactive", true)
          }
          else {
            incomeLabel
              .classed("active", true)
              .classed("inactive", false)
            povertyLabel
              .classed("active", false)
              .classed("inactive", true)
            ageLabel
              .classed("active", false)
              .classed("inactive", true)
          }
        }
      })

    // y axis labels event listener
    labelsYGroup.selectAll("text")
      .on("click", function () {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

          // replaces chosenXAxis with value
          chosenYAxis = value;

          console.log(this)

          // functions here found above csv import
          // updates x scale for new data
          yLinearScale = yScale(censusData, chosenYAxis);

          // updates axes with transition
          yAxis = renderYaxes(yLinearScale, yAxis);
          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
          circleText = renderCircletext(circleText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          // changes Y label classes to change bold text
          if (chosenYAxis === "obesity") {
            obeseLabel
              .classed("active", true)
              .classed("inactive", false);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);

          }
          else if (chosenYAxis === "smokes") {
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            obeseLabel
              .classed("active", false)
              .classed("inactive", true)
          }
          else {
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            obeseLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true)
          }
        }
      });

    ////////// Initializes page with (and introduces dropdowns to control) circle 
    ////////// color by, color scale, and size by
    // set sizes for circles to vary between
    var sizeRange = [5, 20]
    // Grab the parameter drop downs for color scale and size
    var dropdownMenu = d3.select("#selParam");
    var sizeMenu = d3.select("#selSize")


    //populate the options with only keys that have numerical values
    Object.keys(censusData[0]).forEach(function (key) {
      if (Boolean(parseFloat(censusData[0][key]))) {
        if (key != "id") {
          // color scale
          var option = dropdownMenu.append("option");
          var val = option.append("value");
          val.text(key);
          // size scale
          var option = sizeMenu.append("option");
          var val = option.append("value");
          val.text(key);
        }
      }
    });
    // Grab the color drop down
    var colorMenu = d3.select("#selColor");
    // create a list of color options and populate it
    ["Blue",
      "Red",
      "Maroon",
      "Yellow",
      "Olive",
      "Lime",
      "Green",
      "Aqua",
      "Teal",
      "Navy",
      "Fuchsia",
      "Purple",
      // "lightgray",
      "Black",
    ].forEach(d => colorMenu.append("option").append("value").text(d))
    // select the value from the dropdown, and have it determine the color by default.
    var UserColor = colorMenu.node().value
    var UserSel = dropdownMenu.node().value
    var UserSize = sizeMenu.node().value

    // color scaling https://www.d3-graph-gallery.com/graph/custom_color.html
    var myColor = d3.scaleLinear()
      .domain(d3.extent(censusData.map(d => parseFloat(d[UserSel]))))
      .range(["Gainsboro", UserColor])

    //size scaling
    var mySize = d3.scaleLinear()
      .domain(d3.extent(censusData.map(d => parseFloat(d[UserSize]))))
      .range(sizeRange)

    // color the circle with default dropdown option,
    // with intensity proportional to data value.
    d3.select("#scatter").selectAll("circle")
      .transition()
      .duration(1000)
      .attr("fill", d => myColor(parseFloat(d[UserSel])))
      .attr("r", d => mySize(parseFloat(d[UserSize])))

    d3.selectAll(".stateText")
      .transition()
      .duration(1000)
      .attr("font-size", d => mySize(parseFloat(d[UserSize])) * 14 / 20)
    // removed size from css entry for stateText (14) and original size
    // of circles was 20. Preserving ratio.

    // Event listener for window resize.
  }).catch(function (error) {
    console.log(error);
  });
}

init()

// create the change event
function optionChanged(param) {
  // get value from both dropdowns
  UserSel = d3.select("#selParam").node().value
  UserColor = d3.select("#selColor").node().value
  UserSize = d3.select("#selSize").node().value
  var sizeRange = [5, 20]
  //get data for the param for the scale, and the apply the color
  d3.csv("assets/data/data.csv").then(function (censusData, err) {

    var myColor = d3.scaleLinear()
      .domain(d3.extent(censusData.map(d => parseFloat(d[UserSel]))))
      .range(["Gainsboro", UserColor])

    var mySize = d3.scaleLinear()
      .domain(d3.extent(censusData.map(d => parseFloat(d[UserSize]))))
      .range(sizeRange)

    // color the circle with default dropdown option,
    // with intensity proportional to data value.
    d3.select("#scatter").selectAll("circle")
      .transition()
      .duration(1000)
      .attr("fill", d => myColor(parseFloat(d[UserSel])))
      .attr("r", d => mySize(parseFloat(d[UserSize])))

    d3.selectAll(".stateText")
      .transition()
      .duration(1000)
      .attr("font-size", d => mySize(parseFloat(d[UserSize])) * 14 / 20)

  }).catch(function (error) {
    console.log(error)
  })
}
