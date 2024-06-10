import React, { useState, useRef, useEffect, useCallback, forwardRef } from 'react'
import styled from 'styled-components';

interface ThumbProps {
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  displayValue: number;
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

export const Thumb = forwardRef<HTMLDivElement, ThumbProps>((props, ref) => {

  const [showTooltip, setShowToolTip] = useState(false);

  return (
    <div style={{ position: 'relative', transform: 'none' }} ref={ref}>
      <Handle onMouseDown={(e) => { props.onMouseDown(e); setShowToolTip(true) }} onMouseUp={(e) => { props.onMouseUp(e); setShowToolTip(false) }} />
      <Tooltip style={{ visibility: showTooltip ? 'visible' : 'hidden' }} >
        {props.displayValue}
      </Tooltip>
    </div>
  )
});

interface SliderProps {
  rangeColor?: string;
  type: 'multi' | 'single';
  min: number;
  max: number;
  step?: number;
  value: {
    min: number;
    max: number;
  }
  onChange: (newValue: { min: number; max: number }) => void;
}

export const Slider = ({ rangeColor, type = 'single', min, max, step = 1, value = { min: min, max: max }, onChange }: SliderProps) => {

  const [minVal, setMinVal] = useState(value.min);
  const [maxVal, setMaxVal] = useState(value.max);

  const [isDragging, setIsDragging] = useState(false);

  const [thumbOneVal, setThumbOneVal] = useState(value.min);
  const [thumbTwoVal, setThumbTwoVal] = useState(value.max);

  const [isDraggingThumbOne, setIsDraggingThumbOne] = useState(false);
  const [isDraggingThumbTwo, setIsDraggingThumbTwo] = useState(false);

  const [startX, setStartX] = useState(0);
  const [startXLeft, setStartXLeft] = useState(0);
  const [startXRight, setStartXRight] = useState(0);
  const rangeRef = useRef<HTMLDivElement>(null);
  const thumbOneRef = useRef<HTMLDivElement>(null);
  const thumbTwoRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const getPercent = useCallback((value: number) => ((value - min) / (max - min)) * 100, [min, max]);

  const updateRangeStyle = () => {

    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (rangeRef.current) {
      if (type === "multi") {
        rangeRef.current.style.left = `${minPercent}%`;
        rangeRef.current.style.width = `${maxPercent - minPercent}%`;
      }
      else {
        rangeRef.current.style.left = `${0}%`;
        rangeRef.current.style.width = `${getPercent(thumbOneVal)}%`;
      }
    }
    if (thumbOneRef.current) {
      thumbOneRef.current.style.left = `${getPercent(thumbOneVal)}%`;
    }
    if (thumbTwoRef.current) {
      thumbTwoRef.current.style.left = `${getPercent(thumbTwoVal)}%`;
    } 
  };

  useEffect(() => {
    if(thumbOneVal > thumbTwoVal)
    {
      setMinVal(thumbTwoVal);
      setMaxVal(thumbOneVal);    
      onChange({ min: thumbTwoVal, max: thumbOneVal });
    }
    else
    {
      setMinVal(thumbOneVal);
      setMaxVal(thumbTwoVal);
      onChange({ min: thumbOneVal, max: thumbTwoVal });
    }
    updateRangeStyle();

  }, [thumbOneVal, thumbTwoVal]);



  const handleMouseDownTrack = () => {
    setIsDraggingThumbOne(false);
    setIsDraggingThumbTwo(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(!isDragging);
    setStartX(e.clientX);
    console.log("you clicked range");
  };

  const handleMouseDownLeftThumb = (e: React.MouseEvent) => {
    setIsDraggingThumbOne(true);
    setStartXLeft(e.clientX);
    console.log("you clicked left thumb")
  };

  const handleMouseDownRightThumb = (e: React.MouseEvent) => {
    setIsDraggingThumbTwo(true);
    setStartXRight(e.clientX);
    console.log("you clicked right thumb")
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && rangeRef.current && trackRef.current) {
      console.log("you moved range")

      const dx = e.clientX - startX;
      const trackWidth = trackRef.current.clientWidth;
      const newMin = Math.round(Math.max(min, Math.min(max - (maxVal - minVal), minVal + (dx / trackWidth * (max - min)))));
      const newMax = newMin + (maxVal - minVal);
      const steppedMin = Math.round(newMin / step) * step;
      const steppedMax = Math.round(newMax / step) * step;

/*       setMinVal(steppedMin);
      setMaxVal(steppedMax); */
      if(thumbOneVal > thumbTwoVal)
      {
        setThumbOneVal(steppedMax);
        setThumbTwoVal(steppedMin);
        setMinVal(steppedMin);
        setMaxVal(steppedMax);    
        onChange({ min: steppedMin, max: steppedMax });
      }
      else
      {
        setThumbOneVal(steppedMin);
        setThumbTwoVal(steppedMax);
        setMinVal(steppedMin);
        setMaxVal(steppedMax);
        onChange({ min: steppedMin, max: steppedMax });
      }
      setStartX(e.clientX);

    }
  };

/*   const handleMouseMoveLeftThumb = (e: MouseEvent) => {
    if (isDraggingThumbOne && thumbOneRef.current && trackRef.current) {
      console.log("you moved range with left")

      const dx = e.clientX - startXLeft;
      const trackWidth = trackRef.current.clientWidth;
      const newMin = Math.round(Math.max(min, Math.min(max, minVal + (dx / trackWidth) * (max - min))));
      const steppedMin = Math.round(newMin / step) * step;

      if (steppedMin >= maxVal) {
        setMinVal(maxVal);
        setShowIndexLeft(1);
        setShowIndexRight(0);
        setMaxVal(steppedMin);
      }
      else {
        setMinVal(steppedMin);
      }

      setStartXLeft(e.clientX);
      setShowLeftTooltip(true);
    }
  };


  const handleMouseMoveRightThumb = (e: MouseEvent) => {
    if (isDraggingThumbTwo && thumbTwoRef.current && trackRef.current) {
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
        setMaxVal(steppedMax);

      }
      setStartXRight(e.clientX);
      setShowRightTooltip(true);

    }
  }; */

  const handleMouseMoveThumb = (e: MouseEvent, thumbNo: number) => {
    if (thumbNo == 1 && isDraggingThumbOne && thumbOneRef.current && trackRef.current) {
      console.log("you moved range with one")

      const dx = e.clientX - startXLeft;
      const trackWidth = trackRef.current.clientWidth;
      const newVal = Math.round(Math.max(min, Math.min(max, thumbOneVal + (dx / trackWidth) * (max - min))));
      const steppedVal = Math.round(newVal / step) * step;
      setThumbOneVal(steppedVal);
      setStartXLeft(e.clientX);

    }
    else if (thumbNo == 2 && isDraggingThumbTwo && thumbTwoRef.current && trackRef.current) {
      console.log("you moved range with two")

      const dx = e.clientX - startXRight;
      const trackWidth = trackRef.current.clientWidth;
      const newVal = Math.round(Math.max(min, Math.min(max, thumbTwoVal + (dx / trackWidth) * (max - min))));
      const steppedVal = Math.round(newVal / step) * step;
      setThumbTwoVal(steppedVal);
      setStartXLeft(e.clientX);
      
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDraggingThumbOne(false);
    setIsDraggingThumbTwo(false);
  };

  const handleMouseUpLeftThumb = () => {
    setIsDraggingThumbOne(false);
  };


  const handleMouseUpRightThumb = () => {
    setIsDraggingThumbTwo(false);
  };

  useEffect(() => {
    const handleDocumentMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMouseMove(e);
      if (isDraggingThumbOne) handleMouseMoveThumb(e, 1);
      if (isDraggingThumbTwo) handleMouseMoveThumb(e, 2);
    };


    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isDraggingThumbOne, isDraggingThumbTwo]);

  return (


    <>
      <div className="slider-container">
        {type === 'multi' ? (
          <div className='cont'>

            <div className="slider" ref={trackRef}>
              <Thumb ref={thumbOneRef} onMouseDown={handleMouseDownLeftThumb}
                onMouseUp={handleMouseUpLeftThumb} displayValue={thumbOneVal}
              />
              <Thumb ref={thumbTwoRef} onMouseDown={handleMouseDownRightThumb}
                onMouseUp={handleMouseUpRightThumb} displayValue={thumbTwoVal}
              />
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
              <Thumb ref={thumbOneRef} onMouseDown={handleMouseDownLeftThumb} onMouseUp={handleMouseUpLeftThumb} displayValue={thumbOneVal} />
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