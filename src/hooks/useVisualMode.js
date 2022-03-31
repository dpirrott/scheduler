import { useState } from 'react';

// Custom hook for setting the appoinments current state
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  /**
   * Simple method for setting the next visual mode (newMode).
   * By default, newMode will be added to the end of the history.
   * If replace == true, newMode will replace the last history element.
   *
   * @param {String} newMode
   * @param {Boolean} replace
   */
  const transition = (newMode, replace = false) => {
    setHistory([...(replace ? history.slice(0, -1) : history), newMode]);
    setMode(newMode);
  };

  /**
   * Method for reverting to the previous mode, usually
   * called when the user tries to cancel their current action.
   */
  const back = () => {
    if (history.length > 1) {
      setHistory([...history.slice(0, -1)]);
      setMode(history[history.length - 2]);
    }
  };

  return { mode, transition, back };
}
