import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Collapse, List, ListItem, ListItemButton, ListItemText, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {Endpoints, http, SCCommentTypologyType, Logger, SCFeedUnitActivityType, SCFeedUnitActivityTypologyType} from '@selfcommunity/core';
import {ExpandLess, ExpandMore} from '@mui/icons-material';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {AxiosResponse} from 'axios';
import CommentRelevantActivity from './CommentActivity';
import VoteUpRelevantActivity from './VoteUpActivity';
import FollowRelevantActivity from './FollowActivity';
import PollVoteRelevantActivity from './PollVoteActivity';
import {grey} from '@mui/material/colors';
import classNames from 'classnames';

const PREFIX = 'SCFeedRelevantActivities';

const classes = {
  root: `${PREFIX}-root`,
  activityItem: `${PREFIX}-activity`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.activityItem}`]: {
    padding: 0
  },
  '& a': {
    textDecoration: 'none',
    color: grey[900]
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
export default function RelevantActivities(props: RelevantActivitiesProps): JSX.Element {
  //PROPS
  const {className = null, activities = [], showMaxRelevantActivities = 5, ...rest} = props;

  // STATE
  const [openOtherActivities, setOpenOtherActivities] = useState<boolean>(false);
  const [loadingVote, setLoadingVote] = useState<number>(null);

  /**
   * Performs vote comment
   */
  const performVoteComment = (comment) => {
    return http
      .request({
        url: Endpoints.Vote.url({type: SCCommentTypologyType, id: comment.id}),
        method: Endpoints.Vote.method
      })
      .then((res: AxiosResponse<any>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      });
  };

  /**
   * Handles vote comment
   * @param comment
   */
  function handleVote(index, comment) {
    setLoadingVote(index);
    performVoteComment(comment)
      .then((data) => {
        setLoadingVote(null);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Renders single relevant activity
   * @param a
   * @param i
   */
  function renderActivity(a, i) {
    if (a.type === SCFeedUnitActivityTypologyType.COMMENT) {
      return <CommentRelevantActivity activityObject={a} key={i} index={i} onVote={handleVote} loadingVote={loadingVote} />;
    } else if (a.type === SCFeedUnitActivityTypologyType.FOLLOW) {
      return <FollowRelevantActivity activityObject={a} key={i} />;
    } else if (a.type === SCFeedUnitActivityTypologyType.VOTE) {
      return <VoteUpRelevantActivity activityObject={a} key={i} />;
    } else if (a.type === SCFeedUnitActivityTypologyType.POLLVOTE) {
      return <PollVoteRelevantActivity activityObject={a} key={i} />;
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
            <ListItem classes={{root: classes.activityItem}}>{renderActivity(a, i)}</ListItem>
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
              {openOtherActivities ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          )}
          <Collapse in={openOtherActivities} timeout="auto" unmountOnExit>
            {activities.slice(showMaxRelevantActivities).map((a: SCFeedUnitActivityType, i) => (
              <ListItem classes={{root: classes.activityItem}}>{renderActivity(a, i)}</ListItem>
            ))}
          </Collapse>
        </List>
      )}
    </Root>
  );
}
