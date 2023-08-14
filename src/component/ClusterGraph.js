import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import useWindowSize from "../hook/useWindowSize";
import Alert from '@mui/material/Alert';
// import data from "../json/test.json";
// import data from "../json/20_image_tsne.json"
import { IMG_BASE_URL } from "../api/axios"
// import data from "../json/full_image_pca.json";
import data from "../json/nn_projection_pca.json";



const patch_width = 30
const patch_height = 30
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
const ClusterGraph = ({ cluster_ids, setClusters }) => {
  const center_json = [{ "cluster_id": 0, "x": 1.6667003631591797, "y": 55.849369049072266 }, { "cluster_id": 1, "x": 25.46493911743164, "y": 10.570146560668945 }, { "cluster_id": 2, "x": -45.96719741821289, "y": -18.368995666503906 }, { "cluster_id": 3, "x": 33.76463317871094, "y": -32.00864791870117 }, { "cluster_id": 4, "x": 29.78343391418457, "y": 46.52472686767578 }, { "cluster_id": 5, "x": 8.59740161895752, "y": 48.069305419921875 }, { "cluster_id": 6, "x": -4.960295677185059, "y": -15.97167682647705 }, { "cluster_id": 7, "x": 14.687896728515625, "y": 15.44683837890625 }, { "cluster_id": 8, "x": 0.8437662720680237, "y": 25.1026611328125 }, { "cluster_id": 9, "x": 39.28099060058594, "y": 45.60782241821289 }, { "cluster_id": 10, "x": -6.10936975479126, "y": 52.54291915893555 }, { "cluster_id": 11, "x": 43.113792419433594, "y": -32.52210998535156 }, { "cluster_id": 12, "x": -6.088547229766846, "y": 14.045592308044434 }, { "cluster_id": 13, "x": 16.42440414428711, "y": -25.637758255004883 }, { "cluster_id": 14, "x": 35.126708984375, "y": -8.584490776062012 }, { "cluster_id": 15, "x": 22.269224166870117, "y": -10.125810623168945 }, { "cluster_id": 16, "x": -64.36766052246094, "y": -13.329124450683594 }, { "cluster_id": 17, "x": -22.294801712036133, "y": -64.96427917480469 }, { "cluster_id": 18, "x": -11.827675819396973, "y": 27.751506805419922 }, { "cluster_id": 19, "x": 18.28203582763672, "y": 49.6829833984375 }, { "cluster_id": 20, "x": 12.99618148803711, "y": -15.775712966918945 }, { "cluster_id": 21, "x": -17.267559051513672, "y": 7.774327754974365 }, { "cluster_id": 22, "x": 0.7194544672966003, "y": -33.06669998168945 }, { "cluster_id": 23, "x": -39.93769836425781, "y": -44.13722229003906 }, { "cluster_id": 24, "x": -31.467193603515625, "y": -0.9931849837303162 }, { "cluster_id": 25, "x": 19.17205238342285, "y": 35.343379974365234 }, { "cluster_id": 26, "x": 13.739004135131836, "y": 53.87233352661133 }, { "cluster_id": 27, "x": 10.129362106323242, "y": 3.531669855117798 }, { "cluster_id": 28, "x": 15.013781547546387, "y": -42.006622314453125 }, { "cluster_id": 29, "x": 1.25808846950531, "y": -53.73308563232422 }]
  const home_url = IMG_BASE_URL;

  const svgRef = useRef(null);
  const [click_cluster_ids, setClickClusterIds] = useState([]);
  const [height, width] = useWindowSize();
  const [showAlert, setShowAlert] = useState(false);
  const choose_topic = (d, i) => {
    if (click_cluster_ids.length >= 5 && !click_cluster_ids.includes(i.cluster_id)) {

      // alert("It's enough");
      setShowAlert(true);
      return; // 如果已经有5个或更多的元素，就不再添加新的元素
    }
    setClickClusterIds(prevClickClusterIds => {
      let updatedClickClusterIds;
      if (prevClickClusterIds.includes(i.cluster_id)) {
        // If the cluster_id is already selected, remove it from the array
        updatedClickClusterIds = prevClickClusterIds.filter(id => id !== i.cluster_id);
      } else {
        // If the cluster_id is not selected, add it to the array
        updatedClickClusterIds = [...prevClickClusterIds, i.cluster_id];
      }
      setClusters(updatedClickClusterIds);
      return updatedClickClusterIds;
    });
  }
  const handleClose = () => {
    setShowAlert(false);
  };
  setTimeout(handleClose, 8000);

  const renderChart = () => {
    d3.select(svgRef.current).selectAll("*").remove();
    // pass d3 x,y to canvas
    let xScale = d3.scaleLinear().domain(d3.extent(data, d => d.x)).range([0, width]);
    let yScale = d3.scaleLinear().domain(d3.extent(data, d => d.y)).range([0, 600]);

    // click event
    let svg = d3
      .select(svgRef.current);

    let images = svg.selectAll('image')
      .data(data)
      .enter()
      .append('image')
      .attr('width', patch_width)
      .attr('height', patch_height)
      .attr('xlink:href', d => home_url + d.img_name)
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y))

      .on('click', choose_topic);

    let rects = svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('width', patch_width)
      .attr('height', patch_height)
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y))
      .style('fill', 'none')
      .style('stroke', d => (click_cluster_ids.includes(d.cluster_id) || cluster_ids.includes(d.cluster_id)) ? colors[d.cluster_id % colors.length] : 'none')
      .style('stroke-width', d => (click_cluster_ids.includes(d.cluster_id) || cluster_ids.includes(d.cluster_id)) ? '3px' : '0px');


  }


  useEffect(() => {
    renderChart();
    console.log(click_cluster_ids)
    console.log(cluster_ids)
  }, [click_cluster_ids, cluster_ids, width, height]);



  return (

    <div>
      {showAlert && 
         <Alert severity="info" onClose={handleClose}>
         It's enough! After 5 topics been choosed you can click play now.
       </Alert>
         }

      <div className="chart-part">
         
        <svg width={width} height={height} ref={svgRef} />
      </div>

</div>
  );
}

export default ClusterGraph;