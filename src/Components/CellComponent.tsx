import React from "react";

// a component that will render a single cell.
// the cell has a value and a label
// the cell has a class name
// the cell has a click handler
// the cell has a style
// the cell has a value
// the cell has a label



interface CellProps {
  value: string;
  label: string;
  className: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  style: React.CSSProperties;
  editor?: string
} // interface CellProps

function Cell({ value, label, className, onClick, style, editor }: CellProps) {
  return (
    <button className={className} onClick={onClick} style={style} value={value}>
      {label}
      {editor && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)', 
            padding: '3px',
            borderRadius: '3px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {editor}
        </div>
      )}
    </button>
  );
} // Cell

export default Cell;