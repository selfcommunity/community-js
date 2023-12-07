import React from 'react';
import {Box, Divider} from '@mui/material';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import {SCContributionType, SCFeedObjectType} from '@selfcommunity/types';
import VoteButton from '../../../VoteButton';
import VoteAudienceButton from '../../../VoteAudienceButton';
import {PREFIX} from '../../constants';

const classes = {
  root: `${PREFIX}-action-vote-root`,
  divider: `${PREFIX}-action-vote-divider`,
  button: `${PREFIX}-action-vote-button`,
  inline: `${PREFIX}-action-vote-inline`,
  viewAudienceButton: `${PREFIX}-action-vote-view-audience-button`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'ActionVoteRoot'
})(() => ({}));

export interface VoteProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Feed object id
   * @default null
   */
  feedObjectId?: number;

  /**
   * Feed object
   * @default null
   */
  feedObject?: SCFeedObjectType;

  /**
   * Feed object type
   * @default 'post' type
   */
  feedObjectType?: Exclude<SCContributionType, SCContributionType.COMMENT>;

  /**
   * Show audience.
   * @default true
   */
  withAudience?: boolean;

  /**
   * Show action
   * @default true
   */
  withAction?: boolean;

  /**
   * Inline action layout.
   * Action will be align with the audience button.
   * @default true
   */
  inlineAction?: boolean;

  /**
   * Handles action vote click
   * @default null
   */
  onVoteAction?: (data) => any;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function Vote(props: VoteProps): JSX.Element {
  // PROPS
  const {
    className = null,
    feedObjectId = null,
    feedObject = null,
    feedObjectType = null,
    withAudience = true,
    withAction = true,
    inlineAction = false,
    onVoteAction = () => null,
    ...rest
  } = props;

  // RENDER
  return (
    <Root className={classNames(classes.root, className, {[classes.inline]: inlineAction})} {...rest}>
      {withAudience && (
        <VoteAudienceButton
          className={classes.viewAudienceButton}
          contributionId={feedObjectId}
          contributionType={feedObjectType}
          contribution={feedObject}
          variant="text"
          size="small"
        />
      )}
      {withAction && (
        <React.Fragment>
          {!inlineAction && withAudience && <Divider className={classes.divider} />}
          <VoteButton
            className={classes.button}
            contributionId={feedObjectId}
            contributionType={feedObjectType}
            contribution={feedObject}
            onVote={onVoteAction}
          />
        </React.Fragment>
      )}
    </Root>
  );
}
