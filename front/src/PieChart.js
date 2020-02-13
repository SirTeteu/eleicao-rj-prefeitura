import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class PieChart extends React.Component {
   constructor(props){
      super(props)
      this.createPieChart = this.createPieChart.bind(this);
   }

   componentDidUpdate() {
      this.createPieChart()
   }

   createPieChart() {
      const node = this.node
      
      // set the dimensions and margins of the graph
      let width = this.props.width;
      let height = this.props.height;
      let margin = 40

      // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
      let radius = Math.min(width, height) / 2 - margin

      // append the svg object to the div called 'my_dataviz'
      let svg = d3.select(node)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      let data = this.props.data;
      
      let total = 0;
      for(let piece of data) {
         total += piece.number;
      }

      // set the color scale
      let color = d3.scaleOrdinal()
      .domain(data)
      .range(d3.schemeSet2);

      // Compute the position of each group on the pie:
      let pie = d3.pie()
      .value(function(d) {return d.value.number; })

      let data_ready = pie(d3.entries(data))
      // Now I know that group A goes from 0 degrees to x degrees and so on.

      // shape helper to build arcs:
      let arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)

      // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
      svg
      .selectAll('mySlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', function(d){ return(color(d.data.key)) })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)

      // Now add the annotation. Use the centroid method to get the best coordinates
      svg
      .selectAll('mySlices')
      .data(data_ready)
      .enter()
      .append('text')
      .text(function(d) { 
         // let percent = Math.round(100 * d.data.value.number / total);
         // return `${d.data.value.name} (${percent}%)`;
         return d.data.value.name;
      })
      .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
      .style("text-anchor", "middle")
      .style("font-size", 17)
   }

   render() {
      return (
         <svg 
            ref={node => this.node = node} 
            width={this.props.width} 
            height={this.props.height}
         ></svg>
      );
   }
}

PieChart.propTypes = {
   width: PropTypes.number,
   height: PropTypes.number,
   data: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      number: PropTypes.number
   }))
};

export default PieChart;