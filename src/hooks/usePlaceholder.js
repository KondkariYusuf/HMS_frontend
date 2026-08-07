/**
 * @file usePlaceholder.js
 * @description Example placeholder custom hook for future state/API integrations.
 */
import { useState } from 'react';

export function usePlaceholder(initialValue = null) {
  const [value, setValue] = useState(initialValue);
  return [value, setValue];
}

export default usePlaceholder;
