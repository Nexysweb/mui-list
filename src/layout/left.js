import React from 'react';

import { Link } from 'react-router-dom';
import { list } from '../table';

import {
  List, ListItem, ListItemText, Divider,
  Drawer,
  IconButton,
}  from '@material-ui/core';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { ChevronLeft as ChevronLeftIcon } from '@material-ui/icons';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },

  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },

}));

const mainListItems = list.map(l => <Link to={l.path}>
    <ListItem button>
      <ListItemText primary={l.label} />
    </ListItem>
  </Link>);

export default props => {
  const { onClose, open } = props;
  const classes = useStyles();

  const handleDrawerClose = () => {
    onClose();
  };
  return <Drawer
    variant="permanent"
    classes={{
      paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
    }}
    open={open}
  >
    <div className={classes.toolbarIcon}>
      <IconButton onClick={handleDrawerClose}>
        <ChevronLeftIcon />
      </IconButton>
    </div>
    <Divider />
    <List>{mainListItems}</List>

  </Drawer>
}