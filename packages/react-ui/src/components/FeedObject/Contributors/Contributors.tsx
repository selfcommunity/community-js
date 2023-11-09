import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {CacheStrategies} from '@selfcommunity/utils';
import {useSCFetchContributors} from '@selfcommunity/react-core';
import {SCContributionType, SCFeedObjectType, SCUserType} from '@selfcommunity/types';
import {Avatar, AvatarGroup, Box, Button, List, ListItem, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import BaseDialog from '../../../shared/BaseDialog';
import CentralProgress from '../../../shared/CentralProgress';
import InfiniteScroll from '../../../shared/InfiniteScroll';
import User from '../../User';
import classNames from 'classnames';
import ContributorsSkeleton from './Skeleton';
import {PREFIX} from '../constants';

const classes = {
  root: `${PREFIX}-contributors-root`,
  avatarGroup: `${PREFIX}-contributors-avatarGroup`,
  btnParticipants: `${PREFIX}-contributors-btn-participants`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'ContributorsRoot'
})(() => ({}));

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
  feedObjectType: Exclude<SCContributionType, SCContributionType.COMMENT>;

  /**
   * AvatarGroupSkeleton props
   * @default {count: 3}
   */
  ContributorsSkeletonProps?: any;

  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function ContributorsFeedObject(props: ContributorsFeedObjectProps): JSX.Element {
  // PROPS
  const {
    className = null,
    feedObjectId = null,
    feedObject = null,
    feedObjectType = null,
    ContributorsSkeletonProps = {},
    cacheStrategy = CacheStrategies.CACHE_FIRST,
    ...rest
  } = props;

  const contributorsObject = useSCFetchContributors({
    id: feedObjectId,
    feedObject,
    feedObjectType,
    pageSize: 10,
    cacheStrategy
  });

  // STATE
  const [openContributorsDialog, setOpenContributorsDialog] = useState<boolean>(false);

  /**
   * On mount fetches contributors
   */
  useEffect(() => {
    if (contributorsObject.feedObject) {
      contributorsObject.getNextPage();
    }
  }, [contributorsObject.feedObject]);

  /**
   * Renders root object (if obj)
   */
  if (!contributorsObject.feedObject) {
    return null;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Box>
        {contributorsObject.isLoadingNext && !openContributorsDialog ? (
          <ContributorsSkeleton {...ContributorsSkeletonProps} />
        ) : (
          <>
            {contributorsObject.contributors.length > 0 ? (
              <>
                <Button variant="text" onClick={() => setOpenContributorsDialog(true)} classes={{root: classes.btnParticipants}} color="inherit">
                  <FormattedMessage id={'ui.feedObject.contributors.participants'} defaultMessage={'ui.feedObject.contributors.participants'} />:
                  <AvatarGroup {...rest}>
                    {contributorsObject.contributors.map((c: SCUserType, i) => (
                      <Avatar alt={c.username} src={c.avatar} key={i} />
                    ))}
                    {[...Array(Math.max(contributorsObject.total - contributorsObject.contributors.length, 0))].map((x, i) => (
                      <Avatar key={i}></Avatar>
                    ))}
                  </AvatarGroup>
                </Button>
                {openContributorsDialog && (
                  <BaseDialog
                    title={
                      <FormattedMessage
                        defaultMessage="ui.feedObject.contributors.title"
                        id="ui.feedObject.contributors.title"
                        values={{total: contributorsObject.total}}
                      />
                    }
                    onClose={() => setOpenContributorsDialog(false)}
                    open={openContributorsDialog}>
                    {contributorsObject.isLoadingNext ? (
                      <CentralProgress size={50} />
                    ) : (
                      <InfiniteScroll
                        dataLength={contributorsObject.contributors.length}
                        next={contributorsObject.getNextPage()}
                        hasMoreNext={Boolean(contributorsObject.next)}
                        loaderNext={<CentralProgress size={30} />}
                        height={400}
                        endMessage={
                          <Typography variant="body2" align="center" fontWeight="bold">
                            <FormattedMessage
                              id="ui.feedObject.contributors.noOtherContributors"
                              defaultMessage="ui.feedObject.contributors.noOtherContributors"
                            />
                          </Typography>
                        }>
                        <List>
                          {contributorsObject.contributors.map((c, i) => (
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
    </Root>
  );
}
