import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Collapse, List, ListItem, ListItemButton, ListItemText, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {SCFeedUnitActivityType, SCFeedUnitActivityTypologyType} from '@selfcommunity/types';
import Icon from '@mui/material/Icon';
import CommentRelevantActivity from './CommentActivity';
import VoteUpRelevantActivity from './VoteUpActivity';
import FollowRelevantActivity from './FollowActivity';
import PollVoteRelevantActivity from './PollVoteActivity';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCFeedRelevantActivities';

const classes = {
  root: `${PREFIX}-root`,
  activity: `${PREFIX}-activity`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .MuiList-root, & .${classes.activity}`]: {
    padding: 0,
    '& .SCBaseItem-content': {
      alignItems: 'flex-start'
    }
  }
}));

export interface RelevantActivitiesProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Activities available.
   * @default []
   */
  activities: SCFeedUnitActivityType[];
  /**
   * The number of relevant activities shown
   * @default 5
   */
  showMaxRelevantActivities?: number;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function RelevantActivities(inProps: RelevantActivitiesProps): JSX.Element {
  //PROPS
  const props: RelevantActivitiesProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, activities = [], showMaxRelevantActivities = 5, ...rest} = props;

  // STATE
  const [openOtherActivities, setOpenOtherActivities] = useState<boolean>(false);

  /**
   * Renders single relevant activity
   * @param a
   * @param i
   */
  function renderActivity(a, i) {
    if (a.type === SCFeedUnitActivityTypologyType.COMMENT) {
      return <CommentRelevantActivity activityObject={a} key={i} elevation={0} />;
    } else if (a.type === SCFeedUnitActivityTypologyType.FOLLOW) {
      return <FollowRelevantActivity activityObject={a} key={i} elevation={0} />;
    } else if (a.type === SCFeedUnitActivityTypologyType.VOTE) {
      return <VoteUpRelevantActivity activityObject={a} key={i} elevation={0} />;
    } else if (a.type === SCFeedUnitActivityTypologyType.POLLVOTE) {
      return <PollVoteRelevantActivity activityObject={a} key={i} elevation={0} />;
    }
    return null;
  }

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {activities.length <= 0 ? (
        <Typography variant="body2">
          <FormattedMessage id="ui.feedObject.relevantActivities.noResults" defaultMessage="ui.feedObject.relevantActivities.noResults" />
        </Typography>
      ) : (
        <List>
          {activities.slice(0, showMaxRelevantActivities).map((a: SCFeedUnitActivityType, i) => (
            <ListItem className={classes.activity} key={i}>{renderActivity(a, i)}</ListItem>
          ))}
          {!openOtherActivities && activities.length > showMaxRelevantActivities && (
            <ListItemButton onClick={() => setOpenOtherActivities((prev) => !prev)}>
              <ListItemText
                primary={
                  <FormattedMessage
                    id={'ui.feedObject.relevantActivities.showOthers'}
                    defaultMessage={'ui.feedObject.relevantActivities.showOthers'}
                  />
                }
              />
              {openOtherActivities ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
            </ListItemButton>
          )}
          <Collapse in={openOtherActivities} timeout="auto" unmountOnExit>
            {activities.slice(showMaxRelevantActivities).map((a: SCFeedUnitActivityType, i) => (
              <ListItem className={classes.activity} key={i}>{renderActivity(a, i)}</ListItem>
            ))}
          </Collapse>
        </List>
      )}
    </Root>
  );
}
