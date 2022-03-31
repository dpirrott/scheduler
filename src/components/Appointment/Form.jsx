import React, { useState } from 'react';
import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';

export default function Form(props) {
  const [student, setStudent] = useState(props.student || '');
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState('');
  const { onSave, onCancel, interviewers } = props;

  /**
   * Either clears form data or restores it to it's previous state
   */
  const reset = () => {
    setStudent(props.student || '');
    setInterviewer(props.interviewer || null);
    setError('');
  };

  /**
   * Reset all states then revert to previous visual mode
   */
  const cancel = () => {
    reset();
    onCancel();
  };

  /**
   * Checks if student name field is blank prior to submitting.
   * If blank, trigger error state and cancel the save operation.
   * Otherwise submit student name and interviewer ID for saving.
   */
  const validate = () => {
    if (student === '') {
      setError('Student name cannot be blank');
      return;
    }
    onSave(student, interviewer);
    setError('');
  };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="student"
            type="text"
            placeholder="Enter Student Name"
            value={student}
            onChange={(e) => setStudent(e.target.value)}
            data-testid="student-name-input"
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList
          value={interviewer}
          interviewers={interviewers}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={cancel} danger>
            Cancel
          </Button>
          <Button onClick={() => validate(student, interviewer)} confirm>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
