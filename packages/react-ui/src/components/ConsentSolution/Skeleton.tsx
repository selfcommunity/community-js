import React from 'react';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {Box, DialogActions, DialogContent, DialogTitle} from '@mui/material';

const PREFIX = 'SCConsentSolutionSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`,
  consent: `${PREFIX}-consent`,
  consentSwitch: `${PREFIX}-consent-switch`,
  consentSwitchLabel: `${PREFIX}-consent-switch-label`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.title}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  [`& .${classes.content}`]: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(5)
  },
  [`& .${classes.consent}`]: {
    borderTop: 0,
    overflowY: 'visible',
    display: 'flex'
  },
  [`& .${classes.consentSwitch}`]: {
    width: 64,
    height: 31,
    borderRadius: 22,
    marginRight: theme.spacing()
  },
  [`& .${classes.consentSwitchLabel}`]: {
    marginTop: 23
  }
}));

/**
 * > API documentation for the Community-JS ConsentSolution Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ConsentSolutionSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCConsentSolutionSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCConsentSolutionSkeleton-root|Styles applied to the root element.|
 |title|.SCConsentSolutionSkeleton-title|Styles applied to the title element.|
 |content|.SCConsentSolutionSkeleton-content|Styles applied to the content element.|
 |consent|.SCConsentSolutionSkeleton-consent|Styles applied to the consent element.|
 |consentSwitch|.SCConsentSolutionSkeleton-consent-switch|Styles applied to the switch skeleton element.|
 |actions|.SCConsentSolutionSkeleton-actions|Styles applied to the actions section.|
 *
 */
export default function ConsentSolutionSkeleton(): JSX.Element {
  const ContentSection = () => (
    <>
      <Skeleton animation="wave" height={20} width="100%" />
      <Skeleton animation="wave" height={20} width="80%" />
      <Skeleton animation="wave" height={20} width="60%" />
      <Skeleton animation="wave" height={20} width="30%" />
      <br />
    </>
  );

  return (
    <Root className={classes.root}>
      <DialogTitle className={classes.title}>
        <Skeleton animation="wave" height={25} width="70%" />
      </DialogTitle>
      <DialogContent className={classes.content} dividers>
        {[...Array(2)].map((_, i) => (
          <ContentSection key={i} />
        ))}
      </DialogContent>
      <DialogContent className={classes.consent} dividers>
        <Skeleton height={64} className={classes.consentSwitch} />
        <Skeleton animation="wave" height={20} width="50%" variant={'text'} className={classes.consentSwitchLabel}/>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Skeleton animation="wave" height={40} width="20%" />
      </DialogActions>
    </Root>
  );
}
