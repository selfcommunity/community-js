import React, {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {Box, List, ListItem} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import Typography from '@mui/material/Typography';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {useSCFetchCommentObject} from '@selfcommunity/react-core';
import {SCCommentType, SCCommentTypologyType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../../../constants/Errors';
import BaseDialog from '../../../../shared/BaseDialog';
import CentralProgress from '../../../../shared/CentralProgress';
import User from '../../../User';
import {styled} from '@mui/material/styles';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCCommentObjectVotesDialog';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})({});

export interface CommentObjectVotesDialogProps {
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
   * open/close the dialog
   * @default false
   */
  open?: boolean;

  /**
   * Callback invoked when dialog close
   */
  onClose?: () => any;
}

export default function CommentObjectVotesDialog(inProps: CommentObjectVotesDialogProps): JSX.Element {
  // PROPS
  const props: CommentObjectVotesDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {commentObjectId, commentObject, open = false, onClose} = props;

  // RETRIEVE OBJECTS
  const {obj, setObj} = useSCFetchCommentObject({id: commentObjectId, commentObject});

  // STATE
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [votes, setVotes] = useState([]);
  const [next, setNext] = useState<string>(null);

  useEffect(() => {
    if (obj) {
      fetchVotes();
    }
  }, [obj.id]);

  function fetchVotes() {
    setIsLoading(true);
    http
      .request({
        url: next ? next : `${Endpoints.VotesList.url({type: SCCommentTypologyType, id: obj.id})}`,
        method: Endpoints.VotesList.method
      })
      .then((res: HttpResponse<any>) => {
        const data: {results: Record<string, any>[]; next?: string} = res.data;
        setVotes([...data.results, ...votes]);
        setIsLoading(false);
        setNext(data.next !== null ? data.next : null);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  return (
    <BaseDialog
      title={<FormattedMessage defaultMessage="ui.commentObjectVotesDialog.title" id="ui.commentObjectVotesDialog.title" />}
      onClose={onClose}
      open={open}>
      {isLoading ? (
        <CentralProgress size={50} />
      ) : (
        <InfiniteScroll
          dataLength={votes.length}
          next={fetchVotes}
          hasMore={next !== null}
          loader={<CentralProgress size={30} />}
          height={400}
          endMessage={
            <Typography variant="body2" align="center">
              <b>
                <FormattedMessage id="ui.commentObjectVotesDialog.noOtherVotes" defaultMessage="ui.commentObjectVotesDialog.noOtherVotes" />
              </b>
            </Typography>
          }>
          <List>
            {votes.slice(0, 4).map((like, index) => (
              <ListItem key={index}>
                <User elevation={0} user={like.user} key={index} />
              </ListItem>
            ))}
          </List>
        </InfiniteScroll>
      )}
    </BaseDialog>
  );
}
