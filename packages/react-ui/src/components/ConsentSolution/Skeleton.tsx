import React from 'react';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {Box, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`,
  consent: `${PREFIX}-consent`,
  consentSwitch: `${PREFIX}-consent-switch`,
  consentSwitchLabel: `${PREFIX}-consent-switch-label`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS ConsentSolution Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ConsentSolutionSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCConsentSolution-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCConsentSolution-skeleton-root|Styles applied to the root element.|
 |title|.SCConsentSolution-title|Styles applied to the title element.|
 |content|.SCConsentSolution-content|Styles applied to the content element.|
 |consent|.SCConsentSolution-consent|Styles applied to the consent element.|
 |consentSwitch|.SCConsentSolution-consent-switch|Styles applied to the switch skeleton element.|
 |actions|.SCConsentSolution-actions|Styles applied to the actions section.|
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
