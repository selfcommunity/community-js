import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, AvatarGroup, AvatarGroupProps, Skeleton, useTheme} from '@mui/material';
import {SCThemeType} from '@selfcommunity/react-core';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCAvatarGroupSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(AvatarGroup, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface AvatarGroupSkeletonProps extends AvatarGroupProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Number of visible avatars
   */
  count?: number;
  /**
   * Disable skeleton animation
   */
  skeletonsAnimation?: false | 'wave' | 'pulse';
}

/**
 * > API documentation for the Community-JS Avatar Group Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {AvatarGroupSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCAvatarGroupSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCAvatarGroupSkeleton-root|Styles applied to the root element.|
 *
 */
export default function AvatarGroupSkeleton(inProps): JSX.Element {
  // PROPS
  const props: AvatarGroupSkeletonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, skeletonsAnimation = 'wave', count = 2, ...rest} = props;
  const theme = useTheme<SCThemeType>();

  return (
    <Root className={classes.root} {...rest}>
      {[...Array(count + 1)].map((x, i) => (
        <Avatar key={i}>
          <Skeleton
            variant="circular"
            width={theme.selfcommunity.user.avatar.sizeSmall}
            height={theme.selfcommunity.user.avatar.sizeSmall}
            animation={skeletonsAnimation}
          />
        </Avatar>
      ))}
    </Root>
  );
}
