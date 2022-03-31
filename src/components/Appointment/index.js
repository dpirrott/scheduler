import React from 'react';
import 'components/Appointment/styles.scss';
import Form from './Form';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';

import useVisualMode from 'hooks/useVisualMode';

// Various display modes for the appointment component
const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const DELETING = 'DELETING';
const CONFIRM = 'CONFIRM';
const EDIT = 'EDIT';
const ERROR_DELETE = 'ERROR_DELETE';
const ERROR_SAVE = 'ERROR_SAVE';

export default function Appointment({
  id,
  time,
  interview,
  interviewers,
  bookInterview,
  cancelInterview,
}) {
  /**
   * Destructure state handler for appointment display modes.
   *
   * 'transition' - Function to set next state
   * 'back' - Function to go to previous state
   * 'mode' - Current display state
   */
  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);

  /**
   * Book interview with users form inputted data.
   * Initiate saving transition while bookInterview is
   * working on submitting data to server.
   *
   * @param {String} name
   * @param {Number} interviewer
   */
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    bookInterview(id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE));
  };

  /**
   * Delete previously booked interview.
   * User has already confirmed deletion prior to this function
   * being called.
   * A deleting status icon will show while cancelInterview
   * works on removing the current appointment from the server.
   */
  const cancel = () => {
    transition(DELETING);
    cancelInterview(id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true));
  };

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === EDIT && (
        <Form
          student={interview.student}
          interviewer={interview.interviewer.id}
          interviewers={interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message="Saving..." />}
      {(mode === ERROR_SAVE || mode === ERROR_DELETE) && (
        <Error onClose={() => back()} />
      )}
      {mode === CONFIRM && (
        <Confirm
          onCancel={() => transition(SHOW)}
          onConfirm={() => cancel()}
          message="Are you sure you want to delete this interview?"
        />
      )}
      {mode === DELETING && <Status message="Deleting..." />}
    </article>
  );
}
