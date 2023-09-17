import {React,useState} from 'react';
import { Group } from '@visx/group';
import { Tree } from '@visx/hierarchy';
import { LinkVertical } from '@visx/shape';
import { hierarchy } from 'd3-hierarchy';
import { likertSeven } from '../setting/likertSeven.js';
import Likert from "react-likert-scale";
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';


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
  const [radioValue, setRadioValue] = useState('subject');
  return (
    <div>
    <div>
      <label>
        Data Number:
        <select value={dataNumber} onChange={e => setDataNumber(e.target.value)}>
          <option value={20}>20</option>
          <option value={60}>60</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
        </select>
      </label>
      <label>
        Subject Number:
        <select value={subjectNumber} onChange={e => setSubjectNumber(e.target.value)}>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>
      <label>
        Topic:
        <select value={topic} onChange={e => setTopic(e.target.value)}>
          <option value="init">init</option>
          <option value="final">final</option>
        </select>
      </label>
    </div>
    <svg width={400} height={300}>
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
                <circle r={15} fill="red" />
                <text dy=".33em" fontSize={9} fontFamily="Arial" textAnchor="middle">
                  {node.data.name}
                </text>
              </Group>
            ))}
          </Group>
        )}
      </Tree>
    </svg>
    <div className='thanks-container'>
    <div className='final-rate'>
        {/* ...SVG... */}
        <ol>
          <li>
            <Likert
              question={'1. Whether explain dataset'}
              responses={likertSeven}
              // ...
            />
          </li>
          <li>
            <Likert
              question={'2. Topic layer whether show dominate feature'}
              responses={likertSeven}
              // ...
            />
          </li>
          <li>
            <Likert
              question={'3. Bottom layer whether show dominate feature'}
              responses={likertSeven}
            />
          </li>
          <li> <p>4. Which layer show best explanation</p>
            <RadioGroup
              aria-label="layer"
              value={radioValue}
              onChange={(event) => setRadioValue(event.target.value)}
            >
              <FormControlLabel value="subject" control={<Radio />} label="Subject" />
              <FormControlLabel value="topic" control={<Radio />} label="Topic" />
              <FormControlLabel value="bottom" control={<Radio />} label="Bottom" />
            </RadioGroup>
          </li>
        </ol>
        </div>
        </div>
    </div>
  );
}