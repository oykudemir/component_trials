import { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react'

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
*/
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
        zIndex: 1,
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
  const [startX, setStartX] = useState(0);
  const rangeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [showMin, setShowMin] = useState(false);

  const getPercent = useCallback((value: number) => ((value - min) / (max - min)) * 100, [min, max]);

  const updateRangeStyle = () => {
    if (rangeRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxVal);
      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  };

  useEffect(() => {
    updateRangeStyle();
  }, [minVal, maxVal]);


  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && rangeRef.current && trackRef.current) {
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <>
     <div className="slider-container">
      {type === 'multi' ? (
        <div className='cont'>
{/*          { isDragging ? <p>hiiii</p> : <></>}
 */}        <div className="slider" ref={trackRef}>
          <input
            type="range"
            min={min}
            max={max}
            value={minVal}

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
          />
          <input
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
          />
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