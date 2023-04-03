import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {LoadingButton, LoadingButtonProps} from '@mui/lab';
import classNames from 'classnames';
import {SCCommentType, SCContributionType, SCFeedObjectType} from '@selfcommunity/types';
import {useThemeProps} from '@mui/system';
import Icon from '@mui/material/Icon';
import {Avatar, Box, List, ListItem, Tab, Tabs, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {SCUserContextType, useSCFetchVote, useSCUser} from '@selfcommunity/react-core';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import User from '../User';

const PREFIX = 'SCVoteAudienceButton';

const classes = {
  root: `${PREFIX}-root`,
  reactionList: `${PREFIX}-reaction-list`,
  dialogRoot: `${PREFIX}-dialog-root`,
  dialogTabs: `${PREFIX}-dialog-tabs`,
  dialogVoteBadge: `${PREFIX}-dialog-vote-badge`
};

const Root = styled(LoadingButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root, styles.voted]
})(({theme}) => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.dialogRoot
})(({theme}) => ({}));

export interface VoteAudienceButtonProps extends Pick<LoadingButtonProps, Exclude<keyof LoadingButtonProps, 'onClick' | 'disabled' | 'loading'>> {
  /**
   * Id of the contribution object to vote
   * @default null
   */
  contributionId: number;
  /**
   * Type of the contribution object to vote
   * @default null
   */
  contributionType: SCContributionType | any;
  /**
   * Contribution object to vote
   * @default null
   */
  contribution?: SCFeedObjectType | SCCommentType | null;

  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Vote Audience Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {VoteAudienceButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCVoteAudienceButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCVoteAudienceButton-root|Styles applied to the root element.|
 |reactionList|.SCVoteAudienceButton-reactions|Styles applied to the reactionList list element.|
 |dialogRoot|.SCVoteAudienceButton-dialog-root|Styles applied to the dialog root element.|
 |dialogTabs|.SCVoteAudienceButton-dialog-tabs|Styles applied to the tabs element.|
 |dialogVoteBadge|.SCVoteAudienceButton-dialog-vote-badge|Styles applied to the vote badge element.|
 * @param inProps
 */
export default function VoteAudienceButton(inProps: VoteAudienceButtonProps): JSX.Element {
  // PROPS
  const props: VoteAudienceButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, contributionId = null, contributionType = null, contribution = null, ...rest} = props;

  // STATE
  const [open, setOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<number>(0);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HANDLERS
  const handleOpen = (event) => {
    setOpen(true);
  };
  const handleClose = (event) => {
    setOpen(false);
  };
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  // HOOKS
  const {
    isLoading,
    contributionVoted,
    contributionVoteCount,
    contributionReactionsCount,
    reactions,
    error,
    handleFetchVoteList,
    voteList,
    isLoadingVoteList,
    voteListHasNext
  } = useSCFetchVote({
    id: contributionId,
    contributionType,
    contribution
  });

  // EFFECTS
  useEffect(() => {
    if (!isLoadingVoteList && open) {
      handleFetchVoteList({reset: true});
    }
  }, [open]);

  useEffect(() => {
    if (isLoadingVoteList || !open) {
      return;
    }
    if (tab === 0) {
      handleFetchVoteList({reset: true});
      return;
    }
    const {reaction} = contributionReactionsCount[tab - 1];
    handleFetchVoteList({reaction, reset: true});
  }, [tab]);

  // RENDER
  const audienceIcon = useMemo(() => {
    if (reactions.default && !isLoading && !error) {
      return (
        <Box className={classes.reactionList}>
          {contributionReactionsCount &&
            contributionReactionsCount.slice(0, 3).map((count: any, i) => (
              <Icon key={count.reaction.id}>
                <img alt={count.reaction.label} src={count.reaction.image} width="100%" height="100%" />
              </Icon>
            ))}
        </Box>
      );
    }
    return scUserContext.user && contributionVoted ? <Icon>thumb_up</Icon> : <Icon>thumb_up_off_alt</Icon>;
  }, [reactions.default, isLoading, error, contributionReactionsCount, scUserContext.user, contributionVoted]);

  const dialogTitle = useMemo(() => {
    if (reactions.default && !isLoading) {
      return (
        <Tabs className={classes.dialogTabs} value={tab} onChange={handleChangeTab} aria-label="reactions">
          <Tab label={<FormattedMessage defaultMessage="ui.voteAudienceButton.dialog.tab.all" id="ui.voteAudienceButton.dialog.tab.all" />} />
          {contributionReactionsCount &&
            contributionReactionsCount.map((count: any) => (
              <Tab
                key={count.reaction.id}
                label={
                  <>
                    <Icon>
                      <img alt={count.reaction.label} src={count.reaction.image} width="100%" height="100%" />
                    </Icon>
                    {count.count}
                  </>
                }
              />
            ))}
        </Tabs>
      );
    } else {
      return <FormattedMessage defaultMessage="ui.voteAudienceButton.dialog.title" id="ui.voteAudienceButton.dialog.title" />;
    }
  }, [tab, reactions, contributionReactionsCount]);

  return (
    <>
      <Root
        onClick={handleOpen}
        disabled={isLoading || Boolean(error) || contributionVoteCount === 0}
        loading={isLoading}
        className={classNames(classes.root, className)}
        {...rest}>
        {audienceIcon}&nbsp;
        {scUserContext.user && contributionVoted ? (
          contributionVoteCount === 1 ? (
            <FormattedMessage id="ui.voteAudienceButton.votedOnlyByMe" defaultMessage="ui.voteAudienceButton.votedOnlyByMe" />
          ) : (
            <FormattedMessage
              id="ui.voteAudienceButton.votedByMe"
              defaultMessage="ui.voteAudienceButton.votedByMe"
              values={{total: contributionVoteCount - 1}}
            />
          )
        ) : (
          <FormattedMessage id="ui.voteAudienceButton.votes" defaultMessage="ui.voteAudienceButton.votes" values={{total: contributionVoteCount}} />
        )}
      </Root>
      {open && (
        <DialogRoot title={dialogTitle} onClose={handleClose} open={open} DialogContentProps={{}}>
          {isLoadingVoteList && !voteList ? (
            <CentralProgress size={50} />
          ) : (
            <InfiniteScroll
              dataLength={voteList.length}
              next={() => handleFetchVoteList({})}
              hasMoreNext={voteListHasNext}
              loaderNext={<CentralProgress size={30} />}
              height={400}
              endMessage={
                <Typography>
                  <FormattedMessage id="ui.voteAudienceButton.dialog.end" defaultMessage="ui.voteAudienceButton.dialog.end" />
                </Typography>
              }>
              <List>
                {voteList.map((vote) => (
                  <ListItem key={vote.user.id}>
                    <User
                      elevation={0}
                      user={vote.user}
                      badgeContent={
                        <Avatar className={classes.dialogVoteBadge}>
                          {vote.reaction ? (
                            <Icon>
                              <img alt={vote.reaction.label} src={vote.reaction.image} width="100%" height="100%" />
                            </Icon>
                          ) : (
                            <Icon>thumb_up</Icon>
                          )}
                        </Avatar>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </InfiniteScroll>
          )}
        </DialogRoot>
      )}
    </>
  );
}
