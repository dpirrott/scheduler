import React from 'react';
import 'components/InterviewerList.scss';
import InterviewerListItem from './InterviewerListItem';

export default function InterviewerList({ value, onChange }) {
  const interviewerListItems = props.interviewers.map(
    ({ id, name, avatar }) => {
      return (
        <InterviewerListItem
          key={id}
          name={name}
          avatar={avatar}
          selected={id === value}
          setInterviewer={() => onChange(id)}
        />
      );
    }
  );

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewerListItems}</ul>
    </section>
  );
}
