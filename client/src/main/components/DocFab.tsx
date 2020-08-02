import React from 'react';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

interface DocFabProps {
  className: string;
}

function DocFab(props: DocFabProps): JSX.Element {
  const { className } = props;
  return (
    <div className={className}>
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </div>
  );
}

export default DocFab;
