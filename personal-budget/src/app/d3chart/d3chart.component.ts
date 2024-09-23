import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '../data.service';  // Adjust the path if needed

@Component({
  selector: 'pb-d3chart',  // Adjust the selector name
  templateUrl: './d3chart.component.html',  // Correct the path
  styleUrls: ['./d3chart.component.scss']   // Correct the path
})
export class D3chartComponent implements OnInit {
  private svg: any;
  private margin = 50;
  private width = 450;
  private height = 450;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors: any;
  private data: any[] = []; // Holds chart data

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // Fetch data from the DataService
    this.dataService.fetchData().subscribe((res: any) => {
      // Map the backend data to a format that the chart can use
      this.data = res.mybudget.map((item: any) => ({
        name: item.title,
        value: item.budget
      }));

      // Create the chart once data is available
      this.createSvg();
      this.createColors();
      this.drawChart();
    });
  }

  // Create the SVG element
  private createSvg(): void {
    this.svg = d3.select("figure#donut")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
  }

  // Create colors for the chart
  private createColors(): void {
    const defaultColors = d3.schemeCategory10;
    this.colors = d3.scaleOrdinal()
      .domain(this.data.map(d => d.value.toString()))
      .range(defaultColors);
  }

  // Draw the chart using D3
  private drawChart(): void {
    const pie = d3.pie<any>()
      .value((d: any) => d.value)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(this.radius * 0.5) // Size of the donut hole
      .outerRadius(this.radius * 0.8);

    const outerArc = d3.arc()
      .innerRadius(this.radius * 0.9)
      .outerRadius(this.radius * 0.9);

    const dataReady = pie(this.data);

    // Draw slices of the pie chart
    this.svg.selectAll('allSlices')
      .data(dataReady)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => this.colors(d.data.value))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    // Add labels to the pie chart
    this.svg.selectAll('allLabels')
      .data(dataReady)
      .enter()
      .append('text')
      .text((d: any) => d.data.name)
      .attr('transform', (d: any) => {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = this.radius * 0.99 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', (d: any) => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? 'start' : 'end';
      });

    // Add polylines for labels
    this.svg.selectAll('allPolylines')
      .data(dataReady)
      .enter()
      .append('polyline')
      .attr('stroke', 'black')
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('points', (d: any) => {
        const posA = arc.centroid(d);
        const posB = outerArc.centroid(d);
        const posC = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        posC[0] = this.radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
        return [posA, posB, posC];
      });
  }
}
