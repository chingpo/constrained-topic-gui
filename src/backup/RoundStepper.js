import React, { useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';


const steps = [
  'round 1',
  'round 2',
  'round 3',
  'round 4',
];

export default function RoundStepper({ activeStep}) {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '20vh' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Stepper activeStep={activeStep} alternativeLabel style={{ flexGrow: 1, alignItems: 'center' }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

    </div>

  </div>
    
  );
}