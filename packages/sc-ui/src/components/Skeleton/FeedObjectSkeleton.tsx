import React from 'react';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {FeedObjectTemplateType} from '../FeedObject';
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
  width: '100%',
  maxWidth: 700,
  marginBottom: theme.spacing(2),
  [`& .${classes.media}`]: {
    height: 190
  }
}));

export default function FeedObjectSkeleton(props: {template?: FeedObjectTemplateType; [p: string]: any}): JSX.Element {
  const {template, ...rest} = props;
  const _template = template || FeedObjectTemplateType.SNIPPET;
  let obj;
  if (_template === FeedObjectTemplateType.PREVIEW || _template === FeedObjectTemplateType.DETAIL) {
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
      <React.Fragment>
        <CardHeader
          avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
          title={<Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}} />}
          subheader={<Skeleton animation="wave" height={10} width="40%" />}
        />
        <CardContent>
          <React.Fragment>
            <Skeleton animation="wave" height={10} style={{marginBottom: 6}} />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        </CardContent>
      </React.Fragment>
    );
  }

  return (
    <Root {...rest}>
      <div className={`${PREFIX}-${_template}`}>
        <List>{obj}</List>
      </div>
    </Root>
  );
}
