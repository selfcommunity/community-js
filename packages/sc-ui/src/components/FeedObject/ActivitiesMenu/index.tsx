import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import {Button, ListItem, ListItemText} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {styled} from '@mui/material/styles';
import {FeedObjectActivitiesType} from '../../../types/feedObject';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCPreferences, SCPreferencesContext, SCPreferencesContextType, SCUserContextType, StringUtils, useSCUser} from '@selfcommunity/core';
import {useContext} from 'react';

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

const PREFIX = 'SCActivitiesMenu';

const classes = {
  selector: `${PREFIX}-selector`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.selector}`]: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'flex-end'
  },
  [`& .${classes.selector} .MuiButton-root`]: {
    textTransform: 'capitalize',
    fontWeight: 'bold'
  }
}));

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
  const followEnabled = scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // INTL
  const intl = useIntl();

  // HANDLERS
  const handleClick = (event) => {
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

  /**
   * Renders root object
   */
  return (
    <Root className={className} {...rest}>
      <Box className={classes.selector}>
        <Tooltip
          title={<FormattedMessage id="ui.feedObject.activitiesMenu.tooltipTitle" defaultMessage="ui.feedObject.activitiesMenu.tooltipTitle" />}>
          <Button variant="text" size="small" onClick={handleClick} endIcon={<ExpandMoreIcon />} color="inherit">
            {selectedActivities === FeedObjectActivitiesType.CONNECTIONS_COMMENTS && followEnabled
              ? intl.formatMessage(messages.followedComments)
              : intl.formatMessage(messages[`${StringUtils.camelCase(selectedActivities)}`])}
          </Button>
        </Tooltip>
      </Box>
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
        {!hideRelevantActivitiesItem && (
          <ListItem
            selected={selectedActivities === FeedObjectActivitiesType.RELEVANCE_ACTIVITIES}
            button
            onClick={handleChangeActivitiesType(FeedObjectActivitiesType.RELEVANCE_ACTIVITIES)}>
            <ListItemText
              primary={<b>{intl.formatMessage(messages.relevantActivities)}</b>}
              secondary={
                <FormattedMessage
                  id={'ui.feedObject.activitiesMenu.relevantActivitiesDesc'}
                  defaultMessage={'ui.feedObject.activitiesMenu.relevantActivitiesDesc'}
                />
              }
            />
          </ListItem>
        )}
        <ListItem
          selected={selectedActivities === FeedObjectActivitiesType.RECENT_COMMENTS}
          button
          onClick={handleChangeActivitiesType(FeedObjectActivitiesType.RECENT_COMMENTS)}>
          <ListItemText
            primary={<b>{intl.formatMessage(messages.recentComments)}</b>}
            secondary={
              <FormattedMessage
                id={'ui.feedObject.activitiesMenu.recentCommentsDesc'}
                defaultMessage={'ui.feedObject.activitiesMenu.recentCommentsDesc'}
              />
            }
          />
        </ListItem>
        <ListItem
          selected={selectedActivities === FeedObjectActivitiesType.FIRST_COMMENTS}
          button
          onClick={handleChangeActivitiesType(FeedObjectActivitiesType.FIRST_COMMENTS)}>
          <ListItemText
            primary={<b>{intl.formatMessage(messages.firstComments)}</b>}
            secondary={
              <FormattedMessage
                id={'ui.feedObject.activitiesMenu.firstCommentsDesc'}
                defaultMessage={'ui.feedObject.activitiesMenu.firstCommentsDesc'}
              />
            }
          />
        </ListItem>
        {scUserContext.user && (
          <ListItem
            selected={selectedActivities === FeedObjectActivitiesType.CONNECTIONS_COMMENTS}
            button
            onClick={handleChangeActivitiesType(FeedObjectActivitiesType.CONNECTIONS_COMMENTS)}>
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
          </ListItem>
        )}
      </Menu>
    </Root>
  );
}
