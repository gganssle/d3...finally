var margin = {top: 20, right: 20, bottom: 30, left: 40}

function dashboard(id, indata) {
  var dash = document.getElementById(id.substr(1));

  function redraw() {
    d3.selectAll('svg').remove();

    var pltwidth = (dash.clientWidth - margin.left - margin.right) * 2 / 3,
        pltheight = (dash.clientHeight - margin.top - margin.bottom);

    var piewidth = (dash.clientWidth - margin.left - margin.right) / 3,
        pieheight = (dash.clientHeight - margin.top - margin.bottom);

    function linePlot(lD) {
      var lP = {};

      var max = d3.max(
        lD.map(function(d) {
          return d.one;
        })
      );

      var xScale = d3.scaleLinear()
        .domain([0, lD.length-1]) // input
        .range([0, pltwidth]); // output

      var yScale = d3.scaleLinear()
          .domain([0, max]) // input
          .range([pltheight, 0]); // output

      var line = d3.line()
          .x(function(d, i) { return xScale(i); })
          .y(function(d) { return yScale(d.one); })
          .curve(d3.curveMonotoneX)

      var linesvg = d3.select(id).append("svg")
          .attr("width", pltwidth + margin.left + margin.right)
          .attr("height", pltheight + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      linesvg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + pltheight + ")")
          .call(d3.axisBottom(xScale));

      linesvg.append("g")
          .attr("class", "y axis")
          .call(d3.axisLeft(yScale));

      linesvg.append("path")
          .datum(lD)
          .attr("class", "line")
          .attr("d", line)

      var focus = linesvg.append("g")
          .attr("class", "focus")
          .style("display", "none");

      focus.append("circle")
          .attr("r", 20);

      focus.append("text")
          .attr("x", -20)
        	.attr("dy", -30);

      focus.append("line")
          .attr("class", "x-hover-line hover-line")
          .attr("y1", 0)
      focus.append("line")
          .attr("class", "y-hover-line hover-line")
          .attr("x2", 0)

      linesvg.selectAll(".dot")
          .data(lD)
        .enter().append("circle")
          .attr("class", "dot")
          .attr("cx", function(d, i) { return xScale(i) })
          .attr("cy", function(d) { return yScale(d.one) })
          .attr("r", 10)
          .on("mouseover", bubbleon)
          .on("mouseout", bubbleoff)
          .on("mousemove", bubbleon)

      function bubbleon(d) {
        focus.style("display", null);

        var x = xScale.invert(d3.mouse(this)[0]);
        var y = yScale.invert(d3.mouse(this)[1]);
        var f = d3.format(".3n")

        focus.attr("transform", "translate(" + xScale(x) + "," + yScale(y) + ")");
        focus.select("text").style("fill", "#6F257F").text(f(x) + ", " + f(y));
        focus.select(".x-hover-line").attr("y2", pltheight-yScale(y));
        focus.select(".y-hover-line").attr("x1", -xScale(x));

        var locals = [
          {type: 'one', perc: d.one},
          {type: 'two', perc: d.two},
          {type: 'three', perc: d.three}
        ];
        pC.update(locals);
      };
      function bubbleoff() {
        focus.style("display", "none");
        pC.update(totals);
      }

      return lP;
    };

    function pieChart(pD) {
      var pC = {};
      var f = d3.format(".3n")

      function segColor(c){ return {one:"#807dba", two:"#e08214", three:"#41ab5d"}[c]; }
      function txtColor(c){ return {one:"#2c2b42", two:"#7a470b", three:"#1a4425"}[c]; }

      var piesvg = d3.select(id).append("svg")
        .attr("width", piewidth).attr("height", pieheight).append("g")
        .attr("transform", "translate("+piewidth/2+","+pieheight/2+")");

      var pieradius = Math.min(piewidth, pieheight) / 2;
      var arc = d3.arc().outerRadius(pieradius - 10).innerRadius(0);
      var pie = d3.pie().sort(null).value(function(d) { return d.perc; });

      var g = piesvg.selectAll(".arc")
        .data(pie(pD))
        .enter().append("g");

      g.append("path")
        .attr("d", arc)
        .each(function(d) { this._current = d; })
        .style("fill", function(d) { return segColor(d.data.type); })

      g.append("text")
        .attr("transform", function(d) {
          var _d = arc.centroid(d);
          return "translate(" + _d + ")";
        })
        .attr("dy", ".50em")
        .style("text-anchor", "middle")
        .style("fill", function(d) { return txtColor(d.data.type); })
        .style("font-weight", "bold")
        .text(function(d) {
          return f(d.data.perc);
        })

      pC.update = function(nD){
          piesvg.selectAll("path").data(pie(nD))
            .transition().duration(500).attrTween("d", arcTween);

          piesvg.selectAll("text").data(pie(nD))

            .attr("dy", ".50em")
            .style("text-anchor", "middle")
            .style("fill", function(d) { return txtColor(d.data.type); })
            .style("font-weight", "bold")
            .text(function(d) {
              return f(d.data.perc);
            })
            .transition()
              .duration(500)
              .attr("transform", function(d) {
                var _d = arc.centroid(d);
                return "translate(" + _d + ")";
              })
      }

      function arcTween(a) {
          var i = d3.interpolate(this._current, a);
          this._current = i(0);
          return function(t) { return arc(i(t));    };
      }

      return pC;
    };

    var totals = [{type: 'one', perc: 0}, {type: 'two', perc: 0}, {type: 'three', perc: 0}]
    for (i = 0; i < indata.length; i++) {
      totals[0].perc += indata[i].one;
      totals[1].perc += indata[i].two;
      totals[2].perc += indata[i].three;
    };

    var lP = linePlot(indata),
        pC = pieChart(totals);
  };

  redraw();
  window.addEventListener("resize", redraw);
};


d3.csv('onetwo.csv').then(function(dataset) {
  indata = dataset;
  datahandler();
});


function datahandler() {
  for (i = 0; i < indata.length; i++) {
    indata[i].one = +indata[i].one;
    indata[i].two = +indata[i].two;
    indata[i].three = +indata[i].three;
  };

  dashboard('#dashboard', indata);
};
