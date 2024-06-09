import React, { useState, useRef, useEffect, useCallback, forwardRef } from 'react'
import styled from 'styled-components';

interface SliderProps {
  rangeColor?: string;
  type?: 'multi' | 'single';
  min: number;
  max: number;
  step?: number;
  defaultValue?: {
    min: number;
    max: number;
  }
}

/*
  customize handles (wrap inputs inside custom component)
  think of min-max-step optimalizations
  sometimes dragging event prevents thumb movement
  add onchange as a prop to help view current value
  + min max geçiş
  text highlight
  + refs -> tooltip absolute
  controlled component
  custom renderers
  tests
  publish as npm package
*/

interface ThumbProps {
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  displayValue: number;
  showTooltip: boolean;
}

const Handle = styled.div`
  position: absolute;
  margin-top: 2px;
  transform: translate(-50%, -50%);
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

const Tooltip = styled.div`
  position: absolute;
  bottom: 20px;
  transform: translate(-50%, -50%);
  background-color: black;
  color: white;
  padding: 5px;
  border-radius: 3px;
  font-size: 12px;
  white-space: nowrap;
  visibility: hidden;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }
`;

export const Thumb = forwardRef<HTMLDivElement, ThumbProps>((props, ref) => (
    <div style={{position: 'relative', transform: 'none'  }} ref={ref}>
      <Handle onMouseDown={props.onMouseDown} onMouseUp={props.onMouseUp}/>
      <Tooltip style={{ visibility: props.showTooltip ? 'visible' : 'hidden'}} >
        {props.displayValue}
      </Tooltip>
    </div>
));



export const Slider = ({ rangeColor, type = 'single', min, max, step = 1, defaultValue={min: min, max:max}}: SliderProps) => {

  const [values, setValues] = useState(defaultValue);
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
  const [showLeftTooltip, setShowLeftTooltip] = useState(false);
  const [showRightTooltip, setShowRightTooltip] = useState(false);
  const [showIndexLeft, setShowIndexLeft] = useState(0);
  const [showIndexRight, setShowIndexRight] = useState(1);


  const getPercent = useCallback((value: number) => ((value - min) / (max - min)) * 100, [min, max]);

  const updateRangeStyle = () => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);
    if (rangeRef.current) {
      if(type === "multi")
      {
        rangeRef.current.style.left = `${minPercent}%`;
        rangeRef.current.style.width = `${maxPercent - minPercent}%`;
      }
      else
      {
        rangeRef.current.style.left = `${0}%`;
        rangeRef.current.style.width = `${minPercent}%`;
      }
    }
    if (leftThumbRef.current) {
      leftThumbRef.current.style.left = `${minPercent}%`;
    }
    if (rightThumbRef.current) {
      rightThumbRef.current.style.left = `${maxPercent}%`;
    }
  };

  useEffect(() => {
    updateRangeStyle();
    setValues({min: minVal, max: maxVal});
    console.log({min: minVal, max: maxVal});

  }, [minVal, maxVal]);


  const handleMouseDownTrack = (e: React.MouseEvent) => {
    if (showLeftTooltip || showRightTooltip) {
      setShowLeftTooltip(false);
      setShowRightTooltip(false);
    }
    setIsDraggingLeftThumb(false);
    setIsDraggingRightThumb(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(!isDragging);
    setStartX(e.clientX);
    console.log("you clicked range");
    setShowLeftTooltip(!showLeftTooltip);
    setShowRightTooltip(!showRightTooltip);
  };

  const handleMouseDownLeftThumb = (e: React.MouseEvent) => {
    setIsDraggingLeftThumb(true);
    setStartXLeft(e.clientX);
    console.log("you clicked left thumb")
    setShowLeftTooltip(!showLeftTooltip);
    setShowRightTooltip(false);

  };

  const handleMouseDownRightThumb = (e: React.MouseEvent) => {
    setIsDraggingRightThumb(true);
    setStartXRight(e.clientX);
    console.log("you clicked right thumb")
    setShowLeftTooltip(false);
    setShowRightTooltip(!showRightTooltip);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && rangeRef.current && trackRef.current) {
      console.log("you moved range")
      setShowLeftTooltip(true);
      setShowRightTooltip(true);

      const dx = e.clientX - startX;
      const trackWidth = trackRef.current.clientWidth;
      const newMin = Math.round(Math.max(min, Math.min(max - (maxVal - minVal), minVal + (dx / trackWidth * (max - min)))));
      const newMax = newMin + (maxVal - minVal);
      const steppedMin = Math.round(newMin / step) * step;
      const steppedMax = Math.round(newMax / step) * step;

      setMinVal(steppedMin);
      setMaxVal(steppedMax);
      setStartX(e.clientX);
     
    }
  };

  const handleMouseMoveLeftThumb = (e: MouseEvent) => {
    if (isDraggingLeftThumb && leftThumbRef.current && trackRef.current) {
      console.log("you moved range with left")

      const dx = e.clientX - startXLeft;
      const trackWidth = trackRef.current.clientWidth;
      const newMin = Math.round(Math.max(min, Math.min(max, minVal + (dx / trackWidth) * (max - min))));
      const steppedMin = Math.round(newMin / step) * step;
      if (steppedMin > maxVal) {
        setMinVal(maxVal);
        setShowIndexLeft(1);
        setShowIndexRight(0);
        setMaxVal(steppedMin);
      }
      else {
        setMinVal(steppedMin);
      }

      console.log("new min:" + newMin);
      setStartXLeft(e.clientX);
      setShowLeftTooltip(true);
    }
  };


  const handleMouseMoveRightThumb = (e: MouseEvent) => {
    if (isDraggingRightThumb && rightThumbRef.current && trackRef.current) {
      console.log("you moved range with right");

      const dx = e.clientX - startXRight;
      const trackWidth = trackRef.current.clientWidth;
      const newMax = Math.round(Math.min(max, Math.max(min, maxVal + (dx / trackWidth) * (max - min))));
      const steppedMax = Math.round(newMax / step) * step;

      if (steppedMax <= minVal) {
        setMaxVal(minVal);
        setShowIndexLeft(showIndexLeft == 1 ? 0 : 1);
        setShowIndexRight(showIndexRight == 1 ? 0 : 1);
        setMinVal(steppedMax);
      }
      else {
        console.log("sıctınrq ")
        setMaxVal(steppedMax);

      }
      setStartXRight(e.clientX);
      console.log("new max:" + newMax);
      setShowRightTooltip(true);

    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDraggingLeftThumb(false);
    setIsDraggingRightThumb(false);
    setShowLeftTooltip(false);
    setShowRightTooltip(false);
  };

  const handleMouseUpLeftThumb = () => {
    setIsDraggingLeftThumb(false);
    setShowLeftTooltip(false);
  };


  const handleMouseUpRightThumb = () => {
    setIsDraggingRightThumb(false);
    setShowRightTooltip(false);
  };

  useEffect(() => {
    const handleDocumentMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMouseMove(e);
      if (isDraggingLeftThumb) handleMouseMoveLeftThumb(e);
      if (isDraggingRightThumb) handleMouseMoveRightThumb(e);
    };
    

    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isDraggingLeftThumb, isDraggingRightThumb]);

  return (


    <>
      <div className="slider-container">
        {type === 'multi' ? (
          <div className='cont'>

            <div className="slider" ref={trackRef}>
              <Thumb ref={showIndexLeft == 0 ? leftThumbRef : rightThumbRef} onMouseDown={showIndexLeft == 0 ? handleMouseDownLeftThumb : handleMouseDownRightThumb} onMouseUp={handleMouseUpLeftThumb} displayValue={showIndexLeft == 0? minVal : maxVal} showTooltip={showIndexLeft == 0 ? showLeftTooltip : showRightTooltip} />
              <Thumb ref={showIndexRight == 0 ? leftThumbRef : rightThumbRef} onMouseDown={showIndexRight == 0 ? handleMouseDownLeftThumb : handleMouseDownRightThumb} onMouseUp={handleMouseUpRightThumb} displayValue={showIndexRight == 0? minVal : maxVal} showTooltip={showIndexRight == 0 ? showLeftTooltip : showRightTooltip} />
              <div className="slider__track" onMouseDown={handleMouseDownTrack}>
                <div
                  ref={rangeRef}
                  className="slider__range"
                  style={{ cursor: isDragging ? 'grabbing' : 'grab', backgroundColor: rangeColor || 'blue' }}
                  onMouseDown={handleMouseDown}
                ></div>
              </div>
              <div className="slider__left-value">{Math.round(minVal)}</div>
              <div className="slider__right-value">{Math.round(maxVal)}</div>
            </div>
          </div>
        )
          :
          (<div className='cont'>
            <div className="slider" ref={trackRef}>
            <Thumb ref={showIndexLeft == 0 ? leftThumbRef : rightThumbRef} onMouseDown={showIndexLeft == 0 ? handleMouseDownLeftThumb : handleMouseDownRightThumb} onMouseUp={handleMouseUpLeftThumb} displayValue={showIndexLeft == 0? minVal : maxVal} showTooltip={showIndexLeft == 0 ? showLeftTooltip : showRightTooltip} />
            <div className="slider__track" onMouseDown={handleMouseDownTrack}>
                <div
                  ref={rangeRef}
                  className="slider__range"
                  style={{ backgroundColor: rangeColor || 'blue' }}
                  onMouseDown={handleMouseDown}
                ></div>
              </div>
              <div className="slider__left-value">{Math.round(minVal)}</div>
              <div className="slider__right-value">{Math.round(maxVal)}</div>
            </div>
          </div>)}
      </div>
    </>

  )
}

export default Slider