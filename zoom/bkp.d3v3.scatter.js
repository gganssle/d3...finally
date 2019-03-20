var margin = {top: 20, right: 20, bottom: 30, left: 40}

var chartDiv = document.getElementById("chart");
var svg = d3.select(chartDiv).append("svg")

function redraw() {
  d3.select('svg').remove();
  var svg = d3.select(chartDiv).append("svg")

  var width = chartDiv.clientWidth - margin.left - margin.right,
      height = chartDiv.clientHeight - margin.top - margin.bottom;

  console.log("new width:", width, "new height:", height);

  svg
    .attr("width", width)
    .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // setup x
  var xValue = function(d) { return d.Lon;}, // data -> value
      xScale = d3.scale.linear().range([0, width]), // value -> display
      xMap = function(d) { return xScale(xValue(d));}, // data -> display
      xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  // setup y
  var yValue = function(d) { return d.Lat;}, // data -> value
      yScale = d3.scale.linear().range([height, 0]), // value -> display
      yMap = function(d) { return yScale(yValue(d));}, // data -> display
      yAxis = d3.svg.axis().scale(yScale).orient("left");

  // setup fill color
  var cValue = function(d) { return d["SUM(ShipmentWeight)"];},
      color = d3.scale.category10();

  // add the tooltip area to the webpage
  var tooltip = d3.select("#chart").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0.5);

  // load data
  d3.csv("demand.csv", function(error, data) {

    // change string (from CSV) into number format
    data.forEach(function(d) {
      d.Lat = +d.Lat;
      d.Lon = +d.Lon;
    });

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

    // x-axis
    var vertshift = height - margin.top
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + vertshift + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Longitude");

    // y-axis
    var horizshift = margin.right
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + horizshift + ",0)")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Latitude");

    // draw dots
    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        //.attr("r", function(d) { return Math.log(d["SUM(ShipmentWeight)"])})
        //.attr("r", function(d) { return d["SUM(ShipmentWeight)"]/50000})
        .attr("r", function(d) { return Math.abs(Math.sqrt(d["SUM(ShipmentWeight)"]/2000))})
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill-opacity", 0.1)
        .style("stroke-opacity", 0)
        .style("fill", color(0))
        .on("mouseover", function(d) {
            tooltip.transition()
                 .duration(200)
                 .style("opacity", 0.9);
            tooltip.html("weight: " + d["SUM(ShipmentWeight)"] + "<br/> (" + xValue(d)
  	        + ", " + yValue(d) + ")")
                 .style("left", (d3.event.pageX + 5) + "px")
                 .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        });

    // draw legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;})

    // zoom controller
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .call(d3.zoom()
            .scaleExtent([1 / 2, 4])
            .on("zoom", zoomed));

    function zoomed() {
      g.attr("transform", d3.event.transform);
    }
  });
};

// Draw for the first time to initialize.
redraw();

// Redraw based on the new size whenever the browser window is resized.
window.addEventListener("resize", redraw);
