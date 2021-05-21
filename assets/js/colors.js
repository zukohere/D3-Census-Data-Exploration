// set sizes for circles to vary between
var sizeRange = [5, 20]

function init() {
    d3.csv("assets/data/data.csv").then(function (censusData, err) {
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

    }).catch(function (error) {
        console.log(error)
    })
}

init()
// create the change event
function optionChanged(param) {
    // get value from both dropdowns
    UserSel = d3.select("#selParam").node().value
    UserColor = d3.select("#selColor").node().value
    UserSize = d3.select("#selSize").node().value
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
//prevent page from refreshing on resize after options chosen.
d3.select(window).on("resize", optionChanged)
