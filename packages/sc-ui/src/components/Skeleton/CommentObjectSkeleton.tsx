import React from 'react';
import Card from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {Box, CardContent, ListItem, ListItemAvatar, ListItemText} from '@mui/material';

const PREFIX = 'SCCommentObjectSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  avatarWrap: `${PREFIX}-avatar-wrap`,
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(3),
  [`& .${classes.avatarWrap}`]: {
    minWidth: 46
  },
}));

export default function CommentObjectSkeleton(props): JSX.Element {
  return (
    <Root>
      <ListItem button={false} alignItems="flex-start">
        <ListItemAvatar classes={{root: classes.avatarWrap}}>
          <Skeleton animation="wave" variant="circular" width={35} height={35} />
        </ListItemAvatar>
        <ListItemText
          secondary={
            <>
              <Card {...props}>
                <CardContent>
                  <Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}} />
                  <Skeleton animation="wave" height={10} width="40%" />
                </CardContent>
              </Card>
            </>
          }
        />
      </ListItem>
    </Root>
  );
}
