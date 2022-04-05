import React from 'react';
import Widget, {WidgetProps} from '../Widget';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import UserSkeleton from '../User/Skeleton';
import {CardContent, ListItem} from '@mui/material';

const PREFIX = 'SCTrendingPeopleSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget)(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2),
  [`& .${classes.list}`]: {
    marginLeft: -16,
    marginRight: -16
  }
}));

export default function TrendingPeopleSkeleton(props: WidgetProps): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(4)].map((person, index) => (
            <ListItem key={index}>
              <UserSkeleton elevation={0} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
