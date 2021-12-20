import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import {Button, ListItem, ListItemText} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {styled} from '@mui/material/styles';
import {FeedObjectActivitiesType} from '../../../types/feedObject';
import {FeedType} from '../../../types/feed';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {camelCase} from '../../../../../sc-core/src/utils/string';

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
  }
}));

export default function ActivitiesMenu({
  selectedActivities = null,
  feedOrderBy = FeedType.RECENT,
  onChange = null,
  ...rest
}: {
  selectedActivities?: string;
  feedOrderBy?: FeedType;
  onChange?: (type) => void;
  [p: string]: any;
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const intl = useIntl();

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

  console.log(camelCase(selectedActivities));
  return (
    <Root {...rest}>
      <Box className={classes.selector}>
        <Tooltip title="Account settings">
          <Button variant="text" size="small" onClick={handleClick} endIcon={<ExpandMoreIcon />}>
            <b>{intl.formatMessage(messages[`${camelCase(selectedActivities)}`])}</b>
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
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
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
        {feedOrderBy === FeedType.RELEVANCE && (
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
      </Menu>
    </Root>
  );
}
