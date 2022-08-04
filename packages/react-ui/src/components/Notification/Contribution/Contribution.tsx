import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Stack, Tooltip, Typography} from '@mui/material';
import {SCFeedObjectTypologyType, SCNotificationContributionType} from '@selfcommunity/types';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import {getContributionSnippet, getContributionType, getRouteData} from '../../../utils/contribution';
import {useThemeProps} from '@mui/system';
import NotificationItem from '../../../shared/NotificationItem';
import Bullet from '../../../shared/Bullet';
import {LoadingButton} from '@mui/lab';
import Icon from '@mui/material/Icon';

const messages = defineMessages({
  postOrStatus: {
    id: 'ui.notification.contribution.newPostOrStatus',
    defaultMessage: 'ui.notification.contribution.newPostOrStatus'
  },
  discussion: {
    id: 'ui.notification.contribution.discussion',
    defaultMessage: 'ui.notification.contribution.discussion'
  }
});

const PREFIX = 'SCContributionNotification';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`,
  voteButton: `${PREFIX}-vote-button`,
  contributionText: `${PREFIX}-contribution-text`,
  activeAt: `${PREFIX}-active-at`,
  bullet: `${PREFIX}-bullet`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.username}`]: {
    fontWeight: 700,
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  [`& .${classes.voteButton}`]: {
    marginLeft: '-1px',
    minWidth: '30px',
    paddingTop: 3,
    '& > span': {
      fontSize: '15px'
    }
  },
  [`& .${classes.contributionText}`]: {
    color: theme.palette.text.primary,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}));

export interface ContributionNotificationProps {
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
  notificationObject: SCNotificationContributionType;

  /**
   * Notification Object template type
   * @default 'detail'
   */
  template?: SCNotificationObjectTemplateType;
  /**
   * Index
   * @default null
   */
  index?: number;

  /**
   * Handles action on vote
   * @default null
   */
  onVote?: (i, v) => void;

  /**
   * The id of the loading vote
   * @default null
   */
  loadingVote?: number;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the notification of type follow (contribution)
 * @param inProps
 * @constructor
 */
export default function ContributionNotification(inProps: ContributionNotificationProps): JSX.Element {
  // PROPS
  const props: ContributionNotificationProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    notificationObject,
    index,
    onVote,
    loadingVote,
    id = `n_${props.notificationObject['sid']}`,
    className,
    template = SCNotificationObjectTemplateType.DETAIL,
    ...rest
  } = props;

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONST
  const contributionType = getContributionType(notificationObject);

  // INTL
  const intl = useIntl();
  /**
   * Handle vote
   */
  function handleVote() {
    return onVote && index !== undefined && onVote(index, notificationObject[contributionType]);
  }

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className, `${PREFIX}-${template}`)} {...rest}>
      <NotificationItem
        template={template}
        isNew={notificationObject.is_new}
        disableTypography
        image={
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject[contributionType].author)}>
            <Avatar
              alt={notificationObject[contributionType].author.username}
              variant="circular"
              src={notificationObject[contributionType].author.avatar}
              classes={{root: classes.avatar}}
            />
          </Link>
        }
        primary={
          <>
            <Link
              to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject[contributionType].author)}
              className={classes.username}>
              {notificationObject[contributionType].author.username}
            </Link>{' '}
            {notificationObject[contributionType]['type'] === SCFeedObjectTypologyType.POST ||
            notificationObject[contributionType]['type'] === SCFeedObjectTypologyType.STATUS
              ? intl.formatMessage(messages.postOrStatus, {contribution: notificationObject[contributionType]['type']})
              : intl.formatMessage(messages.discussion)}
          </>
        }
        secondary={
          <React.Fragment>
            {template === SCNotificationObjectTemplateType.SNIPPET && (
              <Link
                to={scRoutingContext.url(
                  SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`],
                  getRouteData(notificationObject[contributionType])
                )}>
                <Typography variant="body2" className={classes.contributionText} gutterBottom component={'div'}>
                  {getContributionSnippet(notificationObject[contributionType])}
                </Typography>
              </Link>
            )}
            {template === SCNotificationObjectTemplateType.DETAIL && (
              <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
                <Bullet className={classes.bullet} />
                <LoadingButton
                  color={'inherit'}
                  size={'small'}
                  classes={{root: classes.voteButton}}
                  variant={'text'}
                  onClick={handleVote}
                  disabled={loadingVote === index}
                  loading={loadingVote === index}>
                  {notificationObject[contributionType].voted ? (
                    <Tooltip
                      title={
                        <FormattedMessage id={'ui.notification.contribution.voteDown'} defaultMessage={'ui.notification.contribution.voteDown'} />
                      }>
                      <Icon fontSize={'small'} color={'primary'}>
                        thumb_up_alt
                      </Icon>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={<FormattedMessage id={'ui.notification.contribution.voteUp'} defaultMessage={'ui.notification.contribution.voteUp'} />}>
                      <Icon fontSize={'small'} color="inherit">
                        thumb_up_off_alt
                      </Icon>
                    </Tooltip>
                  )}
                </LoadingButton>
              </Stack>
            )}
          </React.Fragment>
        }
        footer={
          <React.Fragment>
            {template === SCNotificationObjectTemplateType.TOAST && (
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <DateTimeAgo date={notificationObject.active_at} />
                <Typography color="primary" component={'div'}>
                  <Link
                    to={scRoutingContext.url(
                      SCRoutes[`${notificationObject[contributionType]['type'].toUpperCase()}_ROUTE_NAME`],
                      getRouteData(notificationObject)
                    )}>
                    <FormattedMessage id="ui.userToastNotifications.viewContribution" defaultMessage={'ui.userToastNotifications.viewContribution'} />
                  </Link>
                </Typography>
              </Stack>
            )}
          </React.Fragment>
        }
      />
    </Root>
  );
}
