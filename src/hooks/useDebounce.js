import { useState, useEffect } from 'react';

/**
 * useDebounce — delays updating a value until after a delay period
 * Useful for search inputs to avoid excessive API calls
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
