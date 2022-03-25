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

export function getInterviewersForDay(state, day) {
  const dayInfo = state.days.filter((checkDay) => checkDay.name === day);
  if (dayInfo.length === 0 || state.days.length === 0) {
    return [];
  }

  const dayInterviewers = dayInfo[0].interviewers;

  return Object.values(state.interviewers).filter((interviewer) => {
    for (const dayInterviewer of dayInterviewers) {
      if (interviewer.id === dayInterviewer) {
        return true;
      }
    }
    return false;
  });
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const interviewerID = interview.interviewer;
  const student = interview.student;
  return {
    student,
    interviewer: state.interviewers[interviewerID],
  };
}
