import { useEffect, useState } from "react";

function useDebounce(value, delay = 1000) {
  const [debouncedValue, setdebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setdebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}


export default useDebounce;