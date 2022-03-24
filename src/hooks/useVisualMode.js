import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    const addHistory = history;
    if (replace) {
      addHistory[history.length - 1] = newMode;
    } else {
      addHistory.push(newMode);
    }
    setHistory(addHistory);
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
