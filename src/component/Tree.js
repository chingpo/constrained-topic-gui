import {React,useState,useEffect} from 'react';
import { Group } from '@visx/group';
import { Tree } from '@visx/hierarchy';
import { LinkVertical } from '@visx/shape';
import { hierarchy } from 'd3-hierarchy';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ImageList, ImageListItem } from '@mui/material';


import final_data from "../json/nn_projection_tsne.json";
import all from "../json/topic_image_nn.json"

// 假设你有一个数据对象
const data = {
  name: '父节点',
  children: [
    { name: '子节点1' },
    { name: '子节点2' },
  ],
};

export default function ExampleTree() {
    const [dataNumber, setDataNumber] = useState(20);
  const [subjectNumber, setSubjectNumber] = useState(2);
  const [topic, setTopic] = useState('init');
  const handleRadioChange = (event) => {
    const newValue = event.target.value;
    if (newValue === 'init') {
      setTopic(all.data);
    } else if (newValue === 'final') {
      setTopic(final_data);
    }
  };
  const [showImageList, setShowImageList] = useState(false);
  const images = Array.from({ length: 200 }, (_, i) => `${process.env.PUBLIC_URL}/photo/${i + 1}.jpg`);
  return (
 
 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
 

  <RadioGroup
    row
    aria-label="data-number"
    name="data-number"
    value={dataNumber}
    onChange={e => setDataNumber(e.target.value)}
  >
    <FormControlLabel value="20" control={<Radio />} label="data 20" />
    <FormControlLabel value="200" control={<Radio />} label="data 200" />
  </RadioGroup>

    <RadioGroup
      row
      aria-labelledby="demo-row-radio-buttons-group-label"
      name="row-radio-buttons-group"
      defaultValue="final"
      onChange={handleRadioChange}
      style={{ marginTop: '10px' }}
    >
      <FormControlLabel value="init" control={<Radio />} label="初期化" />
      <FormControlLabel value="final" control={<Radio />} label="最終的" />
    </RadioGroup>
  

  <svg width={400} height={300} style={{ border: '1px solid #000', borderRadius: '5px' }}>
  <Tree root={hierarchy(data)} size={[300, 200]}>
  {tree => (
    <Group top={10} left={10}>
      {tree.links().map((link, i) => (
        <LinkVertical
          key={i}
          data={link}
          stroke="black"
          strokeWidth="1"
          fill="none"
        />
      ))}
      {tree.descendants().map((node, i) => (
        <Group key={i} top={node.y} left={node.x}>
          <circle r={15} fill="red" onClick={() => {console.log("nothing");setShowImageList(!showImageList)}} />
          <text dy=".33em" fontSize={9} fontFamily="Arial" textAnchor="middle">
            {node.data.name}
          </text>
        </Group>
      ))}
    </Group>
  )}
</Tree>
  </svg>
{showImageList && (
  <ImageList cols={5}>
    {images.slice(0, dataNumber).map((item, index) => (
      console.log(item),
      <ImageListItem key={index}>
        <img src={item} alt="" />
      </ImageListItem>
    ))}
  </ImageList>
)}

    {/* <iframe 
      src="https://docs.google.com/forms/d/e/1FAIpQLSdN7HVZ5c8jcSnyiv-0qKE03xkg8kbdC-OEV2ztQdzKrENFpw/viewform?embedded=true" 
      width="640" 
      height="1056" 
      frameborder="0" 
      marginheight="0" 
      marginwidth="0"
      title="Survey Form"
    >
      読み込み中…
    </iframe> */}
</div>


  );
}