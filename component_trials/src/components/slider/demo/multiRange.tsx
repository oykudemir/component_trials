import { useState } from 'react'
import Slider from '../Slider'

const MyIcon: React.FC = () => {
  return(<svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={'red'}
    />
  </svg>);

};
  

const Home = () => {

  const [val, setVal] = useState({min: 319, max: 340});

  const handleValueChange = (newVal: {min: number, max:number}) => {
    setVal(newVal);
    console.log("min=" + newVal.min +" max=" + newVal.max);
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center', height:'100vh', alignItems:'center'}}>
      <Slider type='single' min={300} max={395} rangeColor='blue' step={7} value={val} onChange={handleValueChange}/>
    </div>
  )
}

export default Home