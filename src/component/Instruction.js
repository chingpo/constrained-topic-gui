import React, { useState,useEffect } from 'react';
import { Link} from 'react-router-dom';
import "../css/disclaimer.css";
import guide from '../guide.png';
import subject from '../subject.jpg';
import fig1 from '../fig1.png';
import fig2 from '../fig2.png';
import zoom from '../zoom.png';
// import demo from '../dnd_demo.gif';
import demo from '../demo-dnd.MP4';

const Instruction = () =>{
return(
    <div className='page'>

<h1>重要なヒント:</h1>
<ul>
<li>- 画像には、以下のような対象が写っています。</li>
<li style={{ display: 'flex', justifyContent: 'center' }}>
      <img src={subject} alt="Guide" style={{ width: '65%' }} />
    </li>

</ul>
    <h1>具体的な作業:</h1>
<h2>ステップ1. グループが重なっている部分を見つけて選択する:</h2>
<ul>
<li>- 最初の画面では、画像に写る内容が近いものが近くに配置されるように並べられています（図１）</li>
<li>- 各画像の現状でのグループ分けは、色で表現されています（図２）</li>
<li>- 図２を見ると、グループが重なっている部分と重なっていない部分があることがわかります。</li>
<li>- 重なっている部分は、グループの内容が適切に整理されていないため、グループを分け直す必要があります。</li>
<li>- そこでステップ１では、重なっている部分が大きくなるように、整理すべきグループを５つ選んでください。</li>
<li style={{ display: 'flex', justifyContent: 'center' }}>
<h3>図１</h3>
      <img src={fig1} alt="fig1" style={{ width: '65%' }} />
    </li>
    <li style={{ display: 'flex', justifyContent: 'center' }}>
    <h3>図２</h3>
      <img src={fig2} alt="fig2" style={{ width: '65%' }} />
    </li>
    <li>- 画面のズームイン・ズームアウトは以下のバーで操作できます。</li>  
    <li style={{ display: 'flex', justifyContent: 'center' }}>
      <img src={zoom} alt="zoom" style={{ width: '65%' }} />
    </li>
</ul>
<h2>ステップ2. グループを整理する:</h2>
<ul>
<li>- ステップ１で選んだ５つのグループと、それぞれのグループ内の写真が縦に並んでいます。</li>
<li>- 各画像を検討し、誤ってカテゴリ分けされていると思われる画像を適切なクラスターにドラッグ＆ドロップします。</li>
<li>- １つのグループに１つの内容が含まれるように、画像をドラッグ＆ドロップして並び替えてください。</li>
<li style={{ display: 'flex', justifyContent: 'center' }}>
<video src={demo} alt="Guide" style={{ width: '65%' }} autoPlay loop muted />
    </li>
    <li>- 画面をドラッグすることで、表示される領域を移動することができます。</li>
</ul>

<h2>作業で気をつけるべきポイント：</h2>
<ul>
<li>- 各グループに写っている対象が１種類となるように、注意深く作業してください。</li>
<li>- 画像に写っているものが不鮮明であっても、あなたが最も適切と思うグループを選び、整理してください。</li>
</ul>

操作手順を暗記する必要はありません。ユーザーガイドはヘッダーに継続的に表示されます。
<div className='check-block'>
<Link to="/display">
  <button > 
   始める
  </button>
</Link>
</div>
    </div>



    );
}

export default Instruction