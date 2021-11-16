import React from 'react';
import {styled} from '@mui/material/styles';
import {defineMessages, useIntl} from 'react-intl';
import Popper from '@mui/material/Popper';

const PREFIX = 'SCFeedObjectReportMenu';

const classes = {
  popper: `${PREFIX}-popper`,
  paper: `${PREFIX}-paper`,
  footer: `${PREFIX}-footer`,
  item: `${PREFIX}-item`,
  itemText: `${PREFIX}-itemText`,
  selectedIcon: `${PREFIX}-selectedIcon`
};

const Root = styled(Popper, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  zIndex: 2,

  [`& .${classes.paper}`]: {
    maxWidth: 260,
    padding: '10px 20px'
  },

  [`& .${classes.footer}`]: {
    marginTop: 10
  },

  [`& .${classes.item}`]: {
    borderBottom: '1px solid #e5e5e5'
  },

  [`& .${classes.itemText}`]: {
    marginLeft: 7
  },

  [`& .${classes.selectedIcon}`]: {
    marginLeft: -17,
    minWidth: 25,
    '& svg': {
      fontSize: '1.2rem'
    }
  }
}));

const messages = defineMessages({
  title: {
    id: 'feedObject.reportingMenu.title',
    defaultMessage: 'feedObject.reportingMenu.title'
  },
  spam: {
    id: 'feedObject.reportingMenu.spam',
    defaultMessage: 'feedObject.reportingMenu.spam'
  },
  aggressive: {
    id: 'feedObject.reportingMenu.aggressive',
    defaultMessage: 'feedObject.reportingMenu.aggressive'
  },
  vulgar: {
    id: 'feedObject.reportingMenu.vulgar',
    defaultMessage: 'feedObject.reportingMenu.vulgar'
  },
  poorContent: {
    id: 'feedObject.reportingMenu.poorContent',
    defaultMessage: 'feedObject.reportingMenu.poorContent'
  },
  offtopic: {
    id: 'feedObject.reportingMenu.offtopic',
    defaultMessage: 'feedObject.reportingMenu.offtopic'
  },
  footer: {
    id: 'feedObject.reportingMenu.footer',
    defaultMessage: 'feedObject.reportingMenu.footer'
  }
});

export default function ReportingFlagMenu(props): JSX.Element {
  const intl = useIntl();
  return <React.Fragment></React.Fragment>;
}
