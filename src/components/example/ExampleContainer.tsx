'use client';

import { useState } from 'react';
import ExamplePresentation from './ExamplePresentation';

export default function ExampleContainer() {
  const [count, setCount] = useState<number>(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return <ExamplePresentation count={count} onIncrement={handleIncrement} />;
}
