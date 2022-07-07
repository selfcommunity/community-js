import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, BoxProps, Button} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import AvatarGroupSkeleton from '../../Skeleton/AvatarGroupSkeleton';
import classNames from 'classnames';

const PREFIX = 'SCContributorsSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  btnParticipants: `${PREFIX}-btn-participants`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.btnParticipants}`]: {
    marginLeft: -10
  }
}));

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

 The name `SCContributorsSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCContributorsSkeleton-root|Styles applied to the root element.|
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
