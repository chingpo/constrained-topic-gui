import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import data from "./tmp.json";
import { Delaunay } from 'd3-delaunay';

const GraphView = () => {
  
  const width = window.innerWidth;
  const height = window.innerHeight;

  const svgRef = useRef(null);
  const canvasRef = useRef(null);

  const addImage = (ctx, src, x, y, i) => {
    const image = new Image();
    image.onload = function () {
      data[i].width = image.width / 4;
      data[i].height = image.height / 4;
      ctx.drawImage(image, x, y, data[i].width, data[i].height);
    };
    image.onerror = function (err) {
      console.log("err", err);
    };
    image.src =
      "https://s3.amazonaws.com/duhaime/blog/image-similarity/images/" + src;
  };

  const renderChart = () => {
    let container = d3.select(canvasRef.current)
      .attr("width", width)
      .attr("height", height);

    let ctx = container.node().getContext("2d");

    let xScale = d3
      .scaleLinear()
      .domain(
        d3.extent(data, function (d) {
          return d.x;
        })
      )
      .range([0, width]);

    let yScale = d3
      .scaleLinear()
      .domain(
        d3.extent(data, function (d) {
          return d.y;
        })
      )
      .range([height, 0]);

    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    data.forEach((d,i) => {
      addImage(ctx, d.image, xScale(d.x), yScale(d.y),i);
    });

    let svg = d3
    .select(svgRef.current).append('svg')
    .attr("width", width)
    .attr("height", height);

    let g = svg.append('g');

    // let voronoi = d3.voronoi()
    // .x(d => xScale(d.x))
    // .y(d => yScale(d.y))
    // .extent([[0, 0], [width, height]]);
    let delaunay = Delaunay.from(data.map(d => [xScale(d.x), yScale(d.y)]));
    let voronoi = delaunay.voronoi([0, 0, width, height]);



    g.selectAll("path").data(Array.from(voronoi.cellPolygons()))
        .enter()
        .append("path")
        .attr('d', function(d) { return d ? 'M' + d.join('L') + 'Z' : null; })
        .on("mousemove", handleMousemove)
        .on("click", function(d,i) {
            console.log(i);
        });
  }

  const handleMousemove = (event, d) => {
    // Implement your mousemove handler here
  }

  useEffect(() => {
    renderChart();
  }, []); 

  return (
    <div>
      <h1>cluster</h1>
      <div id="tooltip" >
        <img />
      </div>
      <div className="chart-part">
        <svg ref={svgRef} />
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export default GraphView;