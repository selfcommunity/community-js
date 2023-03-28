import React from 'react';
import {styled} from '@mui/material/styles';
import {Grid, useMediaQuery, useTheme} from '@mui/material';
import PrivateMessageSnippetsSkeleton from '../PrivateMessageSnippets/Skeleton';
import PrivateMessageThreadSkeleton from '../PrivateMessageThread/Skeleton';
import classNames from 'classnames';
import {SCThemeType} from '@selfcommunity/react-core';

const PREFIX = 'SCPrivateMessageComponentSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  snippetsSection: `${PREFIX}-snippets-section`,
  threadSection: `${PREFIX}-thread-section`
};
const Root = styled(Grid, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
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
 |root|.SCPrivateMessageComponentSkeleton-root|Styles applied to the root element.|
 |snippetsSection|.SCPrivateMessageComponentSkeleton-snippets-section|Styles applied to the snippets section|
 |threadSection|.SCPrivateMessageComponentSkeleton-thread-section|Styles applied to the thread section|
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
