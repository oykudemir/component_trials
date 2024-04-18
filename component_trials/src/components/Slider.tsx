import {useState, useRef, useEffect, useCallback, ChangeEvent} from 'react'
import { styled } from 'styled-components'

//https://stackblitz.com/edit/multi-range-slider-typescript?file=components%2FmultiRangeSlider%2FMultiRangeSlider.tsx

const SliderContainer = styled.div`
    position: relative;
    min-height: 50px;
`;

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


  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const isClicked = useRef<boolean>(false);

  const coords = useRef<{
    startX: number,
    lastX: number
  }>({
    startX: 0,
    lastX: 0
  })

  useEffect(() => {
    if (!boxRef.current || !containerRef.current) return;

    const box = boxRef.current;
    const container = containerRef.current;

    const onMouseDown = (e: MouseEvent) => {
      isClicked.current = true;
      coords.current.startX = e.clientX - box.offsetLeft;
    }

    const onMouseUp = () => {
      isClicked.current = false;
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isClicked.current) return;

      const nextX = e.clientX - coords.current.startX;
      
      // Limit the movement to horizontal axis
      box.style.left = `${Math.max(0, Math.min(nextX, container.offsetWidth - box.offsetWidth))}px`;
    }

    box.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
    };
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
                }}
                className="thumb thumb--right"
              />
              <div className="slider">
                  <div className="slider__track"></div>
                   <div ref={range} className="slider__range"></div>
                  <div className="slider__left-value">{minVal}</div>
                  <div className="slider__right-value">{maxVal}</div>
                </div>
          </div>) 
          :
          (<div className="container">
              <input id="fromSlider" type="range" value="10" min="0" max="100" />
          </div>)
          
      }
    </>

  )
}

export default Slider