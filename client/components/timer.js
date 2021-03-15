import React from 'react';

const Timer = (props) => {
  if (!props.running) {
    return (
      <div>
        <input
          type="radio"
          value="5"
          onClick={props.setSessionLength}
          name="sessionLength"
        />
        15 minutes
        <input
          type="radio"
          value="30"
          onClick={props.setSessionLength}
          name="sessionLength"
        />
        30 minutes
        <input
          type="radio"
          value="60"
          onClick={props.setSessionLength}
          name="sessionLength"
        />
        60 minutes
        <input
          type="radio"
          value="90"
          onClick={props.setSessionLength}
          name="sessionLength"
          defaultChecked
        />
        90 minutes
        <select name="tag" value={props.currentTag} onChange={props.setTag}>
          <option value="Any" name="tag">
            Any
          </option>
          {props.tags.length &&
            props.tags.map((tag) => (
              <option value={tag.tag} name="tag" key={tag.id}>
                {tag.tag}
              </option>
            ))}
        </select>
        <button type="button" onClick={props.startTimer}>
          Start
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <p>
          {props.start.toTimeString()} - {props.end}
        </p>
        <p>{props.sessionLength}</p>
        <p>
          {Math.floor(props.current / 60)}:{props.current % 60}
        </p>
      </div>
    );
  }
};

export default Timer;
