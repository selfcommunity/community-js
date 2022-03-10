import React, {useState} from 'react';
import {Box, Button, Typography} from '@mui/material';
import {SCCommentType, useSCFetchCommentObject} from '@selfcommunity/core';
import {styled} from '@mui/material/styles';
import Icon from '@mui/material/Icon';
import CommentObjectVotesDialog from './VotesDialog';

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

export interface VotesProps {
  /**
   * Id of the comment object
   * @default null
   */
  commentObjectId?: number;

  /**
   * Comment object
   * @default null
   */
  commentObject?: SCCommentType;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function Votes(props: VotesProps): JSX.Element {
  // PROPS
  const {commentObjectId, commentObject, ...rest} = props;

  // RETRIVE OBJECTS
  const {obj, setObj} = useSCFetchCommentObject({id: commentObjectId, commentObject});

  // STATE
  const [openVotesDialog, setOpenVotesDialog] = useState<boolean>(false);

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
            <Icon fontSize="medium" color="primary" className={classes.votes}>
              thumb_up_alt
            </Icon>
          ) : (
            <Icon fontSize="medium" sx={{marginTop: '-1px'}}>
              thumb_up_off_alt
            </Icon>
          )}
          <Typography variant={'body2'} sx={{marginLeft: '5px'}}>
            {obj.vote_count}
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
