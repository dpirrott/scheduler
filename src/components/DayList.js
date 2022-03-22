import React from 'react';
import DayListItem from 'components/DayListItem';

export default function DayList(props) {
  const listDays = () => {
    return props.days.map((day) => {
      return (
        <DayListItem
          key={day.id}
          name={day.name}
          selected={day.name === props.day}
          setDay={props.setDay}
        />
      );
    });
  };

  return <ul>{listDays()}</ul>;
}
