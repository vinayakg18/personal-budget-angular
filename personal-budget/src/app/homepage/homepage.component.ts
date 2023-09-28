import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import * as d3 from 'd3';
import { PieArcDatum } from 'd3';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements AfterViewInit {

  public dataSource = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
          '#fd6b90',
          '#36aeb8',
          '#36ae78',
          '#36ae18',
        ],
      }
    ],
    labels: []
  };

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.http.get<{ myBudget: { title: never; budget: never }[] }>('http://localhost:3000/budget') 
      .subscribe((res) => {
        for (let i = 0; i < res.myBudget.length; i++) {
          this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
          this.dataSource.labels[i] = res.myBudget[i].title;
        }
        this.createChart();
        this.createPieChart();
      });
  }

createChart(){
  var ctx = document.getElementById('myChart') as HTMLCanvasElement;
  var myPieChart = new Chart(ctx,{
      type:'pie',
      data:this.dataSource,
  });
}

  createPieChart() {
    const data = this.dataSource.datasets[0].data;
    const labels = this.dataSource.labels;
    const backgroundColor = this.dataSource.datasets[0].backgroundColor;

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select('#d3-pie-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal<string>(backgroundColor);
    const pie = d3.pie<number>().value((d) => d);
    const arc = d3.arc<PieArcDatum<number>>()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const labelArc = d3.arc<PieArcDatum<number>>()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i.toString()));

    arcs.append('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '0.35em')
      .text((d, i) => labels[i]);
  }
}
