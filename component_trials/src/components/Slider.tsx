import {useState, useRef, useEffect, useCallback, ChangeEvent} from 'react'
import { styled } from 'styled-components'

//https://stackblitz.com/edit/multi-range-slider-typescript?file=components%2FmultiRangeSlider%2FMultiRangeSlider.tsx

interface SliderProps {
  backgroundColor?: string;
  type?: 'multi' | 'single';
  min: number;
  max: number;
}




export const Slider = ({ backgroundColor, type = 'single', min, max }: SliderProps) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef<HTMLDivElement>(null); 
  const leftThumb = useRef<HTMLInputElement>(null);
  const rightThumb = useRef<HTMLInputElement>(null);
  // Convert to percentage
  const getPercent = useCallback((value: number) =>
    Math.round(((value - min) / (max - min)) * 100), [min, max])

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  useEffect(() => {
    if (leftThumb.current && rightThumb.current) {
      leftThumb.current.style.left = `${getPercent(minVal)}%`;
      rightThumb.current.style.left = `${getPercent(maxVal)}%`;
    }
  }, [minVal, maxVal, getPercent]);
  

  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const isClicked = useRef<boolean>(false);

  const coords = useRef<{
    startX: number,
    startY: number,
    lastX: number,
    lastY: number
  }>({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0
  })

  useEffect(() => {
    if (!range.current || !containerRef.current) return;

    const box = range.current;
    const container = containerRef.current;

    const containerRect = container.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();

    const onMouseDown = (e: MouseEvent) => {
      isClicked.current = true;
      coords.current.startX = e.clientX;
      coords.current.lastX = boxRect.left - containerRect.left;
    }

    const onMouseUp = () => {
      isClicked.current = false;
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isClicked.current) return;

      let nextX = e.clientX - coords.current.startX + coords.current.lastX;

      if (nextX < 0) {
        nextX = 0;
      }
     
      if (nextX + boxRect.width > containerRect.width) {
        nextX = containerRect.width - boxRect.width;
      }
      
      box.style.left = `${nextX}px`;
      console.log("nextx:"+nextX);
    }

    box.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    const cleanup = () => {
      box.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    }

    return cleanup;
  }, [])

  return (
    <>
      {
        type && type === 'multi' ?
          (<div className="container">
              <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                onChange={(event: ChangeEvent<HTMLInputElement>) => { 
                  const value = Math.min(Number(event.target.value), maxVal - 1);
                  setMinVal(value);
                  minValRef.current = value;
                  console.log("min val = " + value);
                }}
                className="thumb thumb--left"
                
              />
              <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {  
                  const value = Math.max(Number(event.target.value), minVal + 1);
                  setMaxVal(value);
                  maxValRef.current = value;
                  console.log("max val = " + value);
                }}
                className="thumb thumb--right"
              />
              <div className="slider">
                  <div className="slider__track" ref={containerRef}>
                    <div ref={range} className="slider__range" style={{ backgroundColor: backgroundColor ? backgroundColor : 'red' }}></div>
                  </div>
                  <div className="slider__left-value">{minVal}</div>
                  <div className="slider__right-value">{maxVal}</div>
                </div>
          </div>) 
          :
          ( <div ref={containerRef} className="cont">
          <div ref={boxRef} className="box"></div>
        </div>)
          
      }
    </>

  )
}

export default Slider