import * as React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function LinearWithValueLabel({round}) {
  const completedSegments = Math.floor(round / 25);
  const currentSegmentProgress = (round % 25) * 4;
  let message;
  switch (true) {
    case (round === 0):
        message = `トピックを選択し、続けるをクリック`;
        break;
    case (round === 12.5):
        message = "写真移動後、'送信' をクリックしてください。";
        break;
    case (round === 100):
        message = "クラスタリングの更新はすべて完了しました。";
        break;
    default:
        message = `ラウンド ${completedSegments} が完了しました。`;
}
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
      <Box sx={{ minWidth: 150 }}>
            <Typography variant="body2" color="text.secondary">
            {message}
            </Typography>
    </Box>
  </Box>
  
  );
 
}