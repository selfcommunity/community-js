import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {useSCFetchFeedObject} from '@selfcommunity/react-core';
import {SCFeedObjectType, SCFeedObjectTypologyType, SCUserType} from '@selfcommunity/types';
import {Avatar, AvatarGroup, Box, Button, Fade, List, ListItem} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import AvatarGroupSkeleton from '../../Skeleton/AvatarGroupSkeleton';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import BaseDialog from '../../../shared/BaseDialog';
import CentralProgress from '../../../shared/CentralProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import User from '../../User';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCContributorsFeedObject';

const classes = {
  root: `${PREFIX}-root`,
  avatarGroup: `${PREFIX}-avatarGroup`,
  avatar: `${PREFIX}-avatar`,
  btnParticipants: `${PREFIX}-btn-participants`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: 0,
  marginBottom: 0,
  [`& .${classes.btnParticipants}`]: {
    marginLeft: -10
  },
  ['& .MuiAvatarGroup-root']: {
    justifyContent: 'flex-end'
  },
  ['& .MuiAvatar-root']: {
    backgroundColor: '#d5d5d5',
    border: '2px solid #FFF !important',
    color: '#FFF',
    fontSize: '0.55rem',
    width: 24,
    height: 24,
    marginLeft: -7,
    lineHeight: '24px'
  }
}));

export interface ContributorsFeedObjectProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * feedObjectId object
   */
  feedObjectId?: number;
  /**
   * feedObject object
   */
  feedObject?: SCFeedObjectType;
  /**
   * feedObjectType
   */
  feedObjectType: SCFeedObjectTypologyType;
  /**
   * AvatarGroupSkeleton props
   * @default {count: 3}
   */
  AvatarGroupSkeletonProps?: any;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function ContributorsFeedObject(inProps: ContributorsFeedObjectProps): JSX.Element {
  // PROPS
  const props: ContributorsFeedObjectProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className = null, feedObjectId = null, feedObject = null, feedObjectType = null, AvatarGroupSkeletonProps = {}, ...rest} = props;

  // STATE
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [contributors, setContributors] = useState<SCUserType[]>([]);
  const [openContributorsDialog, setOpenContributorsDialog] = useState<boolean>(false);
  const [next, setNext] = useState<string>(
    feedObjectId || obj ? `${Endpoints.Contributors.url({id: feedObjectId ? feedObjectId : obj['id'], type: feedObjectType})}?limit=10` : null
  );

  /**
   * Fetches contributors
   */
  const fetchContributors = useMemo(
    () => () => {
      if (next) {
        http
          .request({
            url: next,
            method: Endpoints.Contributors.method
          })
          .then((res: HttpResponse<any>) => {
            if (res.status < 300) {
              const data = res.data;
              setContributors([...contributors, ...data['results']]);
              setTotal(data['count']);
              setNext(data['next']);
              setLoading(false);
            }
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [obj, contributors, next, loading]
  );

  /**
   * On mount fetches contributors
   */
  useEffect(() => {
    if (obj) {
      fetchContributors();
    }
  }, [obj]);

  /**
   * Renders root object (if obj)
   */
  if (!obj) {
    return null;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Fade in>
        <Box>
          {loading && !openContributorsDialog ? (
            <Button variant="text" disabled classes={{root: classes.btnParticipants}}>
              <FormattedMessage id={'ui.feedObject.contributors.participants'} defaultMessage={'ui.feedObject.contributors.participants'} />:
              <AvatarGroupSkeleton {...AvatarGroupSkeletonProps} />
            </Button>
          ) : (
            <>
              {contributors.length > 0 ? (
                <>
                  <Button variant="text" onClick={() => setOpenContributorsDialog(true)} classes={{root: classes.btnParticipants}} color="inherit">
                    <FormattedMessage id={'ui.feedObject.contributors.participants'} defaultMessage={'ui.feedObject.contributors.participants'} />:
                    <AvatarGroup {...rest}>
                      {contributors.map((c: SCUserType, i) => (
                        <Avatar alt={c.username} src={c.avatar} key={i} />
                      ))}
                      {[...Array(Math.max(total - contributors.length, 0))].map((x, i) => (
                        <Avatar key={i}></Avatar>
                      ))}
                    </AvatarGroup>
                  </Button>
                  {openContributorsDialog && (
                    <BaseDialog
                      title={
                        <FormattedMessage defaultMessage="ui.feedObject.contributors.title" id="ui.feedObject.contributors.title" values={{total}} />
                      }
                      onClose={() => setOpenContributorsDialog(false)}
                      open={openContributorsDialog}>
                      {loading ? (
                        <CentralProgress size={50} />
                      ) : (
                        <InfiniteScroll
                          dataLength={contributors.length}
                          next={fetchContributors}
                          hasMore={Boolean(next)}
                          loader={<CentralProgress size={30} />}
                          height={400}
                          endMessage={
                            <p style={{textAlign: 'center'}}>
                              <b>
                                <FormattedMessage
                                  id="ui.feedObject.contributors.noOtherContributors"
                                  defaultMessage="ui.feedObject.contributors.noOtherContributors"
                                />
                              </b>
                            </p>
                          }>
                          <List>
                            {contributors.map((c, i) => (
                              <ListItem key={i}>
                                <User elevation={0} user={c} key={c.id} sx={{m: 0}} />
                              </ListItem>
                            ))}
                          </List>
                        </InfiniteScroll>
                      )}
                    </BaseDialog>
                  )}
                </>
              ) : null}
            </>
          )}
        </Box>
      </Fade>
    </Root>
  );
}
