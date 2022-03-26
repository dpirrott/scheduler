import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setHistory([...(replace ? history.slice(0, -1) : history), newMode]);
    setMode(newMode);
  };

  const back = () => {
    if (history.length > 1) {
      const rmHistory = history;
      rmHistory.pop();
      setHistory(rmHistory);
      setMode(rmHistory[rmHistory.length - 1]);
    }
  };

  return { mode, transition, back };
}
