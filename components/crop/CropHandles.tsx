'use client';

import { DragHandle, CornerHandle, EdgeHandle } from '@/lib/crop/types';

interface CropHandlesProps {
  onDragStart: (handle: DragHandle, e: React.MouseEvent | React.TouchEvent) => void;
}

export function CropHandles({ onDragStart }: CropHandlesProps) {
  return (
    <>
      {/* Corner handles - L-shaped brackets */}
      <CornerBracket corner="nw" onDragStart={onDragStart} />
      <CornerBracket corner="ne" onDragStart={onDragStart} />
      <CornerBracket corner="sw" onDragStart={onDragStart} />
      <CornerBracket corner="se" onDragStart={onDragStart} />

      {/* Edge handles - small squares */}
      <EdgeSquare edge="n" onDragStart={onDragStart} />
      <EdgeSquare edge="s" onDragStart={onDragStart} />
      <EdgeSquare edge="e" onDragStart={onDragStart} />
      <EdgeSquare edge="w" onDragStart={onDragStart} />
    </>
  );
}

interface CornerBracketProps {
  corner: CornerHandle;
  onDragStart: (handle: DragHandle, e: React.MouseEvent | React.TouchEvent) => void;
}

function CornerBracket({ corner, onDragStart }: CornerBracketProps) {
  // Position and rotation for each corner
  const config: Record<CornerHandle, {
    position: string;
    rotation: number;
    cursor: string;
  }> = {
    nw: {
      position: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
      rotation: 0,
      cursor: 'nwse-resize',
    },
    ne: {
      position: 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
      rotation: 90,
      cursor: 'nesw-resize',
    },
    se: {
      position: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
      rotation: 180,
      cursor: 'nwse-resize',
    },
    sw: {
      position: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
      rotation: 270,
      cursor: 'nesw-resize',
    },
  };

  const { position, rotation, cursor } = config[corner];

  return (
    <div
      data-testid={`crop-handle-${corner}`}
      className={`absolute ${position} pointer-events-auto`}
      style={{ cursor }}
      onMouseDown={(e) => onDragStart(corner, e)}
      onTouchStart={(e) => onDragStart(corner, e)}
    >
      {/* L-shaped bracket */}
      <div
        className="relative w-6 h-6"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Horizontal arm */}
        <div className="absolute top-0 left-0 w-6 h-1 bg-white shadow-md" />
        {/* Vertical arm */}
        <div className="absolute top-0 left-0 w-1 h-6 bg-white shadow-md" />
      </div>
    </div>
  );
}

interface EdgeSquareProps {
  edge: EdgeHandle;
  onDragStart: (handle: DragHandle, e: React.MouseEvent | React.TouchEvent) => void;
}

function EdgeSquare({ edge, onDragStart }: EdgeSquareProps) {
  // Position and cursor for each edge
  const config: Record<EdgeHandle, {
    position: string;
    cursor: string;
  }> = {
    n: {
      position: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
      cursor: 'ns-resize',
    },
    s: {
      position: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
      cursor: 'ns-resize',
    },
    e: {
      position: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
      cursor: 'ew-resize',
    },
    w: {
      position: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',
      cursor: 'ew-resize',
    },
  };

  const { position, cursor } = config[edge];

  return (
    <div
      data-testid={`crop-handle-${edge}`}
      className={`absolute ${position} pointer-events-auto`}
      style={{ cursor }}
      onMouseDown={(e) => onDragStart(edge, e)}
      onTouchStart={(e) => onDragStart(edge, e)}
    >
      {/* Small square handle */}
      <div className="w-3 h-3 bg-white border border-gray-300 shadow-md" />
    </div>
  );
}
