import React, { useState,useEffect } from 'react';
import { Link} from 'react-router-dom';
import "../css/disclaimer.css"

const Instruction = () =>{

return(
    <div className='page'>

<h1>Important Tips:</h1>
<ul>
<li>- Take your time to carefully observe the images and their categories.</li>
<li>- If you're unsure about an image's category, place it in the cluster you think fits best.</li>
<li>- Your input is valuable! Your thoughtful participation will help us better understand clustering preferences.</li>
</ul>

<h2>step 1. Topic Selection:</h2>
<ul>
<li>- On this page, you'll see clustering results displayed as topics.</li>
<li>- You have two options for selecting a topic:</li>
<li>- Choose one of the four predefined topic combinations.</li>
<li>- Create a custom topic by selecting five clusters from the chart.</li>
<li>- Once you're satisfied with your selection, click play proceed to the next page.</li>
</ul>
<h2>step 2. Image Validation:</h2>
<ul>
<li>- In this page, you will be presented with 20 images each from the topics you chose.</li>
<li>- Examine each image and drag&drop any images you believe are incorrectly categorized to the appropriate cluster.</li>
<li>- If you need to make adjustments, click "Submit" to return to the third page and refine your topic selection.</li>
</ul>

<h2>Completing the Experiment:</h2>
<ul>
<li>- You will repeat the clustering and validation process four times in total.</li>
<li>- Feel free to explore different topic combinations and cluster images accurately to the best of your ability.</li>
</ul>

No need to worry about forgetting the operation process, the user guide will be continuously displayed in the header.
<div className='check-block'>
<Link to="/display">
  <button > 
   start
  </button>
</Link>
</div>
    </div>



    );
}

export default Instruction