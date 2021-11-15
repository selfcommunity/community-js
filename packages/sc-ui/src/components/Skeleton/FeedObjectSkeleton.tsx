import React from 'react';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {FeedObjectComponentType} from '../FeedObject';
import {CardContent, CardHeader} from '@mui/material';

const PREFIX = 'SCFeedObjectSkeleton';

const classes = {
  media: `${PREFIX}-media`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2),
  [`& .${classes.media}`]: {
    height: 190
  }
}));

export default function FeedObjectSkeleton(props: {type?: FeedObjectComponentType; [p: string]: any}): JSX.Element {
  const {type, ...rest} = props;
  const _type = type || FeedObjectComponentType.SNIPPET;
  let obj;
  if (_type === FeedObjectComponentType.PREVIEW || _type === FeedObjectComponentType.DETAIL) {
    obj = (
      <React.Fragment>
        <CardHeader
          avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
          title={<Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}} />}
          subheader={<Skeleton animation="wave" height={10} width="40%" />}
        />
        <Skeleton animation="wave" variant="rectangular" className={classes.media} />
        <CardContent>
          <React.Fragment>
            <Skeleton animation="wave" height={10} style={{marginBottom: 6}} />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        </CardContent>
      </React.Fragment>
    );
  } else {
    obj = (
      <ListItem>
        <ListItemAvatar>
          <Skeleton animation="wave" variant="circular" width={40} height={40} />
        </ListItemAvatar>
        <ListItemText
          primary={<Skeleton animation="wave" height={10} width={120} style={{marginBottom: 10}} />}
          secondary={<Skeleton animation="wave" height={10} width={70} style={{marginBottom: 10}} />}
        />
      </ListItem>
    );
  }

  return (
    <Root {...rest}>
      <div className={`${PREFIX}-${_type}`}>
        <List>{obj}</List>
      </div>
    </Root>
  );
}
