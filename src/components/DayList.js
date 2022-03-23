import React from 'react';
import DayListItem from 'components/DayListItem';

export default function DayList({ value, days, onChange }) {
  const listDays = () => {
    return days.map(({ id, name, spots }) => {
      return (
        <DayListItem
          key={id}
          name={name}
          spots={spots}
          selected={name === value}
          setDay={onChange}
        />
      );
    });
  };

  return <ul>{listDays()}</ul>;
}
