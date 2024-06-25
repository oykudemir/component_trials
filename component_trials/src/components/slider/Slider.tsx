import React, { useState, useRef, useEffect, useCallback} from 'react'
import { Thumb } from './Thumb';
import styled from 'styled-components';

const SliderContainer = styled.div`
  position: relative;
  width: 200px;
  display: flex;
  flex-direction: row;
`;

const SliderTrack = styled.div`
  border-radius: 3px;
  height: 5px;
  position: absolute;
  background-color: #ced4da;
  width: 100%;
  z-index: 1;
`;

const SliderRange = styled.div`
  position: absolute;
  background-color: black;
  z-index: 2;
  border-radius: 3px;
  height: 5px;
  &::hover {
  cursor: pointer;
  }

`;

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
  HandleRenderer?: React.FC;
  TooltipRenderer?: React.FC;
  style?: React.CSSProperties;

}

export const Slider = ({ rangeColor, type = 'single', min, max, step = 1, value = { min: min, max: max }, onChange, 
HandleRenderer, TooltipRenderer, style }: SliderProps) => {

  const [minVal, setMinVal] = useState(min + Math.round((value.min - min) / step) * step);
  const [maxVal, setMaxVal] = useState(min + Math.round((value.max - min) / step) * step);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbOneVal, setThumbOneVal] = useState(min + Math.round((value.min - min) / step) * step);
  const [thumbTwoVal, setThumbTwoVal] = useState(min + Math.round((value.max - min) / step) * step);
  const [isDraggingThumbOne, setIsDraggingThumbOne] = useState(false);
  const [isDraggingThumbTwo, setIsDraggingThumbTwo] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startXOne, setStartXOne] = useState(0);
  const [startXTwo, setStartXTwo] = useState(0);
  const rangeRef = useRef<HTMLDivElement>(null);
  const thumbOneRef = useRef<HTMLDivElement>(null);
  const thumbTwoRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [showTooltipOne, setShowTooltipOne] = useState(false);
  const [showTooltipTwo, setShowTooltipTwo] = useState(false);

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
    updateRangeStyle();

  }, [thumbOneVal, thumbTwoVal]);



  const handleMouseDownTrack = () => {
    setIsDraggingThumbOne(false);
    setIsDraggingThumbTwo(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTooltipOne(true);
    setShowTooltipTwo(true);
    setIsDragging(!isDragging);
    setStartX(e.clientX);
    console.log("you clicked range");
  };

  const handleMouseDownFirstThumb = (e: React.MouseEvent) => {
    e.preventDefault();

    setIsDraggingThumbOne(true);
    setStartXOne(e.clientX);
    console.log("you clicked left thumb")
  };

  const handleMouseDownSecondThumb = (e: React.MouseEvent) => {
    e.preventDefault();

    setIsDraggingThumbTwo(true);
    setStartXTwo(e.clientX);
    console.log("you clicked right thumb")
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();

    if (isDragging && rangeRef.current && trackRef.current) {
      console.log("you moved range")
      setShowTooltipOne(true);
      setShowTooltipTwo(true);

      const dx = e.clientX - startX;
      const trackWidth = trackRef.current.clientWidth;
      const newMin = Math.round(Math.max(min, Math.min(max - (maxVal - minVal), minVal + (dx / trackWidth * (max - min)))));
      const newMax = newMin + ((maxVal > (min + Math.floor((max - min) / step) * step) ? (min + Math.floor((max - min) / step) * step) : maxVal) - minVal);
      const steppedMin = (min + Math.round((newMax - min) / step) * step > max ? (min + Math.round((newMin - min - step) / step) * step) :
        (min + Math.round((newMin - min) / step) * step));
      const steppedMax = min + Math.round((newMax - min) / step) * step > max ? (min + Math.round((newMax - min - step) / step) * step) : (min + Math.round((newMax - min) / step) * step);

      if (thumbOneVal > thumbTwoVal) {
        setThumbOneVal(steppedMax);
        setThumbTwoVal(steppedMin);
        setMinVal(steppedMin);
        setMaxVal(steppedMax);
        onChange({ min: steppedMin, max: steppedMax });
      }
      else {
        setThumbOneVal(steppedMin);
        setThumbTwoVal(steppedMax);
        setMinVal(steppedMin);
        setMaxVal(steppedMax);
        onChange({ min: steppedMin, max: steppedMax });
      }
      setStartX(e.clientX);

    }
  };

  const handleMouseMoveThumb = (e: MouseEvent, thumbNo: number) => {
    e.preventDefault();

    if (thumbNo == 1 && isDraggingThumbOne && thumbOneRef.current && trackRef.current) {
      console.log("you moved range with one")
      setShowTooltipOne(true);

      const dx = e.clientX - startXOne;
      const trackWidth = trackRef.current.clientWidth;
      const newVal = Math.round(Math.max(min, Math.min(max, thumbOneVal + (dx / trackWidth) * (max - min))));
      const steppedVal = (max - (min + Math.floor((newVal - min) / step) * step) < step ? newVal : min + Math.floor((newVal - min) / step) * step);

      setThumbOneVal(steppedVal);
      setStartXOne(e.clientX);
      if (steppedVal > thumbTwoVal) {
        setMinVal(thumbTwoVal);
        setMaxVal(steppedVal);
        onChange({ min: thumbTwoVal, max: steppedVal });
      }
      else {
        setMinVal(steppedVal);
        setMaxVal(thumbTwoVal);
        onChange({ min: steppedVal, max: thumbTwoVal });
      }
    }
    else if (thumbNo == 2 && isDraggingThumbTwo && thumbTwoRef.current && trackRef.current) {
      console.log("you moved range with two")
      setShowTooltipTwo(true);

      const dx = e.clientX - startXTwo;
      const trackWidth = trackRef.current.clientWidth;
      const newVal = Math.round(Math.max(min, Math.min(max, thumbTwoVal + (dx / trackWidth) * (max - min))));
      const steppedVal = (max - (min + Math.floor((newVal - min) / step) * step) < step ? newVal : min + Math.floor((newVal - min) / step) * step);
      setThumbTwoVal(steppedVal);
      setStartXTwo(e.clientX);
      if (steppedVal > thumbOneVal) {
        setMinVal(thumbOneVal);
        setMaxVal(steppedVal);
        onChange({ min: thumbOneVal, max: steppedVal });
      }
      else {
        setMinVal(steppedVal);
        setMaxVal(thumbOneVal);
        onChange({ min: steppedVal, max: thumbOneVal });
      }
    }

  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setShowTooltipOne(false);
    setShowTooltipTwo(false);
    setIsDraggingThumbOne(false);
    setIsDraggingThumbTwo(false);
  };

  const handleMouseUpFirstThumb = () => {
    setIsDraggingThumbOne(false);
    setShowTooltipOne(false);

  };


  const handleMouseUpSecondThumb = () => {
    setIsDraggingThumbTwo(false);
    setShowTooltipTwo(false);

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
      <div>
        {type === 'multi' ? (
          <div>

            <SliderContainer style={style} ref={trackRef}>
              <Thumb ref={thumbOneRef} onMouseDown={handleMouseDownFirstThumb}
                onMouseUp={handleMouseUpFirstThumb} displayValue={thumbOneVal}
                showTooltip={showTooltipOne} setShowTooltip={setShowTooltipOne}
                HandleRenderer={HandleRenderer} TooltipRenderer={TooltipRenderer}
              />
              <Thumb ref={thumbTwoRef} onMouseDown={handleMouseDownSecondThumb}
                onMouseUp={handleMouseUpSecondThumb} displayValue={thumbTwoVal}
                showTooltip={showTooltipTwo} setShowTooltip={setShowTooltipTwo}
                HandleRenderer={HandleRenderer} TooltipRenderer={TooltipRenderer}
              />
              <SliderTrack onMouseDown={handleMouseDownTrack}>
                <SliderRange
                  ref={rangeRef}
                  style={{ cursor: isDragging ? 'grabbing' : 'grab', backgroundColor: rangeColor || 'blue' }}
                  onMouseDown={handleMouseDown}
                ></SliderRange>
              </SliderTrack>
              <div style={{ position: 'absolute', fontSize: '16px', marginTop: '20px', userSelect: 'none' }}>{Math.round(min)}</div>
              <div style={{ position: 'absolute', fontSize: '16px', marginTop: '20px', right: '0px', userSelect: 'none' }}>{Math.round(max)}</div>
            </SliderContainer>
          </div>
        )
          :
          (<div>
            <SliderContainer style={style} ref={trackRef}>
              <Thumb ref={thumbOneRef} onMouseDown={handleMouseDownFirstThumb} onMouseUp={handleMouseUpFirstThumb} displayValue={thumbOneVal}
                showTooltip={showTooltipOne} setShowTooltip={setShowTooltipOne}  HandleRenderer={HandleRenderer} TooltipRenderer={TooltipRenderer}/>
              <SliderTrack>
                <SliderRange
                  ref={rangeRef}
                  style={{ backgroundColor: rangeColor || 'blue' }}
                ></SliderRange>
              </SliderTrack>
              <div style={{ position: 'absolute', fontSize: '16px', marginTop: '20px', userSelect: 'none' }}>{Math.round(min)}</div>
              <div style={{ position: 'absolute', fontSize: '16px', marginTop: '20px', right: '0px', userSelect: 'none' }}>{Math.round(max)}</div>
            </SliderContainer>
          </div>)}
      </div>
    </>

  )
}

export default Slider