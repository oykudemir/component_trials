import {useState, useRef, useEffect, useCallback, ChangeEvent} from 'react'
import { styled } from 'styled-components'

interface SliderProps {
  backgroundColor?: string;
  type?: 'multi' | 'single';
  min: number;
  max: number;
}

export const Slider = ({ backgroundColor, type = 'single', min, max }: SliderProps) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);

  const range = useRef<HTMLDivElement>(null); 
  const leftThumb = useRef<HTMLInputElement>(null);
  const rightThumb = useRef<HTMLInputElement>(null);

  const getPercent = useCallback((value: number) =>
    Math.round(((value - min) / (max - min)) * 100), [min, max]);

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
    console.log(maxVal);
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  
  const isClicked = useRef<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [delta, setDelta] = useState<number>(0);

  useEffect(() => {
      console.log("min: " + minVal);
      console.log("ox: " + offsetX);
      console.log("max:" + maxVal)
      setMinVal(Math.max(min, min + offsetX));
      setMaxVal(Math.min(max, maxVal + delta));
  }, [offsetX]);

  const itemRef =  range;
  const parentRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isClicked.current = true;
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isClicked.current && itemRef.current && parentRef.current) {
      const parentWidth = parentRef.current.clientWidth;
      const itemWidth = itemRef.current.clientWidth;
      const maxOffsetX = parentWidth - itemWidth;
      const newOffsetX = Math.max(0, Math.min(maxOffsetX, offsetX + e.clientX - startX));
      setDelta(newOffsetX - offsetX); // Calculate the change in offset
      setOffsetX(newOffsetX);
      setStartX(e.clientX);
      console.log(newOffsetX)
      console.log(minVal)
      console.log("delta:" + delta);

     }
  };

  const handleMouseUp = () => {
    isClicked.current = false;
  };

  useEffect(() => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isClicked, offsetX]);

  const leftPercentage = parentRef.current ? ((offsetX / parentRef.current.clientWidth) * 100) : 0;

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
                ref={leftThumb}
                onChange={(event: ChangeEvent<HTMLInputElement>) => { 
                  const value = Math.min(Number(event.target.value), maxVal - 1);
                  setMinVal(value);
                  console.log("min val = " + value);
                }}
                className="thumb thumb--left"
                
              />
              <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                ref={rightThumb}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {  
                  const value = Math.max(Number(event.target.value), minVal + 1);
                  setMaxVal(value);
                  console.log("max val = " + value);
                }}
                className="thumb thumb--right"
              />
              <div className="slider">
                  <div className="slider__track" ref={parentRef}>
                    <div ref={range} className="slider__range" style={{  left: `${leftPercentage}%`,
                     cursor: isClicked ? 'grabbing' : 'grab',backgroundColor: backgroundColor ? backgroundColor : 'red' }}         onMouseDown={handleMouseDown}
                     ></div>
                  </div>
                  <div className="slider__left-value">{minVal}</div>
                  <div className="slider__right-value">{maxVal}</div>
                </div>
          </div>) 
          :
          ( <div /* ref={containerRef}  */className="cont">
          <div /* ref={boxRef}*/ className="box"></div>
        </div>)
          
      }
    </>

  )
}

export default Slider