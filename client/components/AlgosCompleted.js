import React from 'react';
import { calculateTimeToDisplay } from './Problem';

const AlgosCompleted = (props) => {
  return (
    <div>
      <p>Number Completed today: {props.completedproblems.length}</p>
      {props.completedproblems.length &&
        props.completedproblems.map((algo) => {
          let time = calculateTimeToDisplay(algo.time);
          return (
            <p key={algo.id}>
              {algo.title} - Level: {algo.level}, Time To solve: {time}, Average
              Percentile: {algo.average_precentile}
            </p>
          );
        })}
    </div>
  );
};

export default AlgosCompleted;
