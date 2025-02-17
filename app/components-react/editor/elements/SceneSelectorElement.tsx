import React, { useRef } from 'react';
import SceneSelector from './SceneSelector';
import useBaseElement from './hooks';

export default function SceneSelectorElement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { renderElement } = useBaseElement(<SceneSelector />, { x: 0, y: 0 }, containerRef.current);

  return (
    <div
      ref={containerRef}
      data-name="SceneSelector"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {renderElement()}
    </div>
  );
}
