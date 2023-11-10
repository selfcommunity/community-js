import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, BoxProps, Button} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import AvatarGroupSkeleton from '../../Skeleton/AvatarGroupSkeleton';
import classNames from 'classnames';
import {PREFIX} from '../constants';

const classes = {
  root: `${PREFIX}-contributors-skeleton-root`,
  btnParticipants: `${PREFIX}-btn-participants`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'ContributorsSkeletonRoot'
})(() => ({}));

export interface ContributorsSkeleton extends BoxProps {
  /**
   * AvatarGroupSkeleton props
   * @default {count: 3}
   */
  AvatarGroupSkeletonProps?: any;

  /**
   * Other props
   */
  [p: string]: any;
}
/**
 * > API documentation for the Community-JS Contributors Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ContributorsSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCFeedObject-contributors-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFeedObject-contributors-skeleton-root|Styles applied to the root element.|
 *
 */
export default function ContributorsSkeleton(props): JSX.Element {
  const {className = null, AvatarGroupSkeletonProps = {}, ...rest} = props;
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Button variant="text" disabled classes={{root: classes.btnParticipants}}>
        <FormattedMessage id={'ui.feedObject.contributors.participants'} defaultMessage={'ui.feedObject.contributors.participants'} />:
        <AvatarGroupSkeleton {...props.AvatarGroupSkeletonProps} />
      </Button>
    </Root>
  );
}
