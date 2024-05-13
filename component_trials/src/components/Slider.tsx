import { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react'
import styled from 'styled-components';

interface SliderProps {
  rangeColor?: string;
  type?: 'multi' | 'single';
  min: number;
  max: number;
}
/*
  customize handles (wrap inputs inside custom component)
  think of min-max-step optimalizations
  sometimes dragging event prevents thumb movement
  add onchange as a prop to help view current value
*/

const Thumb = styled.div`
  position: absolute;
  margin-top: 2px;
  transform: translateY(-50%);
  background-color: #f1f5f7;
  border: none;
  border-radius: 50%;
  box-shadow: 0 0 1px 1px #ced4da;
  cursor: pointer;
  height: 18px;
  width: 18px;
  z-index: 3;
  margin-left: -1px;
`;
const CustomPopup: React.FC<{ value: number, isVisible: boolean }> = ({ value, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: 'white',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        zIndex: 3,
      }}
    >
      {value}
    </div>
  );
};

export const Slider = ({ rangeColor, type = 'single', min, max }: SliderProps) => {

  //min and max values of range
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingLeftThumb, setIsDraggingLeftThumb] = useState(false);  
  const [isDraggingRightThumb, setIsDraggingRightThumb] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startXLeft, setStartXLeft] = useState(0);
  const [startXRight, setStartXRight] = useState(0);
  const rangeRef = useRef<HTMLDivElement>(null);
  const leftThumbRef = useRef<HTMLDivElement>(null);  
  const rightThumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [showMin, setShowMin] = useState(false);

  const getPercent = useCallback((value: number) => ((value - min) / (max - min)) * 100, [min, max]);

  const updateRangeStyle = () => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);
    if (rangeRef.current) {
      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
    if(leftThumbRef.current)
    {
      const thumbWidth = leftThumbRef.current.offsetWidth; 
      if(minVal > max - thumbWidth/2)
      {
        leftThumbRef.current.style.left = `${ getPercent(minVal - thumbWidth/2)}%`;
      }
      else
      {
        leftThumbRef.current.style.left = `${minPercent}%`;
      }
    }
  };

  useEffect(() => {
    updateRangeStyle();
    console.log("min: " + minVal);
    console.log("max" + maxVal);
  }, [minVal, maxVal]);


  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    console.log("you clicked range")
  };

  const handleMouseDownLeftThumb = (e: React.MouseEvent) => {
    setIsDraggingLeftThumb(true);
    setStartXLeft(e.clientX);
    console.log("you clicked left thumb")
  };

  const handleMouseDownRightThumb = (e: React.MouseEvent) => {
    setIsDraggingRightThumb(true);
    setStartXRight(e.clientX);
    console.log("you clicked right thumb")
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && rangeRef.current && trackRef.current) {
      console.log("you moved range")

      const dx = e.clientX - startX;
      const trackWidth = trackRef.current.clientWidth;
      const newMin = Math.max(min, Math.min(max - (maxVal - minVal), minVal + (dx / trackWidth * (max - min))));
      const newMax = newMin + (maxVal - minVal);

      if (newMax <= max && newMin >= min) {
        setMinVal(newMin);
        setMaxVal(newMax);
        setStartX(e.clientX);
      }
      if(newMax < newMin)
      {
        setMinVal(newMax);
        setMaxVal(newMin);
        setStartX(e.clientX);
      }
    }
  };

  const handleMouseMoveLeftThumb = (e: MouseEvent) => {
    if (isDraggingLeftThumb && leftThumbRef.current && trackRef.current) {
      console.log("you moved range with me")

      const dx = e.clientX - startXLeft;
      const trackWidth = trackRef.current.clientWidth;
      const thumbWidth = leftThumbRef.current.offsetWidth;  // Get the width of the thumb
      const newMin = Math.round(Math.max(min, Math.min(max, minVal + (dx / trackWidth) * (max - min))));
      if(newMin > maxVal)
        {
          setMinVal(maxVal);
          setMaxVal(newMin);
        }
        else
        {
          setMinVal(newMin);
        }
      
      console.log(e.clientX);
      console.log("new min:" + newMin);
      setStartXLeft(e.clientX);
    }
  };


  const handleMouseMoveRightThumb = (e: MouseEvent) => {
    if (isDraggingRightThumb && rightThumbRef.current && trackRef.current) {
      console.log("you moved range with me")

      const dx = e.clientX - startXRight;
      const trackWidth = trackRef.current.clientWidth;
      const thumbWidth = rightThumbRef.current.offsetWidth;  // Get the width of the thumb
      const newMin = Math.round(Math.max(min, Math.min(max, minVal + (dx / trackWidth) * (max - min))));
      if(newMin > maxVal)
        {
          setMinVal(maxVal);
          setMaxVal(newMin);
        }
        else
        {
          setMinVal(newMin);
        }
      
      console.log(e.clientX);
      console.log("new min:" + newMin);
      setStartXRight(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseUpLeftThumb = () => {
    setIsDraggingLeftThumb(false);
  };


  const handleMouseUpRightThumb = () => {
    setIsDraggingRightThumb(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMoveLeftThumb);
    document.addEventListener('mouseup', handleMouseUpLeftThumb);
    document.addEventListener('mousemove', handleMouseMoveRightThumb);
    document.addEventListener('mouseup', handleMouseUpRightThumb);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMoveLeftThumb);
      document.removeEventListener('mouseup', handleMouseUpLeftThumb);
      document.removeEventListener('mousemove', handleMouseMoveRightThumb);
      document.removeEventListener('mouseup', handleMouseUpRightThumb);
    };
  }, [handleMouseMove, handleMouseUp, handleMouseMoveLeftThumb, handleMouseUpLeftThumb, handleMouseMoveRightThumb, handleMouseUpRightThumb]);

  return (
  
  
    <>
     <div className="slider-container">
      {type === 'multi' ? (
        <div className='cont'>
        
        
        <div className="slider" ref={trackRef}>
        {/*  <input
            type="range"
            min={min}
            max={max}
            value={minVal}
            onMouseDown={()=>setIsDragging(false)}
            onChange={(e) => 
              {const val = Math.round(Number(e.target.value));
                if(val >= maxVal)
                {
                  setMinVal(maxVal);
                  setMaxVal(val);
                }
                else
                {
                  setMinVal(val);
                }
                console.log("min: " + minVal);
                console.log("max: " + maxVal);

              }
            }
            className="thumb thumb--left"
          /> */}
         <Thumb ref={leftThumbRef} onMouseDown={handleMouseDownLeftThumb}/>
        {/* <input
            type="range"
            min={min}
            max={max}
            value={maxVal}
            onChange={(e) => 
              {const val = Math.round(Number(e.target.value));
                if(val <= minVal)
                {
                  setMaxVal(minVal);
                  setMinVal(val);
                }
                else
                {
                  setMaxVal(val);
                }
              }
            }
           className="thumb thumb--right"
          />  */}
          <Thumb ref={rightThumbRef} onMouseDown={handleMouseDownRightThumb}/>
          <div className="slider__track">
            <div
              ref={rangeRef}
              className="slider__range"
              style={{ cursor: isDragging ? 'grabbing' : 'grab', backgroundColor: rangeColor || 'red' }}
              onMouseDown={handleMouseDown}
            ></div>
          </div>
          <div className="slider__left-value">{Math.round(minVal)}</div>
          <div className="slider__right-value">{Math.round(maxVal)}</div>
        </div>
        </div>
      )
      : 
      ( <input
        type="range"
        min={min}
        max={max}
        step={30}
        value={minVal}
        onChange={(e) => setMinVal(Math.round(Number(e.target.value)))}
      />)}
    </div>
    </>

  )
}

export default Slider