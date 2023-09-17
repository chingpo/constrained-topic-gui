import * as React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function LinearWithValueLabel({round}) {
  const completedSegments = Math.floor(round / 25);
  console.log(completedSegments);
  const currentSegmentProgress = (round % 25) * 4;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    {[1, 2, 3, 4].map((segment, index) => (
      <Box sx={{ flexGrow: 1, height: '10px' }} key={index}>
        <LinearProgress 
          variant="determinate" 
          value={index < completedSegments ? 100 : (index === completedSegments ? currentSegmentProgress : 0)} 
        />
      </Box>
    ))}
      <Box >
            <Typography variant="body2" color="text.secondary">
            {(completedSegments < 4 ? completedSegments + 1 : completedSegments)}/4
            </Typography>
    </Box>
  </Box>
  
  );
 
}
