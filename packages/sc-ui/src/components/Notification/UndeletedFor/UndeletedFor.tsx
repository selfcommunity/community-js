import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import {green, red} from '@mui/material/colors';
import {Link, SCNotificationUnDeletedForType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {FormattedMessage} from 'react-intl';
import {getContributeType, getContributionSnippet, getRouteData} from '../../../utils/contribute';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import classNames from 'classnames';

const PREFIX = 'SCUndeletedForNotification';

const classes = {
  root: `${PREFIX}-root`,
  undeletedIconWrap: `${PREFIX}-undeleted-icon-wrap`,
  undeletedIcon: `${PREFIX}-undeleted-icon`,
  undeletedText: `${PREFIX}-undeleted-text`,
  activeAt: `${PREFIX}-active-at`,
  contributionWrap: `${PREFIX}-contribution-wrap`,
  contributionYouWroteLabel: `${PREFIX}-contribution-you-wrote-label`,
  contributionText: `${PREFIX}-contribution-text`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.undeletedIcon}`]: {
    backgroundColor: red[500],
    color: '#FFF'
  },
  [`& .${classes.undeletedText}`]: {
    display: 'inline',
    fontWeight: '600'
  },
  [`& .${classes.contributionWrap}`]: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2)
  },
  [`& .${classes.contributionText}`]: {
    textDecoration: 'underline'
  }
}));

export interface NotificationUndeletedProps {
  /**
   * Id of the feedObject
   * @default `n_<notificationObject.sid>`
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Notification obj
   * @default null
   */
  notificationObject: SCNotificationUnDeletedForType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the notification of type undeleted for
 * @param props
 * @constructor
 */
export default function UndeletedForNotification(props: NotificationUndeletedProps): JSX.Element {
  // PROPS
  const {notificationObject, id = `n_${props.notificationObject['sid']}`, className, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const contributionType = getContributeType(notificationObject);

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar classes={{root: classes.undeletedIconWrap}}>
          <Avatar variant="circular" classes={{root: classes.undeletedIcon}}>
            <EmojiFlagsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {notificationObject.is_new && <NewChip />}

              <Typography component="span" color="inherit" className={classes.undeletedText}>
                <FormattedMessage id="ui.notification.undeletedFor.restoredContent" defaultMessage="ui.notification.undeletedFor.restoredContent" />
              </Typography>
            </>
          }
          secondary={<DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />}
        />
      </ListItem>
      <Box className={classes.contributionWrap}>
        <Typography variant={'body2'} color={'inherit'} component={'span'} classes={{root: classes.contributionYouWroteLabel}}>
          <FormattedMessage id="ui.notification.undeletedFor.youWrote" defaultMessage="ui.notification.undeletedFor.youWrote" />
        </Typography>
        <Link
          to={scRoutingContext.url(SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`], getRouteData(notificationObject[contributionType]))}
          className={classes.contributionText}>
          <Typography component={'span'} variant="body2" gutterBottom>
            {getContributionSnippet(notificationObject[contributionType])}
          </Typography>
        </Link>
      </Box>
    </Root>
  );
}
