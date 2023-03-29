import React from 'react';
import {Box, Divider} from '@mui/material';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import {SCContributionType, SCFeedObjectType} from '@selfcommunity/types';
import {useThemeProps} from '@mui/system';
import VoteButton from '../../../VoteButton';
import VoteAudienceButton from '../../../VoteAudienceButton';

const PREFIX = 'SCVoteAction';

const classes = {
  root: `${PREFIX}-root`,
  divider: `${PREFIX}-divider`,
  button: `${PREFIX}-button`,
  inline: `${PREFIX}-inline`,
  viewAudienceButton: `${PREFIX}-view-audience-button`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

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

export default function Vote(inProps: VoteProps): JSX.Element {
  const props: VoteProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  // PROPS
  const {
    className = null,
    feedObjectId = null,
    feedObject = null,
    feedObjectType = SCContributionType.POST,
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
