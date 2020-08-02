import React from 'react';
import './App.css';
import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';
import TopMenuBar from './components/TopMenuBar';
import DocFab from './components/DocFab';

function styles(theme: Theme) {
  return createStyles({
    fab: {
      position: 'absolute',
      right: theme.spacing(3),
      bottom: theme.spacing(3),
    },
  });
}

type AppProps = WithStyles<typeof styles>;

function App(props: AppProps) {
  const { classes } = props;
  return (
    <div className="App">
      <TopMenuBar />
      <DocFab className={classes.fab} />
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(App);
