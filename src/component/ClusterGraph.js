import React, { useState, useEffect,useCallback } from 'react';
import { IMG_BASE_URL } from "../api/axios"
import useWindowSize from "../hook/useWindowSize";
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
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
import { polygonHull } from 'd3-polygon';
import * as d3 from 'd3';

// Point/Vector Operations
// ref： ounded Catmull-Rom curve https://gist.github.com/hollasch/9d3c098022f5524220bd84aae7623478

const vecFrom = (p0, p1) => [p1[0] - p0[0], p1[1] - p0[1]]; // Vector from p0 to p1

const vecScale = (v, scale) => [scale * v[0], scale * v[1]]; // Vector v scaled by 'scale'

const vecSum = (pv1, pv2) => [pv1[0] + pv2[0], pv1[1] + pv2[1]]; // The sum of two points/vectors

const vecUnit = (v) => { // Vector with direction of v and length 1
  const norm = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
  return vecScale(v, 1/norm);
}

const vecScaleTo = (v, length) => vecScale(vecUnit(v), length); // Vector with direction of v with specified length

const unitNormal = (pv0, p1) => { // Unit normal to vector pv0, or line segment from p0 to p1
  if (p1 != null) pv0 = vecFrom(pv0, p1);
  const normalVec = [-pv0[1], pv0[0]];
  return vecUnit(normalVec);
};

// Hull Generators

const lineFn = d3.line()
  .curve(d3.curveCatmullRomClosed)
  .x(d => d.p[0])
  .y(d => d.p[1]);

const smoothHull2 = (polyPoints) => {
  // Returns the path for a rounded hull around two points.
  // You need to implement this function based on your requirements
};

const hullPadding = 60; // You can adjust this value based on your requirements
const smoothHull1 = (polyPoints) => {
  // Returns the path for a circular hull around a single point.
  const p1 = [polyPoints[0][0], polyPoints[0][1] - hullPadding];
  const p2 = [polyPoints[0][0], polyPoints[0][1] + hullPadding];

  return 'M ' + p1
    + ' A ' + [hullPadding, hullPadding, '0,0,0', p2].join(',')
    + ' A ' + [hullPadding, hullPadding, '0,0,0', p1].join(',');
};
const smoothHull = (hullPoints) => {
  const pointCount = hullPoints.length;

  // Handle special cases
  if (!hullPoints || pointCount < 1) return "";
  if (pointCount === 1) return smoothHull1(hullPoints);
  if (pointCount === 2) return smoothHull2(hullPoints);

  const points = hullPoints.map((point, index) => {
    const pNext = hullPoints[(index + 1) % pointCount];
    return {
      p: point,
      v: vecUnit(vecFrom(point, pNext))
    };
  });

  // Compute the expanded points, and the nearest prior control point for each.
  for (let i = 0; i < points.length; ++i) {
    const priorIndex = (i > 0) ? (i - 1) : (pointCount - 1);
    const extensionVec = vecUnit(vecSum(points[priorIndex].v, vecScale(points[i].v, -1)));
    points[i].p = vecSum(points[i].p, vecScale(extensionVec, hullPadding));
  }

  return lineFn(points);
};

const patch_width = 30
const patch_height = 30
const colors = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9'];
const ClusterGraph = ({ cluster_ids, setClusters,data   }) => {
  const [height, width] = useWindowSize();
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [hoveredClusterId, setHoveredClusterId] = useState(null);
  const handleSelectCluster = useCallback((event, cluster) => {
    const round = localStorage.getItem('round');
    if (round == 4) {
      return;
    }
    setClusters(prevClusters => {
      if (prevClusters.length >= 5 && !prevClusters.includes(cluster.cluster_id)) {
        setOpenSnackbar(true);
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
  const hullIds = [...new Set([...cluster_ids, hoveredClusterId])];
  return (
    <div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} sx={{ width: '100%' }}>
          グループが５つ選ばれました。「続ける」をクリックしてください。
        </Alert>
      </Snackbar>

       <Zoom
      width={width}
      height={height}
      scaleXMin={0.8}
      scaleXMax={4.4}
      scaleYMin={0.8}
      scaleYMax={4.4}
      transformMatrix={initialTransform}
    >
      {(zoom) => (
        <div className="chart-part">
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <Button aria-label="reset" startIcon={<RestartAltIcon />} onClick={zoom.reset}>リセット</Button>  
            <Tooltip title="ズームアウト">
            <IconButton aria-label="remove" onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8})} ><RemoveIcon /></IconButton>
            </Tooltip>
            <Slider
                    aria-label="Zoom"
                    value={zoom.transformMatrix.scaleX}
                    onChange={(event, newValue) => {
                    const scaleFactor = newValue / zoom.transformMatrix.scaleX;
                    const newScaleX = zoom.transformMatrix.scaleX * scaleFactor;
                    const newScaleY = zoom.transformMatrix.scaleY * scaleFactor;                 
                    if (newScaleX >= 0.8 && newScaleX <= 4 && newScaleY >= 0.8 && newScaleY <= 4) {
                    zoom.scale({ scaleX: scaleFactor, scaleY: scaleFactor });
                    }
                    }}
                    min={0.8}
                    max={4}
                    step={0.2}
                    style={{ width: '10rem' }}
                />
             <Tooltip title="ズームイン">
             <IconButton aria-label="add" onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })} ><AddIcon /></IconButton>            </Tooltip>
            <Button aria-label="center" startIcon={<CenterFocusStrongIcon />} onClick={zoom.center}>センター</Button>
            <Button style={{marginLeft: 'auto', marginRight: '20px'}} onClick={() => setShowMiniMap(!showMiniMap)}>
            ミニマップを{showMiniMap ? '隠す' : '表示する'}
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
              {hullIds.map(cluster_id => {
                const clusterData = data.filter(d => d.cluster_id === cluster_id);
                const points = clusterData.map(d => [x_scale(d.x), y_scale(d.y)]);
                const hull = polygonHull(points);

                if (hull) {
                  const pathData = smoothHull(hull);

                  return (
                    <path
                      d={`${pathData} Z`}
                      stroke={colors[cluster_id % colors.length]}
                      fill="none"
                    />
                  );
                }
                return null;
              })}
              <image
                href={IMG_BASE_URL + d.img_name}
                x={x_scale(d.x)}
                y={y_scale(d.y)}
                width={patch_width}
                height={patch_height}
                onClick={event => handleSelectCluster(event, d)}
                onMouseEnter={() => setHoveredClusterId(d.cluster_id)}
                onMouseLeave={() => setHoveredClusterId(null)}
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
                translate(${width * 4 - width - 70}, ${0})
                `}
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