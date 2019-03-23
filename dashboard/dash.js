var margin = {top: 20, right: 20, bottom: 30, left: 40}

function dashboard(id, indata) {
  var dash = document.getElementById(id.substr(1));

  var width = dash.clientWidth - margin.left - margin.right,
      height = dash.clientHeight - margin.top - margin.bottom;

  var max = d3.max(
    indata.map(function(d) {
      return d.one;
    })
  );

  var xScale = d3.scaleLinear()
    .domain([0, indata.length-1]) // input
    .range([0, width]); // output

  var yScale = d3.scaleLinear()
      .domain([0, max]) // input
      .range([height, 0]); // output

  var line = d3.line()
      .x(function(d, i) { return xScale(i); })
      .y(function(d) { return yScale(d.one); })
      .curve(d3.curveMonotoneX)

  var svg = d3.select(id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

  svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale));

  svg.append("path")
      .datum(indata)
      .attr("class", "line")
      .attr("d", line)

  svg.selectAll(".dot")
      .data(indata)
    .enter().append("circle")
      .attr("class", "dot")
      //.attr("fill", "blue")
      .attr("cx", function(d, i) { return xScale(i) })
      .attr("cy", function(d) { return yScale(d.one) })
      .attr("r", 5)
        .on("mouseover", bubbleon)
        .on("mouseout", bubbleoff)

    function bubbleon(d) {
      console.log(d);
      d3.select(this).classed("active", true);
    };
    function bubbleoff(d) {
      svg.selectAll(".active").classed("active", false);
    };
};


d3.csv('onetwo.csv').then(function(dataset) {
  indata = dataset;
  datahandler();
});


function datahandler() {
  for (i = 0; i < indata.length; i++) {
    indata[i].one = +indata[i].one;
    indata[i].two = +indata[i].two;
  };

  dashboard('#dashboard', indata);
};
