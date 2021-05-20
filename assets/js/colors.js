// NOTE: REMOVE CLASS STATEMENTS FROM CIRCLES.
// USE D3 to ADD A DROPDOWN TO THE SVG





function init() {



    d3.csv("assets/data/data.csv").then(function (censusData, err) {
        // Grab the parameter drop down
        var dropdownMenu = d3.select("#selParam");
        //populate the options with only keys that have numerical values
        Object.keys(censusData[0]).forEach(function (key) {
            if (Boolean(parseFloat(censusData[0][key]))) {
                var option = dropdownMenu.append("option");
                var val = option.append("value");
                val.text(key);
            }
        });
        // Grab the color drop down
        var colorMenu = d3.select("#selColor");
        // create a list of color options and populate it
         ["Black",
            "Red",
            "Maroon",
            "Yellow",
            "Olive",
            "Lime",
            "Green",
            "Aqua",
            "Teal",
            "Blue",
            "Navy",
            "Fuchsia",
            "Purple"
            ].forEach(d=>colorMenu.append("option").append("value").text(d))
        var  UserColor = colorMenu.node().value
        // select the value from the dropdown, and have it determine the color by default.
        var UserSel = dropdownMenu.node().value
        censusData.map(d => d[UserSel])
        // color list https://www.d3-graph-gallery.com/graph/custom_color.html
        var max = d3.max(censusData.map(d => parseFloat(d[UserSel])))
        var myColor = d3.scaleLinear()
            .domain([0, max])
            .range(["Gainsboro", UserColor])

        // parse data


        var circleColor = d3.select("#scatter").selectAll("circle")
            // .data(censusData)
            // .enter()
            .attr("fill", d => myColor(parseFloat(d[UserSel])))

    }).catch(function (error) {
        console.log(error)
    })
}

init()

function paramChanged(param) { }

function paramChanged(color) { }