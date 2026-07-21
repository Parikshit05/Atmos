import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function getMatch() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(QUERY).matches;
}

export default function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getMatch);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);

    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
