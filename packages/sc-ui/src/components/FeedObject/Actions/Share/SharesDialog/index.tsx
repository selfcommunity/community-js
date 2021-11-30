import React, {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {List} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import Typography from '@mui/material/Typography';
import {Endpoints, http, Logger, SCFeedObjectType, SCFeedObjectTypologyType, useSCFetchFeedObject} from '@selfcommunity/core';
import {SCOPE_SC_UI} from '../../../../../constants/Errors';
import {AxiosResponse} from 'axios';
import BaseDialog from '../../../../../shared/BaseDialog';
import CentralProgress from '../../../../../shared/CentralProgress';
import User from '../../../../User';

export default function SharesDialog({
  id = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST,
  open = false,
  onClose = null,
  ...rest
}: {
  id?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
  open: boolean;
  onClose: () => any;
  [p: string]: any;
}): JSX.Element {
  const {obj, setObj} = useSCFetchFeedObject({id, feedObject, feedObjectType});
  const [isLoading, setIsLoading] = useState<boolean>(Boolean((id && feedObjectType) || feedObject));
  const [shares, setShares] = useState([]);
  const [next, setNext] = useState<string>(
    id && feedObjectType
      ? `${Endpoints.ShareUsersList.url({type: feedObjectType, id: id})}`
      : feedObject && feedObjectType
      ? `${Endpoints.ShareUsersList.url({type: feedObjectType, id: feedObject.id})}`
      : null
  );

  useEffect(() => {
    if (obj && next) {
      fetchShares();
    }
  }, [obj.id]);

  function fetchShares() {
    setIsLoading(true);
    http
      .request({
        url: next,
        method: Endpoints.ShareUsersList.method
      })
      .then((res: AxiosResponse<any>) => {
        const data: {results: Record<string, any>[]; next?: string} = res.data;
        setShares([...data.results, ...shares]);
        setIsLoading(false);
        setNext(data.next !== null ? data.next : null);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  return (
    <BaseDialog title={<FormattedMessage defaultMessage="ui.feedObject.sharesDialog.title" id="ui.feedObject.sharesDialog.title" />} onClose={onClose} open={open}>
      {isLoading ? (
        <CentralProgress size={50} />
      ) : (
        <InfiniteScroll
          dataLength={shares.length}
          next={fetchShares}
          hasMore={next !== null}
          loader={<CentralProgress size={30} />}
          height={400}
          endMessage={
            <Typography variant="body2" align="center">
              <b>
                <FormattedMessage id="ui.feedObject.sharesDialog.noOtherLikes" defaultMessage="ui.feedObject.sharesDialog.noOtherLikes" />
              </b>
            </Typography>
          }>
          <List>
            {shares.slice(0, 4).map((like, index) => (
              <User elevation={0} user={like.user} key={index} />
            ))}
          </List>
        </InfiniteScroll>
      )}
    </BaseDialog>
  );
}
