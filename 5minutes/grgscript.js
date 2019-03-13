d3.select('h3').style('color', 'blue');
d3.select('h3').style('font-size', '22px');

var fruits = ['apple', 'mango', 'banana', 'orange'];
d3.select('ul')
    .selectAll('li')
    .data(fruits)
    .enter()
    .append('li')
    .text(function(d) { return d; });

/*
//Select SVG element
var svg = d3.select('svg');
//Create rectangle element inside SVG
svg.append('rect')
   .attr('x', 50)
   .attr('y', 50)
   .attr('width', 200)
   .attr('height', 100)
   .attr('fill', 'green');
*/

var data = [80, 120, 60, 150, 200];
var barHeight = 20;
var bar = d3.select('svg')
         .selectAll('rect')
         .data(data)
         .enter()
         .append('rect')
         .attr('width', function(d) {  return d; })
         .attr('height', barHeight - 1)
         .attr('transform', function(d, i) {
           return "translate(0," + i * barHeight + ")";
         });


d3.select('#btn')
       .on('click', function () {
           d3.select('body')
              .append('h3')
              .text('Today is a beautiful day!!');
       });
