import React, {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {Box, List} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import Typography from '@mui/material/Typography';
import {Endpoints, http, Logger, SCCommentType, useSCFetchCommentObject} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../../../constants/Errors';
import BaseDialog from '../../../../shared/BaseDialog';
import CentralProgress from '../../../../shared/CentralProgress';
import User from '../../../User';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCCommentObjectVotesDialog';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})({});

export default function CommentObjectVotesDialog({
  id = null,
  commentObject = null,
  open = false,
  onClose = null,
  ...rest
}: {
  id?: number;
  commentObject?: SCCommentType;
  open: boolean;
  onClose: () => any;
  [p: string]: any;
}): JSX.Element {
  const {obj, setObj} = useSCFetchCommentObject({id, commentObject});
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
    console.log(obj);
    http
      .request({
        url: next ? next : `${Endpoints.CommentVotes.url({id: obj.id})}`,
        method: Endpoints.CommentVotes.method
      })
      .then((res: AxiosResponse<any>) => {
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
              <User elevation={0} user={like.user} key={index} />
            ))}
          </List>
        </InfiniteScroll>
      )}
    </BaseDialog>
  );
}
