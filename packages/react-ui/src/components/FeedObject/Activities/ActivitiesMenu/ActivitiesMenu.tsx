import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import {Button, ListItem, ListItemText, useTheme, useMediaQuery} from '@mui/material';
import Icon from '@mui/material/Icon';
import {styled} from '@mui/material/styles';
import {SCFeedObjectActivitiesType} from '../../../../types/feedObject';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {camelCase} from '@selfcommunity/utils';
import {SCPreferences, SCPreferencesContext, SCPreferencesContextType, SCThemeType, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {useContext} from 'react';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import BaseDrawer from '../../../../shared/BaseDrawer';

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
  root: `${PREFIX}-root`,
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
export default function ActivitiesMenu(inProps: ActivitiesMenuProps) {
  // PROPS
  const props: ActivitiesMenuProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
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

  function renderMenuContent() {
    return (
      <Box>
        {!hideRelevantActivitiesItem && (
          <ListItem
            selected={selectedActivities === SCFeedObjectActivitiesType.RELEVANCE_ACTIVITIES}
            button
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
          </ListItem>
        )}
        <ListItem
          selected={selectedActivities === SCFeedObjectActivitiesType.RECENT_COMMENTS}
          button
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
        </ListItem>
        <ListItem
          selected={selectedActivities === SCFeedObjectActivitiesType.FIRST_COMMENTS}
          button
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
        </ListItem>
        {scUserContext.user && (
          <ListItem
            selected={selectedActivities === SCFeedObjectActivitiesType.CONNECTIONS_COMMENTS}
            button
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
          </ListItem>
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
          <Button variant="text" size="small" onClick={handleClick} endIcon={<Icon>expand_more</Icon>} color="inherit">
            {selectedActivities === SCFeedObjectActivitiesType.CONNECTIONS_COMMENTS && followEnabled
              ? intl.formatMessage(messages.followedComments)
              : intl.formatMessage(messages[`${camelCase(selectedActivities)}`])}
          </Button>
        </Tooltip>
      </Box>
      {isMobile ? (
        <BaseDrawer open={open} onClose={handleClose} width={'100%'}>
          {renderMenuContent()}
        </BaseDrawer>
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
