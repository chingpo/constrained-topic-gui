import React, { useState, useEffect,useCallback } from 'react';
import { IMG_BASE_URL } from "../api/axios"
import useWindowSize from "../hook/useWindowSize";
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import Slider from '@mui/material/Slider';
import { Stack } from '@mui/material';
import { Zoom } from '@visx/zoom';
import { scaleLinear } from '@visx/scale';
import { RectClipPath } from '@visx/clip-path';

const patch_width = 30
const patch_height = 30
const colors = ['#ffff4d', '#d5c1ff', '#f7bdb7', '#8436b5', '#00b300', '#00b300', '#b9f29b', '#e01f22', '#d69d53', '#f7a400', '#3a9efd', '#3e4491', '#292a73', '#1a1b4b', '#660066', '#54007d', '#eabfff', '#b3b300', '#7d7d00', '#0c0d0e'];
const ClusterGraph = ({ cluster_ids, setClusters,data   }) => {
  data=data.data;
  const [height, width] = useWindowSize();
  const [showAlert, setShowAlert] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const handleClose = () => {
    setShowAlert(false);
  };
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(handleClose, 8000);//8s后自动关闭
      return () => clearTimeout(timer); // 清除定时器
    }
  }, [showAlert]);
  const handleSelectCluster = useCallback((event, cluster) => {
    setClusters(prevClusters => {
      if (prevClusters.length >= 5 && !prevClusters.includes(cluster.cluster_id)) {
        setShowAlert(true);
        return prevClusters;
      }
  
      return prevClusters.includes(cluster.cluster_id)
        ? prevClusters.filter(id => id !== cluster.cluster_id)
        : [...prevClusters, cluster.cluster_id];
    });
  }, []);

  const x_scale = scaleLinear({
    domain: [Math.min(...data.map(d => d.x)), Math.max(...data.map(d => d.x))],
    range: [0, width],
  });

  const y_scale = scaleLinear({
    domain: [Math.min(...data.map(d => d.y)), Math.max(...data.map(d => d.y))],
    range: [0, height],
  });
  const initialTransform = {
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
    skewX: 0,
    skewY: 0,
  };
  return (
    <div>
       {showAlert && 
         <Alert onClose={handleClose}>
         {/* It's enough! After 5 topics been choosed you can click play now. */}
         五つトピックは十分です。「続ける」をクリックしてください。
       </Alert>
         }

       <Zoom
      width={width}
      height={height}
      scaleXMin={0.7}
      scaleXMax={4}
      scaleYMin={0.7}
      scaleYMax={4}
      transformMatrix={initialTransform}
    >
      {(zoom) => (
        <div className="chart-part">
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <Button aria-label="reset" startIcon={<RestartAltIcon />} onClick={zoom.reset}>reset</Button>
            <Tooltip title="Zoom Out">
              <IconButton aria-label="remove" onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })} ><RemoveIcon /></IconButton>
            </Tooltip>
            <Slider
                  value={zoom.transformMatrix.scaleX}
                  onChange={(event, newValue) => {
                  zoom.scale({ scaleX: newValue / zoom.transformMatrix.scaleX, scaleY: newValue / zoom.transformMatrix.scaleY });
                  }}
                  min={0.7}
                  max={4}
                  step={0.1}
                  style={{ width: '10rem' }}
                />
             <Tooltip title="Zoom In">
              <IconButton aria-label="add" onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })} ><AddIcon /></IconButton>
            </Tooltip>
            <Button aria-label="center" startIcon={<CenterFocusStrongIcon />} onClick={zoom.center}>center</Button>
            <Button onClick={() => setShowMiniMap(!showMiniMap)}>
            {showMiniMap ? 'Hide' : 'Show'} Mini Map
          </Button>
          </Stack>    
        <svg width={width} height={height} 
         onTouchStart={zoom.dragStart}
         onTouchMove={zoom.dragMove}
         onTouchEnd={zoom.dragEnd}
         onMouseDown={zoom.dragStart}
         onMouseMove={zoom.dragMove}
         onMouseUp={zoom.dragEnd}
         onMouseLeave={() => {
           if (zoom.isDragging) zoom.dragEnd();
         }}
            style={{
              cursor: zoom.isDragging ? "grabbing" : "default",
              touchAction: "none"
            }}
            // ref={zoom.containerRef}
            >
          {/* 帮助minimap上的position box指定范围变色*/}
          <RectClipPath id="minimap-clip" width={width} height={height} />
          {data.map((d, i) => ( 
            <g key={i} transform={zoom.toString()}>
              {cluster_ids.includes(d.cluster_id) && (
                <rect
                  x={x_scale(d.x)}
                  y={y_scale(d.y)}
                  width={patch_width}
                  height={patch_height}
                  stroke={colors[d.cluster_id%colors.length ]}
                  strokeWidth="2"
                  fill="none"
                />
              )}
              <image
                href={IMG_BASE_URL + d.img_name}
                x={x_scale(d.x)}
                y={y_scale(d.y)}
                width={patch_width}
                height={patch_height}
                onClick={event => handleSelectCluster(event, d)}
                style={{
                  opacity: cluster_ids.includes(d.cluster_id) ? 0.5 : 1,
                }}
              />
            </g>
          ))}
      
          {showMiniMap && (
                /* minimap size and position by transform */
                <g clipPath="url(#minimap-clip)" 
                transform={`
                scale(0.25)
                translate(${width * 4 - width - 70}, ${30})
                `}
                //    transform={`
                // scale(1)
                // translate(${0}, ${ 0})
                // `}
                >  
                {/* 外边框颜色 */}
                  <rect width={width} height={height} stroke="black" fill='white' />
                  {data.map((d, i) => (
                    <circle
                      key={i}
                      cx={x_scale(d.x)} // No need to scale down the coordinates here
                      cy={y_scale(d.y)} // No need to scale down the coordinates here
                      r={5} // Set the radius of the circle
                      fill={colors[d.cluster_id%colors.length]}/>
                  ))}  
                  {/* position box over minimap */}
                  <rect
                    width={width}
                    height={height}
                    fill="gray"
                    fillOpacity={0.2}
                    stroke="black"
                    strokeWidth={4}
                    transform={zoom.toStringInvert()}/>
                </g>    
            )}
       </svg>

        </div>
        )}
        </Zoom>
        </div>
  );
};

export default ClusterGraph;