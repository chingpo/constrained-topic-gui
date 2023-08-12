import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import data from "../json/nn_projection_pca.json";
// import data from "../json/full_image_pca.json";


const Test = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const svgRef = useRef(null);
  const canvasRef = useRef(null);


  const renderChart = () => {
    // canvas
    // let container = d3.select(canvasRef.current)
    //   .attr("width", width)
    //   .attr("height", height);

    // let ctx = container.node().getContext("2d");
    // ctx.beginPath();
    // ctx.rect(0, 0, width, height);

    // pass d3 x,y to canvas
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



    // click event
    let svg = d3
      .select(svgRef.current).append('svg')
      .attr("width", width)
      .attr("height", width);



  }

  useEffect(() => {
    renderChart();

  });

  return (
    <div>
      {/* <div id="tooltip" >
        <img />
      </div> */}


    </div>
  );
}

export default Test;