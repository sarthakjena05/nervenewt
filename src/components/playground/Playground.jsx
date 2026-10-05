import React from "react";
import Brand from "../Brand";
import GamePreview from "./GamePreview";
import CompactSignal from "./CompactSignal";
import useWorkflow from "./useWorkflow";
export default function Playground({provider,onConnect,pairing,onDisconnect}) {
 const flow=useWorkflow(provider);
 return <section className="playground-wrap" id="playground" aria-labelledby="playground-title"><div className="playground demo-simple"><div className="playground-toolbar"><div className="workspace-name"><Brand compact/><h2 id="playground-title">A signal. A jump.</h2></div><div className="device-connection">{provider.live?<><span className="connected-label">● Muse 2 connected</span><button className="connect-device" onClick={onDisconnect}>Disconnect</button></>:<button className="connect-device" onClick={onConnect} disabled={pairing}>{pairing?'Pairing Muse 2…':'+ Connect device'}</button>}</div></div><p className="demo-description">{provider.live?'Blink or close your eyes. Watch the newt jump.':'Real recorded EEG. Signal peaks make the newt jump—no headset needed.'}</p><div className="demo-stage"><GamePreview live={!!provider.live} onTogglePause={flow.togglePause} event={flow.event} paused={flow.paused}/><CompactSignal samples={flow.frame.channels[1]} live={!!provider.live} paused={flow.paused} triggered={flow.detected}/></div></div></section>;
}
