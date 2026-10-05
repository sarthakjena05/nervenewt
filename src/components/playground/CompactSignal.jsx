import React, { useEffect, useRef } from "react";
export default function CompactSignal({ samples, live, paused, triggered }) {
  const canvas = useRef(null);
  useEffect(() => {
    const element=canvas.current,ctx=element.getContext('2d');
    if(!ctx)return;
    const width=600,height=70,scale=window.devicePixelRatio||1;
    element.width=width*scale;element.height=height*scale;ctx.scale(scale,scale);
    ctx.clearRect(0,0,width,height);ctx.strokeStyle=triggered?'#c37547':'#829783';ctx.lineWidth=1.5;ctx.beginPath();
    const size=live?256:768;
    samples.forEach((value,i)=>{const x=(size-samples.length+i)*width/(size-1),y=35-Math.max(-30,Math.min(30,value*(live?.18:.9)));if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.stroke();
  },[samples,live,triggered]);
  return <div className="compact-signal"><div><span>{live?'Live EEG · AF7':'Simulated EEG'}</span><span>{paused?'Paused':triggered?'Signal detected':'Listening'}</span></div><canvas ref={canvas} role="img" aria-label={`${live?'Live':'Simulated'} AF7 EEG waveform`} /></div>;
}
