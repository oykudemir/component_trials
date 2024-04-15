import React from 'react'
import { styled } from 'styled-components'

//https://stackblitz.com/edit/multi-range-slider-typescript?file=components%2FmultiRangeSlider%2FMultiRangeSlider.tsx

const SliderContainer = styled.div`
    position: relative;
    min-height: 50px;
`;


const Slider = () => {
  return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        margin: '35% auto'
      }}>
        <SliderContainer>
            <input id="fromSlider" type="range" value="10" min="0" max="100"/>
            <input id="toSlider" type="range" value="40" min="0" max="100"/>
        </SliderContainer>
    </div>
  )
}

export default Slider