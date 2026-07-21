import { useState, useEffect } from 'react';

export function useKeyPress(targetKey) {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === targetKey) setIsPressed(true);
    }

    function onKeyUp(e) {
      if (e.key === targetKey) setIsPressed(false);
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [targetKey]);

  return isPressed;
}
