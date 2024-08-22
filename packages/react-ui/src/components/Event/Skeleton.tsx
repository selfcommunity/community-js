import React from 'react';
import {AvatarGroup, Box, Button, CardContent, Divider, Icon, Stack} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {PREFIX} from './constants';
import BaseItem from '../../shared/BaseItem';
import {SCEventTemplateType} from '../../types/event';
import Widget, {WidgetProps} from '../Widget';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  skeletonDetailRoot: `${PREFIX}-skeleton-detail-root`,
  skeletonPreviewRoot: `${PREFIX}-skeleton-preview-root`,
  skeletonSnippetRoot: `${PREFIX}-skeleton-snippet-root`,
  skeletonDetailCalendar: `${PREFIX}-skeleton-detail-calendar`,
  skeletonDetailContent: `${PREFIX}-skeleton-detail-content`,
  skeletonDetailUser: `${PREFIX}-skeleton-detail-user`,
  skeletonDetailFirstDivider: `${PREFIX}-skeleton-detail-first-divider`,
  skeletonDetailSecondDivider: `${PREFIX}-skeleton-detail-second-divider`,
  skeletonPreviewContent: `${PREFIX}-skeleton-preview-content`,
  skeletonSnippetImage: `${PREFIX}-skeleton-snippet-image`,
  skeletonSnippetAction: `${PREFIX}-skeleton-snippet-action`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

const SkeletonDetailRoot = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonDetailRoot'
})(() => ({}));

const SkeletonPreviewRoot = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonPreviewRoot'
})(() => ({}));

const SkeletonSnippetRoot = styled(BaseItem, {
  name: PREFIX,
  slot: 'SkeletonSnippetRoot'
})(() => ({}));

export interface EventSkeletonProps extends WidgetProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Event template type
   * @default 'preview'
   */
  template?: SCEventTemplateType;
  /**
   * Prop to pass an action to be rendered next to the skeleton
   */
  actions?: React.ReactNode;
}

/**
 * > API documentation for the Community-JS Event Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {EventSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCEvent-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEvent-skeleton-root|Styles applied to the root element.|
 |image|.SCEvent-skeleton-image|Styles applied to the image element.|
 |action|.SCEvent-skeleton-action|Styles applied to action section.|
 *
 */
export default function EventSkeleton(inProps: EventSkeletonProps): JSX.Element {
  // PROPS
  const props: EventSkeletonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, template = SCEventTemplateType.SNIPPET, actions, ...rest} = props;
  /**
   * Renders event object
   */
  let contentObj: React.ReactElement;
  if (template === SCEventTemplateType.DETAIL) {
    contentObj = (
      <SkeletonDetailRoot className={classes.skeletonDetailRoot}>
        <Box position="relative">
          <Skeleton variant="rectangular" animation="wave" width="100%" height="170px" />
          <Skeleton className={classes.skeletonDetailCalendar} variant="rounded" animation="wave" width="60px" height="60px" />
        </Box>

        <CardContent className={classes.skeletonDetailContent}>
          <Skeleton animation="wave" width="36%" height="40px" />

          <Stack direction="row" alignItems="center" gap="8px" marginBottom="9px">
            <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
            <Skeleton animation="wave" width="50%" height="20px" />
          </Stack>

          <Stack direction="row" alignItems="center" gap="8px" marginBottom="9px">
            <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
            <Skeleton animation="wave" width="35%" height="20px" />
          </Stack>

          <Stack direction="row" alignItems="center" gap="8px" marginBottom="14px">
            <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
            <Skeleton animation="wave" width="27%" height="20px" />
          </Stack>

          <Stack direction="row" gap="8px" className={classes.skeletonDetailUser}>
            <Skeleton animation="wave" variant="circular" width="36px" height="36px" />
            <Stack gap="1px">
              <Skeleton animation="wave" width="75px" height="15px" />
              <Skeleton animation="wave" width="86px" height="16px" />
            </Stack>
          </Stack>

          <Divider className={classes.skeletonDetailFirstDivider} />

          <Stack direction="row" gap="8px" alignItems="center" height="28px">
            <Skeleton animation="wave" width="68px" height="20px" />
            <AvatarGroup>
              <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
              <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
              <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
              <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
            </AvatarGroup>
          </Stack>

          <Divider className={classes.skeletonDetailSecondDivider} />
        </CardContent>
      </SkeletonDetailRoot>
    );
  } else if (template === SCEventTemplateType.PREVIEW) {
    contentObj = (
      <SkeletonPreviewRoot className={classes.skeletonPreviewRoot}>
        <Box position="relative">
          <Skeleton variant="rectangular" animation="wave" width="100%" height="80px" />
        </Box>

        <CardContent className={classes.skeletonPreviewContent}>
          <Stack direction="row" alignItems="center" gap="8px">
            <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
            <Skeleton animation="wave" width="30%" height="16px" />
          </Stack>

          <Skeleton animation="wave" width="46%" height="20px" />

          <Stack direction="row" alignItems="center" gap="8px" marginBottom="14px">
            <Skeleton animation="wave" width="27%" height="16px" />
          </Stack>

          <Stack direction="row" gap="8px" alignItems="center" height="28px">
            <AvatarGroup>
              <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
              <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
              <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
              <Skeleton animation="wave" variant="circular" width="21px" height="21px" />
            </AvatarGroup>
            <Skeleton animation="wave" width="10%" height="20px" />
          </Stack>
        </CardContent>
      </SkeletonPreviewRoot>
    );
  } else {
    contentObj = (
      <SkeletonSnippetRoot
        elevation={0}
        square={true}
        disableTypography
        className={classes.skeletonSnippetRoot}
        image={
          <Box className={classes.skeletonSnippetImage}>
            <Skeleton animation="wave" variant="rectangular" width={100} height={60} /> <Icon fontSize="large">CalendarIcon</Icon>
          </Box>
        }
        primary={<Skeleton animation="wave" variant="rectangular" height={10} width="40%" style={{marginBottom: 12}} />}
        secondary={
          <>
            <Skeleton animation="wave" variant="rectangular" height={10} width="60%" style={{marginBottom: 10, marginRight: 5}} />
            <Skeleton animation="wave" variant="rectangular" height={10} width="35%" />
          </>
        }
        actions={
          <>
            {actions ?? (
              <Button size="small" variant="outlined" disabled>
                <Skeleton animation="wave" height={10} width={30} style={{marginTop: 5, marginBottom: 5}} />
              </Button>
            )}
          </>
        }
      />
    );
  }
  return (
    <Root className={classNames(classes.root, className, `${PREFIX}-skeleton-${template}`)} {...rest}>
      {contentObj}
    </Root>
  );
}
