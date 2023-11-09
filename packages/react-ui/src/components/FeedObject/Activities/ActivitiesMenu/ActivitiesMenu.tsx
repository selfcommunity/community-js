import * as React from 'react';
import {useContext} from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import {Button, ListItemButton, ListItemText, SwipeableDrawer, useMediaQuery, useTheme} from '@mui/material';
import Icon from '@mui/material/Icon';
import {styled} from '@mui/material/styles';
import {SCFeedObjectActivitiesType} from '../../../../types/feedObject';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {camelCase} from '@selfcommunity/utils';
import {SCPreferences, SCPreferencesContext, SCPreferencesContextType, SCThemeType, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {PREFIX} from '../../constants';

const messages = defineMessages({
  relevantActivities: {
    id: 'ui.feedObject.activitiesMenu.relevantActivities',
    defaultMessage: 'ui.feedObject.activitiesMenu.relevantActivities'
  },
  recentComments: {
    id: 'ui.feedObject.activitiesMenu.recentComments',
    defaultMessage: 'ui.feedObject.activitiesMenu.recentComments'
  },
  firstComments: {
    id: 'ui.feedObject.activitiesMenu.firstComments',
    defaultMessage: 'ui.feedObject.activitiesMenu.firstComments'
  },
  followedComments: {
    id: 'ui.feedObject.activitiesMenu.followedComments',
    defaultMessage: 'ui.feedObject.activitiesMenu.followedComments'
  },
  connectionsComments: {
    id: 'ui.feedObject.activitiesMenu.connectionsComments',
    defaultMessage: 'ui.feedObject.activitiesMenu.connectionsComments'
  }
});

const classes = {
  root: `${PREFIX}-activities-menu-root`,
  selector: `${PREFIX}-activities-menu-selector`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'ActivitiesMenuRoot'
})(() => ({}));

export interface ActivitiesMenuProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Selected activities
   * @default string
   */
  selectedActivities?: string;
  /**
   * Hides relevant activity item
   * @default false
   */
  hideRelevantActivitiesItem?: boolean;
  /**
   * Handles on change
   * @default false
   */
  onChange?: (type) => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function ActivitiesMenu(props: ActivitiesMenuProps) {
  // PROPS
  const {className = null, selectedActivities = null, hideRelevantActivitiesItem = false, onChange = null, ...rest} = props;

  // CONTEXT
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const followEnabled = scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // INTL
  const intl = useIntl();

  // HANDLERS
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeActivitiesType = (type) => {
    return () => {
      onChange && onChange(type);
    };
  };

  function renderMenuContent() {
    return (
      <Box>
        {!hideRelevantActivitiesItem && (
          <ListItemButton
            selected={selectedActivities === SCFeedObjectActivitiesType.RELEVANCE_ACTIVITIES}
            onClick={handleChangeActivitiesType(SCFeedObjectActivitiesType.RELEVANCE_ACTIVITIES)}>
            <ListItemText
              primary={<b>{intl.formatMessage(messages.relevantActivities)}</b>}
              secondary={
                <FormattedMessage
                  id={'ui.feedObject.activitiesMenu.relevantActivitiesDesc'}
                  defaultMessage={'ui.feedObject.activitiesMenu.relevantActivitiesDesc'}
                />
              }
            />
          </ListItemButton>
        )}
        <ListItemButton
          selected={selectedActivities === SCFeedObjectActivitiesType.RECENT_COMMENTS}
          onClick={handleChangeActivitiesType(SCFeedObjectActivitiesType.RECENT_COMMENTS)}>
          <ListItemText
            primary={<b>{intl.formatMessage(messages.recentComments)}</b>}
            secondary={
              <FormattedMessage
                id={'ui.feedObject.activitiesMenu.recentCommentsDesc'}
                defaultMessage={'ui.feedObject.activitiesMenu.recentCommentsDesc'}
              />
            }
          />
        </ListItemButton>
        <ListItemButton
          selected={selectedActivities === SCFeedObjectActivitiesType.FIRST_COMMENTS}
          onClick={handleChangeActivitiesType(SCFeedObjectActivitiesType.FIRST_COMMENTS)}>
          <ListItemText
            primary={<b>{intl.formatMessage(messages.firstComments)}</b>}
            secondary={
              <FormattedMessage
                id={'ui.feedObject.activitiesMenu.firstCommentsDesc'}
                defaultMessage={'ui.feedObject.activitiesMenu.firstCommentsDesc'}
              />
            }
          />
        </ListItemButton>
        {scUserContext.user && (
          <ListItemButton
            selected={selectedActivities === SCFeedObjectActivitiesType.CONNECTIONS_COMMENTS}
            onClick={handleChangeActivitiesType(SCFeedObjectActivitiesType.CONNECTIONS_COMMENTS)}>
            <ListItemText
              primary={<b>{followEnabled ? intl.formatMessage(messages.followedComments) : intl.formatMessage(messages.connectionsComments)}</b>}
              secondary={
                followEnabled ? (
                  <FormattedMessage
                    id={'ui.feedObject.activitiesMenu.followedCommentsDesc'}
                    defaultMessage={'ui.feedObject.activitiesMenu.followedCommentsDesc'}
                  />
                ) : (
                  <FormattedMessage
                    id={'ui.feedObject.activitiesMenu.connectionsCommentsDesc'}
                    defaultMessage={'ui.feedObject.activitiesMenu.connectionsCommentsDesc'}
                  />
                )
              }
            />
          </ListItemButton>
        )}
      </Box>
    );
  }

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Box className={classes.selector}>
        <Tooltip
          title={<FormattedMessage id="ui.feedObject.activitiesMenu.tooltipTitle" defaultMessage="ui.feedObject.activitiesMenu.tooltipTitle" />}>
          <Button variant="text" size="small" onClick={handleOpen}>
            {selectedActivities === SCFeedObjectActivitiesType.CONNECTIONS_COMMENTS && followEnabled
              ? intl.formatMessage(messages.followedComments)
              : intl.formatMessage(messages[`${camelCase(selectedActivities)}`])}
            &nbsp; <Icon>expand_more</Icon>
          </Button>
        </Tooltip>
      </Box>
      {isMobile ? (
        <SwipeableDrawer open={open} onClose={handleClose} onOpen={handleOpen} anchor="bottom" disableSwipeToOpen>
          {renderMenuContent()}
        </SwipeableDrawer>
      ) : (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }}
          transformOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}>
          {renderMenuContent()}
        </Menu>
      )}
    </Root>
  );
}
