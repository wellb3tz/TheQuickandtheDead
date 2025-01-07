import React from 'react';
import { useHistory } from 'react-router-dom';

const BackButton = () => {
  const history = useHistory();

  return (
    <button onClick={() => history.goBack()} style={{ fontSize: '12px', cursor: 'pointer' }}>
      ← Back
    </button>
  );
};

export default BackButton;