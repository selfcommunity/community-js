import React, {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {List, ListItem} from '@mui/material';
import InfiniteScroll from '../../../../../shared/InfiniteScroll';
import Typography from '@mui/material/Typography';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {useSCFetchFeedObject} from '@selfcommunity/react-core';
import {SCContributionType, SCFeedObjectType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../../../../constants/Errors';
import BaseDialog from '../../../../../shared/BaseDialog';
import CentralProgress from '../../../../../shared/CentralProgress';
import User from '../../../../User';

export interface ShareDialogProps {
  /**
   * Feed object id
   * @default null
   */
  id?: number;
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
   * Opens dialog
   * @default false
   */
  open: boolean;
  /**
   * On dialog close callback function
   */
  onClose: () => any;
  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function SharesDialog(props: ShareDialogProps): JSX.Element {
  // PROPS
  const {
    id = null,
    feedObject = null,
    feedObjectType = feedObject ? feedObject.type : SCContributionType.POST,
    open = false,
    onClose = null,
    ...rest
  } = props;

  // STATE
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

  /**
   * On mount, fetches shares
   */
  useEffect(() => {
    if (obj && next) {
      fetchShares();
    }
  }, [`${obj}`]);

  /**
   * Fetches shares
   */
  function fetchShares() {
    setIsLoading(true);
    http
      .request({
        url: next,
        method: Endpoints.ShareUsersList.method
      })
      .then((res: HttpResponse<any>) => {
        const data: {results: Record<string, any>[]; next?: string} = res.data;
        setShares([...shares, ...data.results]);
        setIsLoading(false);
        setNext(data.next !== null ? data.next : null);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Renders shares dialog
   */
  return (
    <BaseDialog
      title={<FormattedMessage defaultMessage="ui.feedObject.sharesDialog.title" id="ui.feedObject.sharesDialog.title" />}
      onClose={onClose}
      open={open}
      {...rest}>
      {isLoading ? (
        <CentralProgress size={50} />
      ) : (
        <InfiniteScroll
          dataLength={shares.length}
          next={fetchShares}
          hasMoreNext={next !== null}
          loaderNext={<CentralProgress size={30} />}
          height={400}
          endMessage={
            <Typography variant="body2" align="center" fontWeight="bold">
              <FormattedMessage id="ui.feedObject.sharesDialog.noOtherLikes" defaultMessage="ui.feedObject.sharesDialog.noOtherLikes" />
            </Typography>
          }>
          <List>
            {shares.slice(0, 4).map((user, index) => (
              <ListItem key={user.id}>
                <User elevation={0} user={user} key={index} />
              </ListItem>
            ))}
          </List>
        </InfiniteScroll>
      )}
    </BaseDialog>
  );
}
