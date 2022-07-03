import { useRef } from 'react';

export const useId = () => {
  const id = useRef(`id_${Math.random().toString(16).split('.').pop()}`);
  return id.current;
};
