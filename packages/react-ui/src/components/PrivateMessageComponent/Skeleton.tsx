import React from 'react';
import {styled} from '@mui/material/styles';
import {Grid, useMediaQuery, useTheme} from '@mui/material';
import PrivateMessageSnippetsSkeleton from '../PrivateMessageSnippets/Skeleton';
import PrivateMessageThreadSkeleton from '../PrivateMessageThread/Skeleton';
import classNames from 'classnames';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  snippetsSection: `${PREFIX}-snippets-section`,
  threadSection: `${PREFIX}-thread-section`
};
const Root = styled(Grid, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

interface PrivateMessageComponentSkeletonMap {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
}
export type PrivateMessageComponentProps = React.PropsWithChildren<PrivateMessageComponentSkeletonMap>;
/**
 * > API documentation for the Community-JS Private Messages Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageComponentSkeleton} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCPrivateMessageComponentSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageComponent-skeleton-root|Styles applied to the root element.|
 |snippetsSection|.SCPrivateMessageComponent-snippets-section|Styles applied to the snippets section|
 |threadSection|.SCPrivateMessageComponent-thread-section|Styles applied to the thread section|
 *
 */
export default function PrivateMessageComponentSkeleton(props: PrivateMessageComponentProps): JSX.Element {
  const {className} = props;
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Root container className={classNames(classes.root, className)}>
      {!isMobile && (
        <Grid item xs={12} md={5} className={classes.snippetsSection}>
          <PrivateMessageSnippetsSkeleton />
        </Grid>
      )}
      <Grid item xs={12} md={7} className={classes.threadSection}>
        <PrivateMessageThreadSkeleton />
      </Grid>
    </Root>
  );
}
