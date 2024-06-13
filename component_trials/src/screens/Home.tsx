import { useState } from 'react'
import Slider from '../components/Slider'

const Home = () => {

  const [val, setVal] = useState({min: 319, max: 340});

  const handleValueChange = (newVal: {min: number, max:number}) => {
    setVal(newVal);
    console.log("min=" + newVal.min +" max=" + newVal.max);
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center', height:'100vh', alignItems:'center'}}>
        <Slider type='multi' min={300} max={395} rangeColor='blue' step={7} value={val} onChange={handleValueChange}/>
    </div>
  )
}

export default Home