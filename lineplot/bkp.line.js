
// 2. Use the margin convention practice
var margin = {top: 50, right: 50, bottom: 50, left: 50}
  , width = window.innerWidth - margin.left - margin.right // Use the window's width
  , height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

// The number of datapoints
var n = 14;

// 5. X scale will use the index of our data
var xScale = d3.scaleLinear()
    .domain([0, n-1]) // input
    .range([0, width]); // output

// 6. Y scale will use the randomly generate number
var yScale = d3.scaleLinear()
    .domain([0, 478]) // input
    .range([height, 0]); // output

// 7. d3's line generator
var line = d3.line()
    .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.value); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
var olddataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } })
console.log(typeof olddataset)
console.log(olddataset)

d3.csv("bar-data.csv", function(dataset) {
    //for (var d in dataset) {
        //d.date = d.date;
        //d.value = +d.value;
        //d += d.value;
    //};

  newdataset = d3.range(n).map(function(d) { return {"value": dataset.value } })

  console.log(typeof newdataset);
  console.log(newdataset);

  // 1. Add the SVG to the page and employ #2
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // 3. Call the x axis in a group tag
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

  // 9. Append the path, bind the data, and call the line generator
  svg.append("path")
      .datum(dataset.value) // 10. Binds data to the line
      .attr("class", "line") // Assign a class for styling
      .attr("d", line); // 11. Calls the line generator

  // 12. Appends a circle for each datapoint
  svg.selectAll(".dot")
      .data(dataset.value)
    .enter().append("circle") // Uses the enter().append() method
      .attr("class", "dot") // Assign a class for styling
      .attr("cx", function(d, i) { return xScale(i) })
      .attr("cy", function(d) { return yScale(d.value) })
      .attr("r", 5)
        .on("mouseover", function(a, b, c) {
    			console.log(a)
          this.attr('class', 'focus')
  		})
        .on("mouseout", function() {  })
});
