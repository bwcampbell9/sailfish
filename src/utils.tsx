import { useCallback, useEffect, useRef, useState } from "react";

export function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const firstDebounce = useRef(true);
  
    useEffect(() => {
      if (value && firstDebounce.current) {
        setDebouncedValue(value);
        firstDebounce.current = false;
        return;
      }
  
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      return () => clearTimeout(handler);
    }, [value, delay]);
  
    return debouncedValue;
}

export function useIsMounted() {
    const isMounted = useRef(false)
  
    useEffect(() => {
      isMounted.current = true
  
      return () => {
        isMounted.current = false
      }
    }, [])
  
    return useCallback(() => isMounted.current, [])
  }