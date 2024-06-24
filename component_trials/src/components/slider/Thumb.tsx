import React, {forwardRef, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components';

interface ThumbProps {
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  displayValue: number;
  showTooltip: boolean;
  setShowTooltip: Dispatch<SetStateAction<boolean>>;
  HandleRenderer?: React.FC;
  TooltipRenderer?: React.FC;
}

const DefaultHandle = styled.div`
  position: absolute;
  margin-top: 2px;
  transform: translate(-50%, -50%);
  background-color: #f1f5f7;
  border: none;
  border-radius: 50%;
  box-shadow: 0 0 1px 1px #ced4da;
  height: 18px;
  width: 18px;
  z-index: 3;
  margin-left: -1px;
`;

const DefaultTooltip = styled.div`
  background-color: black;
  padding: 12px;
  border-radius: 3px;
  white-space: nowrap;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 8px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }
`;

export const Thumb = forwardRef<HTMLDivElement, ThumbProps>(({
    HandleRenderer = DefaultHandle,
    TooltipRenderer = DefaultTooltip, onMouseDown, onMouseUp,
    showTooltip, setShowTooltip, 
    displayValue }, ref) => {
  
    return (
      <div style={{ position: 'relative', transform: 'none' }} ref={ref}>
        <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: 3, marginLeft: '-1px' }}
          onMouseDown={(e) => { onMouseDown(e); setShowTooltip(true) }} onMouseUp={(e) => { onMouseUp(e); setShowTooltip(false) }}>
          <HandleRenderer/>
        </div>
        <div style={{ position: 'absolute', display: 'inline-block', bottom: '20px', transform: 'translate(-50%, -50%)', visibility: showTooltip ? 'visible' : 'hidden' }}>
          <div style={{ width: '24px', height: '24px', }}>
            <TooltipRenderer/>
          </div>
          <div style={{
            height: '100%',
            position: 'absolute',
            top: '0%',
            left: '50%',
            fontSize: '16px',
            transform: 'translate(-50%, -50%)',
            userSelect: 'none',
            color: 'white',
          }}>
            <p>{displayValue}</p>
          </div>
        </div>
      </div>
    )
  });
  