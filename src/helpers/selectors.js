export function getAppointmentsForDay(state, day) {
  const dayInfo = state.days.filter((checkDay) => checkDay.name === day);
  if (dayInfo.length === 0 || state.days.length === 0) {
    return [];
  }

  const dayAppointments = dayInfo[0].appointments;

  return Object.values(state.appointments).filter((appointment) => {
    for (const appt of dayAppointments) {
      if (appointment.id === appt) {
        return true;
      }
    }
    return false;
  });
}
