import {AvatarGroup, Box, BoxProps, CardContent, Stack, useTheme, Skeleton, styled} from '@mui/material';
import {useThemeProps} from '@mui/system';
import {SCThemeType} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {PREFIX} from './constants';
import Widget from '../Widget';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  skeletonPreviewRoot: `${PREFIX}-skeleton-preview-root`,
  skeletonPreviewContent: `${PREFIX}-skeleton-preview-content`,
  skeletonPreviewName: `${PREFIX}-skeleton-preview-name`,
  skeletonPreviewActions: `${PREFIX}-skeleton-preview-actions`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

const SkeletonPreviewRoot = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonPreviewRoot'
})(() => ({}));

export interface PaymentOrderSkeletonProps extends BoxProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
}

/**
 * > API documentation for the Community-JS PaymentOrder Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PaymentOrderSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPaymentOrder-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPaymentOrder-skeleton-root|Styles applied to the root element.|
 |image|.SCPaymentOrder-skeleton-image|Styles applied to the image element.|
 *
 */
export default function PaymentOrderSkeleton(inProps: PaymentOrderSkeletonProps): JSX.Element {
  // PROPS
  const props: PaymentOrderSkeletonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, ...rest} = props;
  const theme = useTheme<SCThemeType>();

  /**
   * Renders event object
   */
  let contentObj: React.ReactElement;
  contentObj = (
    <SkeletonPreviewRoot className={classes.skeletonPreviewRoot}>
      <Box position="relative">
        <Skeleton variant="rectangular" width="100%" height="80px" />
      </Box>

      <CardContent className={classes.skeletonPreviewContent}>
        <Stack direction="row" alignItems="center" gap="8px">
          <Skeleton variant="circular" width="21px" height="21px" />
          <Skeleton width="50%" height="20px" />
        </Stack>

        <Skeleton width="67%" height="25px" className={classes.skeletonPreviewName} />

        <Stack direction="row" alignItems="center" gap="8px" marginBottom="2px">
          <Skeleton width="27%" height="18px" />
        </Stack>

        <Stack direction="row" gap="8px" alignItems="center">
          <AvatarGroup>
            <Skeleton
              variant="circular"
              width={`${theme.selfcommunity.user.avatar.sizeSmall}px`}
              height={`${theme.selfcommunity.user.avatar.sizeSmall}px`}
            />
            <Skeleton
              variant="circular"
              width={`${theme.selfcommunity.user.avatar.sizeSmall}px`}
              height={`${theme.selfcommunity.user.avatar.sizeSmall}px`}
            />
            <Skeleton
              variant="circular"
              width={`${theme.selfcommunity.user.avatar.sizeSmall}px`}
              height={`${theme.selfcommunity.user.avatar.sizeSmall}px`}
            />
          </AvatarGroup>
        </Stack>
      </CardContent>
    </SkeletonPreviewRoot>
  );
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {contentObj}
      <Stack direction="column" alignItems="flex-start" gap="8px" marginTop="8px">
        <Skeleton width="50%" height="18px" />
        <Skeleton width="35%" height="18px" />
        <Skeleton width="20%" height="18px" />
      </Stack>
    </Root>
  );
}
