import React from 'react'
import Slider from '../components/Slider'

const Home = () => {
  return (
    <div style={{display: 'flex', justifyContent: 'center', height:'100vh'}}>
        <Slider type='multi' min={100} max={280} rangeColor='blue'/>
    </div>
  )
}

export default Home