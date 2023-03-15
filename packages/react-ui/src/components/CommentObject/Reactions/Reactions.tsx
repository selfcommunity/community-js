import React, {useState} from 'react';
import {Avatar, AvatarGroup, Box, Button, Typography} from '@mui/material';
import {useSCFetchCommentObject} from '@selfcommunity/react-core';
import {SCCommentType, SCReactionType} from '@selfcommunity/types';
import {styled} from '@mui/material/styles';
import Icon from '@mui/material/Icon';
import CommentObjectReactionsDialog from './ReactionsDialog';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';

const PREFIX = 'SCCommentObjectReactions';

const classes = {
  root: `${PREFIX}-root`,
  btnViewVotes: `${PREFIX}-btnViewVotes`,
  votes: `${PREFIX}-votes`,
  groupedReactions: `${PREFIX}-grouped-reactions`,
  reactionAvatar: `${PREFIX}-reaction-avatar`,
  reactionIcon: `${PREFIX}-reaction-icon`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface ReactionsProps {
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
   * The reactions added to the comment
   */
  reactionsList: SCReactionType[];
  /**
   * Other props
   */
  [p: string]: any;
}

export default function Reactions(inProps: ReactionsProps): JSX.Element {
  // PROPS
  const props: ReactionsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className = '', commentObjectId, commentObject, reactionsList = [], ...rest} = props;

  // RETRIEVE OBJECTS
  const {obj, setObj} = useSCFetchCommentObject({id: commentObjectId, commentObject});

  // STATE
  const [openVotesDialog, setOpenVotesDialog] = useState<boolean>(false);

  /**
   * Open/Close dialog shares
   */
  function handleToggleReactionsDialog() {
    setOpenVotesDialog(!openVotesDialog);
  }

  /**
   * Render votes
   * @return {JSX.Element}
   */
  function renderReactions() {
    if (!reactionsList || !obj) {
      return null;
    }
    return (
      <>
        <Button variant="text" size="small" onClick={handleToggleReactionsDialog} disabled={obj.vote_count === 0} className={classes.btnViewVotes}>
          <>
            {obj.vote_count <= 0 ? (
              <Icon fontSize="medium" sx={{marginTop: '-1px'}}>
                thumb_up_off_alt
              </Icon>
            ) : (
              <AvatarGroup className={classes.groupedReactions} max={3}>
                {reactionsList.map((r: any, i) => (
                  <Avatar alt={r.reaction.label} src={r.reaction.image} key={i} className={classes.reactionAvatar} />
                ))}
                <Typography component={'span'}>{obj.vote_count}</Typography>
              </AvatarGroup>
            )}
          </>
        </Button>
        {openVotesDialog && obj.vote_count > 0 && (
          <CommentObjectReactionsDialog
            reactionsList={reactionsList}
            commentObject={obj}
            open={openVotesDialog}
            onClose={handleToggleReactionsDialog}
          />
        )}
      </>
    );
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {renderReactions()}
    </Root>
  );
}
