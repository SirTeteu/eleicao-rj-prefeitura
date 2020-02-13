import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class PieChart extends React.Component {
   constructor(props){
      super(props)
      this.createPieChart = this.createPieChart.bind(this);
   }

   componentDidMount(){
      if(this.props.multiple) {
         this.createPieChart();
      }
   }

   componentDidUpdate() {
      this.createPieChart();
   }

   createPieChart() {
      const node = this.node
      
      let width = this.props.width;
      let height = this.props.height;
      let margin = 40

      let radius = Math.min(width, height) / 2 - margin

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

      let color = d3.scaleOrdinal()
      .domain(data)
      .range(d3.schemeSet2);

      let pie = d3.pie()
      .sort(null)
      .value(function(d) {return d.value.number; })

      let data_ready = pie(d3.entries(data))

      let arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)

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

      svg
      .selectAll('mySlices')
      .data(data_ready)
      .enter()
      .append('text')
      .text(function(d) { 
         let percent = Math.round(100 * d.data.value.number / total);
         return `${d.data.value.name} (${percent}%)`;
      })
      .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
      .style("text-anchor", "middle")
      .style("font-size", 15)
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
   })),
   multiple: PropTypes.bool
};

export default PieChart;