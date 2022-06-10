import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import {Link, SCRoutingContextType, useSCRouting, SCRoutes} from '@selfcommunity/react-core';
import {SCNotificationDeletedForType} from '@selfcommunity/types';
import {camelCase} from '@selfcommunity/utils';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {getContributionType, getContributionSnippet, getRouteData} from '../../../utils/contribution';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import {useThemeProps} from '@mui/system';
import NotificationItem from '../../../shared/NotificationItem';
import {red} from '@mui/material/colors';

const messages = defineMessages({
  kindlyNoticeFlag: {
    id: 'ui.notification.kindlyNoticeFlag.kindlyNoticeFlag',
    defaultMessage: 'ui.notification.kindlyNoticeFlag.kindlyNoticeFlag'
  }
});

const PREFIX = 'SCKindlyNoticeFlagNotification';

const classes = {
  root: `${PREFIX}-root`,
  flagIcon: `${PREFIX}-flag-icon`,
  flagText: `${PREFIX}-flag-text`,
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
  [`& .${classes.flagIcon}`]: {
    backgroundColor: red[500],
    color: '#FFF'
  },
  [`& .${classes.flagText}`]: {
    color: theme.palette.text.primary
  },
  [`& .${classes.contributionWrap}`]: {
    padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
    textOverflow: 'ellipsis',
    display: 'inline',
    overflow: 'hidden'
  },
  [`& .${classes.contributionText}`]: {
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}));

export interface NotificationKindlyNoticeFlagProps {
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
  notificationObject: SCNotificationDeletedForType;

  /**
   * Notification Object template type
   * @default 'detail'
   */
  template?: SCNotificationObjectTemplateType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the notification of type kindly notice flag
 * @param inProps
 * @constructor
 */
export default function KindlyNoticeFlagNotification(inProps: NotificationKindlyNoticeFlagProps): JSX.Element {
  // PROPS
  const props: NotificationKindlyNoticeFlagProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    notificationObject,
    id = `n_${props.notificationObject['sid']}`,
    className,
    template = SCNotificationObjectTemplateType.DETAIL,
    ...rest
  } = props;

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONST
  const isSnippetTemplate = template === SCNotificationObjectTemplateType.SNIPPET;
  const contributionType = getContributionType(notificationObject);

  //INTL
  const intl = useIntl();

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
          <Avatar variant="circular" classes={{root: classes.flagIcon}}>
            <Icon>outlined_flag</Icon>
          </Avatar>
        }
        primary={
          <>
            {isSnippetTemplate ? (
              <Link
                to={scRoutingContext.url(
                  SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`],
                  getRouteData(notificationObject[contributionType])
                )}>
                <Typography component="div" color="inherit" className={classes.flagText}>
                  <FormattedMessage
                    id={`ui.notification.kindlyNoticeFlag.kindlyNoticeFlagSnippet`}
                    defaultMessage={`ui.notification.kindlyNoticeFlag.kindlyNoticeFlagSnippet`}
                  />
                </Typography>
              </Link>
            ) : (
              <Typography component="div" color="inherit" className={classes.flagText}>
                {intl.formatMessage(messages[camelCase(notificationObject.type)], {b: (...chunks) => <strong>{chunks}</strong>})}
              </Typography>
            )}
          </>
        }
        secondary={
          template === SCNotificationObjectTemplateType.DETAIL && <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
        }
        footer={
          <>
            {!isSnippetTemplate && (
              <Box className={classes.contributionWrap}>
                <Typography variant={'body2'} color={'inherit'} component={'div'} classes={{root: classes.contributionYouWroteLabel}}>
                  <FormattedMessage id="ui.notification.undeletedFor.youWrote" defaultMessage="ui.notification.undeletedFor.youWrote" />
                </Typography>
                <Link
                  to={scRoutingContext.url(
                    SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`],
                    getRouteData(notificationObject[contributionType])
                  )}
                  className={classes.contributionText}>
                  <Typography component={'span'} variant="body2" gutterBottom>
                    {getContributionSnippet(notificationObject[contributionType])}
                  </Typography>
                </Link>
              </Box>
            )}
          </>
        }
      />
    </Root>
  );
}
