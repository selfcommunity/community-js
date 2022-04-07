import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {TextField, Typography, Box, Avatar} from '@mui/material';
import {
  Link,
  SCContextType,
  SCIncubatorType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  useSCContext,
  useSCRouting,
  useSCUser
} from '@selfcommunity/core';
import BaseDialog from '../../shared/BaseDialog';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';
import Incubator, {IncubatorProps} from '../Incubator';

const messages = defineMessages({
  intro: {
    id: 'ui.incubatorDetail.intro',
    defaultMessage: 'ui.incubatorDetail.intro'
  }
});

const PREFIX = 'SCIncubatorDetail';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  title: `${PREFIX}-title`,
  author: `${PREFIX}-author`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  margin: 2,
  [theme.breakpoints.down(500)]: {
    minWidth: 300
  },
  [`& .${classes.avatar}`]: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(3)
  },
  [`& .${classes.title}`]: {
    fontSize: '1rem',
    whiteSpace: 'pre-line'
  }
}));

export interface IncubatorDetailProps {
  /**
   * The incubator obj
   * @default null
   */
  incubator?: SCIncubatorType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Opens dialog
   * @default false
   */
  open: boolean;
  /**
   * On dialog close callback function
   * @default null
   */
  onClose?: () => void;
  /**
   * Props to spread to single incubator object
   * @default {}
   */
  IncubatorProps?: IncubatorProps;
  onSubscriptionsUpdate?: (incubator) => any;
}
/**
 * > API documentation for the Community-UI Incubator Detail component. Learn about the available props and the CSS API.
 *
 * #### Import
 ```jsx
 import {IncubatorDetail} from '@selfcommunity/ui';
 ```
 #### Component Name
 The name `SCIncubatorDetail` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCIncubatorDetail-root|Styles applied to the root element.|
 |avatar|.SCIncubatorDetail-avatar|Styles applied to the avatar element.|
 |title|.SCIncubatorDetail-title|Styles applied to the title element.|
 |author|.SCIncubatorDetail-author|Styles applied to the author element.|
* @param inProps
*/
export default function IncubatorDetail(inProps: IncubatorDetailProps): JSX.Element {
  // PROPS
  const props: IncubatorDetailProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {incubator, className, open, onClose, IncubatorProps = {}, onSubscriptionsUpdate, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scContext: SCContextType = useSCContext();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // INTL
  const intl = useIntl();

  if (!scUserContext.user) {
    return null;
  }

  // RENDER
  return (
    <Root
      title={
        <>
          <Avatar className={classes.avatar} alt={incubator.user.avatar} src={incubator.user.avatar} />
          <Box>
            <Typography className={classes.title}>{`${intl.formatMessage(messages.intro, {name: incubator.name})}`} </Typography>
            <Typography component={'span'}>
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, incubator.user)}>@{incubator.user.username}</Link>
            </Typography>
          </Box>
        </>
      }
      open={open}
      onClose={onClose}
      className={classNames(classes.root, className)}
      {...rest}>
      <Box>
        <Incubator elevation={0} incubator={incubator} subscribeButtonProps={{onSubscribe: onSubscriptionsUpdate}} {...IncubatorProps} />
      </Box>
    </Root>
  );
}
