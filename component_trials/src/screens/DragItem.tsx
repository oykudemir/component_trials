import React, { useState } from 'react';

const DragItem: React.FC = () => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [offsetX, setOffsetX] = useState<number>(0);

  const itemRef = React.useRef<HTMLDivElement>(null);
  const parentRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setDragging(true);
    setStartX(e.clientX);
    setOffsetX(0);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging && itemRef.current && parentRef.current) {
      const parentWidth = parentRef.current.clientWidth;
      const itemWidth = itemRef.current.clientWidth;
      const maxOffsetX = parentWidth - itemWidth;
      const newOffsetX = Math.max(0, Math.min(maxOffsetX, offsetX + e.clientX - startX));
      setOffsetX(newOffsetX);
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  React.useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offsetX]);

  const leftPercentage = (offsetX / parentRef.current?.clientWidth) * 100 || 0;

  return (
    <div className="drag-parent" ref={parentRef}>
      <div
        className="drag-item"
        ref={itemRef}
        style={{
          left: `${leftPercentage}%`,
          cursor: dragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
      >
        Drag me horizontally
      </div>
    </div>
  );
};

export default DragItem;
