import React, { useState } from 'react';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BusinessIcon from '@material-ui/icons/Business';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';

interface DocFabProps {
  className?: string;
}

const actions = [
  { icon: <PersonAddIcon />, name: 'Add Contact' },
  { icon: <PlaylistAddIcon />, name: 'Add Task' },
  { icon: <AssignmentIcon />, name: 'Add Opportunity' },
  { icon: <BusinessIcon />, name: 'Add Manufacturer' },
  { icon: <AccountTreeIcon />, name: 'Add Account' },
];

function DocFab(props: DocFabProps): JSX.Element {
  const { className } = props;
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <SpeedDial
        ariaLabel="Add document"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onOpen={() => {
          setOpen(true);
        }}
        icon={<SpeedDialIcon />}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              setOpen(false);
            }}
          />
        ))}
      </SpeedDial>
    </div>
  );
}

export default DocFab;
