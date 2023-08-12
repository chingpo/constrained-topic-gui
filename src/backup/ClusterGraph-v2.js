import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
// import data from "./image_tsne_projections.json";
import data from "./nn_projection.json";


const ClusterGraph = ({setClusters}) => {
  const center_json=[{"cluster_id": 18, "x": -10.938857078552246, "y": -6.257136821746826}, {"cluster_id": 3, "x": 9.53893756866455, "y": -14.601021766662598}, { "cluster_id": 19, "x": 67.75592803955078, "y": 0.08658482879400253}, { "cluster_id": 14, "x": 67.65950775146484, "y": -0.08497349917888641},  {"cluster_id": 23, "x": -69.2735824584961, "y": -3.24338436126709}, {"cluster_id": 25, "x": -61.432655334472656, "y": 37.40552520751953}, { "cluster_id": 5, "x": -39.291587829589844, "y": 8.147765159606934}, {"cluster_id": 14, "x": 63.29398727416992, "y": 11.238930702209473}, { "cluster_id": 17, "x": 10.058802604675293, "y": -3.4239656925201416}]
  const home_url="http://136.187.116.134:18080/web/images/";
  const width = window.innerWidth;
  const height = window.innerHeight;

  

  const svgRef = useRef(null);
  const canvasRef = useRef(null);

  const addImage = (ctx, src, x, y, i) => {
    const image = new Image();
    image.onload = function () {
    //   data[i].width = image.width / 2;
    //   data[i].height = image.height / 2;
      data[i].width =30;
      data[i].height =30;
      ctx.drawImage(image, x, y, data[i].width, data[i].height);
      if(data[i].center){
        ctx.font = "30px Arial";
        ctx.fillText("hello",x,y);
      }  
    };
    image.onerror = function (err) {
      console.log("err", err);
    };
    image.src =
      home_url + src;
    console.log(image.src)
  };


  const selectCluster = (d,i) =>{
        console.log(i);
        setClusters([11,13,12]); // calculateTopics 是你的计算主题的函数
  }

  const renderChart = () => {
    let container = d3.select(canvasRef.current)
      .attr("width", width)
      .attr("height", height);

    let ctx = container.node().getContext("2d");
    ctx.beginPath();
    ctx.rect(0, 0, width, height);

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

    data.forEach((d,i) => {
    addImage(ctx, d.img_name, xScale(d.x), yScale(d.y),i);
    });

    let svg = d3
    .select(svgRef.current).append('svg')
    .attr("width", width)
    .attr("height", height);


    svg.selectAll('image')
        .data(data)
        .enter()
        .append('image')
        .attr('xlink:href', d => home_url + d.img_name)
        .attr('x', d => xScale(d.x))
        .attr('y', d => yScale(d.y))
        .on('click', selectCluster);
         
  }



  useEffect(() => {
    renderChart();
  }, []); 

  return (
    <div>
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

export default ClusterGraph;