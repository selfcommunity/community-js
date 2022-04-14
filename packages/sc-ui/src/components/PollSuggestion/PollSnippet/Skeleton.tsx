import React from 'react';
import {Button} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import BaseItem from '../../../shared/BaseItem';
import {WidgetProps} from '../../Widget';

const PREFIX = 'SCPollSnippetSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(BaseItem)(({theme}) => ({}));

/**
 * > API documentation for the Community-UI Poll Snippet Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PollSnippetSkeleton} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCPollSnippetSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPollSnippetSkeleton-root|Styles applied to the root element.|
 *
 */
export default function PollSnippetSkeleton(props: WidgetProps): JSX.Element {
  return (
    <Root
      className={classes.root}
      {...props}
      primary={<Skeleton animation="wave" height={10} width={120} style={{marginBottom: 10}} />}
      secondary={<Skeleton animation="wave" height={10} width={70} style={{marginBottom: 10}} />}
      actions={
        <Button size="small" variant="outlined" disabled>
          <Skeleton animation="wave" height={10} width={50} style={{marginTop: 5, marginBottom: 5}} />
        </Button>
      }
    />
  );
}
