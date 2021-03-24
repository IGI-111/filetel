import { Fragment } from 'react';

function Spinner() {
  return (
    <Fragment>
      <h2 style={{ textAlign: 'center' }}>Setting up</h2>
      <progress className="progress is-large" max="1"></progress>
    </Fragment>
  );
}

export default Spinner;
