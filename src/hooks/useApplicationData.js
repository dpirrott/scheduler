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

  /**
   * Retrieve api information from 3 separate routes using axios.get().
   * Store all the data in the custom hook setState.
   */
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

  /**
   * Used when creating/updating appointment.
   * Updates the appointments state within setState,
   * as well as the days component after running updateSpots.
   *
   * @param {Number} id
   * @param {Object} interview
   * @returns {promise}
   */
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

  /**
   * Used when deleting/cancelling an appointment.
   * Similar to bookInterview in that appointments and
   * days are updated within setState.
   * Days is updated based on the updateSpots function.
   *
   * @param {Number} id
   * @returns {promise}
   */
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

  /**
   * Updates the spots remaining for each day of the week.
   * Efficiency can be improved by targetting a specific day,
   * rather then updating every day.
   *
   * Efficiency didn't seem important considering there's only
   * 25 possible appointments in this project, if there were millions,
   * improvements would be required.
   *
   * @param {Object} state
   * @param {Object} appointments
   * @param {Number} id
   * @returns {Array}
   */
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
