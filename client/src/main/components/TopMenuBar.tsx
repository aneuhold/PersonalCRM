import React, { useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import {
  AppBar,
  WithStyles,
  Theme,
  createStyles,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  withStyles,
} from '@material-ui/core';

function styles(theme: Theme) {
  return createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
  });
}

type TopMenuBarProps = WithStyles<typeof styles>;

function TopMenuBar(props: TopMenuBarProps): JSX.Element {
  const { classes } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);

  function createDrawerOpenHandler(open: boolean) {
    return (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawerOpen(open);
    };
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={createDrawerOpenHandler(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Personal CRM
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={createDrawerOpenHandler(false)}
      />
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(TopMenuBar);
