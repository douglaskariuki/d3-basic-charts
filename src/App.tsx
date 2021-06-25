import React from 'react'
import './App.scss'
import HelloD3 from './components/HelloD3/HelloD3'
import JSXCanvas from "./components/JSXCanvas/JSXCanvas"
import HelloSVG from "./components/HelloSVG/HelloSVG";
import HelloJSXData from "./components/HelloJSXData/HelloJSXData";
import HelloD3Data from "./components/HelloD3Data/HelloD3Data";
import SimpleChart from './components/SimpleChart/SimpleChart';
import CircleWithEvents from "./components/CircleWithEvents/CircleWithEvents";
import CircleWithD3Events from "./components/CircleWithEvents/CircleWithD3Events";
import PulsatingCircle from "./components/PulsatingCircle/PulsatingCircle";
import PulsatingCircleD3 from "./components/PulsatingCircle/PulsatingCircleD3";
import BasicLineChart from './components/BasicLineChart/BasicLineChart';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      {/* <HelloD3Data data={['one', 'two', 'three', 'four']} /> */}
      {/* <SimpleChart /> */}
      {/* <CircleWithEvents /> */}
      {/* <CircleWithD3Events /> */}
      {/* <svg width={400} height={400} viewBox="0 0 800 450">
        <g>
          <PulsatingCircle cy={100} cx={100} />
        </g>
      </svg> */}
      {/* <PulsatingCircleD3 /> */}
      <BasicLineChart top={10} right={50} bottom={50} left={50} width={900} height={400} fill="tomato" />
      </header>
    </div>
  )
}

export default App
