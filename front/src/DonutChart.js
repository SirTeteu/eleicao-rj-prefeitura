import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class DonutChart extends React.Component {
   constructor(props){
      super(props)
      this.createDonutChart = this.createDonutChart.bind(this);
   }

   componentDidUpdate() {
      this.createDonutChart()
   }

   createDonutChart() {
      const node = this.node
      
      let width = this.props.width;
      let height = this.props.height;
      let margin = 80

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
      .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
      .range(d3.schemeDark2);

      let pie = d3.pie()
      .sort(null)
      .value(function(d) {return d.value.number; })
      let data_ready = pie(d3.entries(data))

      // The arc generator
      let arc = d3.arc()
      .innerRadius(radius * 0.5)         // This is the size of the donut hole
      .outerRadius(radius * 0.8)

      // Another arc that won't be drawn. Just for labels positioning
      let outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

      // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
      svg
      .selectAll('allSlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d){ return(color(d.data.key)) })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)

      // Add the polylines between chart and labels:
      svg
      .selectAll('allPolylines')
      .data(data_ready)
      .enter()
      .append('polyline')
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr('points', function(d) {
      let posA = arc.centroid(d) 
      let posB = outerArc.centroid(d) 
      let posC = outerArc.centroid(d); 
      let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 
      posC[0] = radius * 0.8 * (midangle < Math.PI ? 1 : -1);
      return [posA, posB, posC]
      })

      svg
      .selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
      .text(function(d) { 
         let percent = Math.round(100 * d.data.value.number / total);
         return `${d.data.value.name} (${percent}%)`;
      })
      .attr('transform', function(d) {
         let pos = outerArc.centroid(d);
         let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
         pos[0] = radius * 0.82 * (midangle < Math.PI ? 1 : -1);
         return 'translate(' + pos + ')';
      })
      .style('text-anchor', function(d) {
         let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
         return (midangle < Math.PI ? 'start' : 'end')
      })
   }

   render() {
      return (
         <svg 
            ref={node => this.node = node}
            style={{marginTop: '-10%', marginBottom: '-4%'}}
            width={this.props.width} 
            height={this.props.height}
         ></svg>
      );
   }
}

DonutChart.propTypes = {
   width: PropTypes.number,
   height: PropTypes.number,
   data: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      number: PropTypes.number
   }))
};

export default DonutChart;