import React, {useContext, useState} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {Box, Button, Divider, IconButton, Tooltip, Typography} from '@mui/material';
import {SCCommentType, SCUserContext, SCUserContextType, useSCFetchCommentObject} from '@selfcommunity/core';
import {styled} from '@mui/material/styles';
import VoteFilledIcon from '@mui/icons-material/ThumbUpTwoTone';
import VoteIcon from '@mui/icons-material/ThumbUpOutlined';
import CommentObjectVotesDialog from './VotesDialog';

const messages = defineMessages({
  votes: {
    id: 'ui.commentObject.votes',
    defaultMessage: 'ui.commentObject.votes'
  }
});

const PREFIX = 'SCCommentObjectVotes';

const classes = {
  root: `${PREFIX}-root`,
  btnViewVotes: `${PREFIX}-btnViewVotes`,
  votes: `${PREFIX}-votes`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.votes}`]: {
    backgroundColor: '#d5d5d5',
    padding: '0 3px',
    borderRadius: 20
  },
  [`& .${classes.btnViewVotes}`]: {
    minWidth: 42,
    marginRight: theme.spacing(2),
    marginTop: -14,
    right: 0,
    position: 'absolute'
  }
}));

export default function Votes({
  id = null,
  commentObject = null,
  ...rest
}: {
  id?: number;
  commentObject?: SCCommentType;
  [p: string]: any;
}): JSX.Element {
  const scUser: SCUserContextType = useContext(SCUserContext);
  const {obj, setObj} = useSCFetchCommentObject({id, commentObject});
  const [openVotesDialog, setOpenVotesDialog] = useState<boolean>(false);
  const intl = useIntl();

  /**
   * Open/Close dialog shares
   */
  function handleToggleSharesDialog() {
    setOpenVotesDialog(!openVotesDialog);
  }

  /**
   * Render votes
   * @return {JSX.Element}
   */
  function renderVotes() {
    return (
      <>
        <Button variant="text" size="small" disabled={obj.vote_count <= 0} className={classes.btnViewVotes} onClick={handleToggleSharesDialog}>
          {obj.voted ? (
            <VoteFilledIcon fontSize="medium" color={'secondary'} className={classes.votes} />
          ) : (
            <VoteIcon fontSize="medium" sx={{marginTop: '-1px'}} />
          )}
          <Typography variant={'body2'} sx={{marginLeft: '5px'}}>
            {obj.vote_count}
            {/*`${intl.formatMessage(messages.votes, {total: obj.vote_count})}`*/}
          </Typography>
        </Button>
        {openVotesDialog && obj.vote_count > 0 && (
          <CommentObjectVotesDialog commentObject={obj} open={openVotesDialog} onClose={handleToggleSharesDialog} />
        )}
      </>
    );
  }

  return <Root {...rest}>{renderVotes()}</Root>;
}
