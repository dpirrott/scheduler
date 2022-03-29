import { useState, useEffect } from 'react';

import axios from 'axios';

export default function useApplicationData() {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: [...all[0].data],
        appointments: { ...all[1].data },
        interviewers: { ...all[2].data },
      }));
    });
  }, []);

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios.put(`/api/appointments/${id}`, { ...appointment }).then(() => {
      const days = updateSpots(state.days, id);
      setState({ ...state, appointments, days });
    });
  };

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios.delete(`/api/appointments/${id}`).then(() => {
      const days = updateSpots(state.days, id, false);
      setState({ ...state, appointments, days });
    });
  };

  const updateSpots = (days, id, add = true) => {
    let count;
    for (const day of days) {
      count = 0;
      for (const appt of day.appointments) {
        if (appt === id) {
          count = day.spots + (add ? -1 : 1);
          const dayUpdated = {
            ...day,
            spots: count,
          };
          return days.map((checkDay) => {
            if (checkDay.id === day.id) {
              return dayUpdated;
            }
            return checkDay;
          });
        }
      }
    }
  };

  return { state, setDay, bookInterview, cancelInterview };
}
