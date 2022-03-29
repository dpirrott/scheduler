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
      console.log(all[1].data);
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
      const days = updateSpots(state, appointments, id);
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
      const days = updateSpots(state, appointments, id);
      setState({ ...state, appointments, days });
    });
  };

  const updateSpots = (state, appointments, id) => {
    const days = [];
    for (const day of state.days) {
      const count = day.appointments.reduce((prev, curr) => {
        return prev + (appointments[curr].interview ? 0 : 1);
      }, 0);
      days.push({
        ...day,
        spots: count,
      });
    }
    return days;
  };

  return { state, setDay, bookInterview, cancelInterview };
}
