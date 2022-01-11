import React from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {SCCustomAdvPosition, useSCFetchCustomAdv} from '@selfcommunity/core';

const PREFIX = 'SCCustomAdv';

const classes = {
  image: `${PREFIX}-image`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`& .${classes.image}`]: {
    width: '100%'
  }
}));

export interface CustomAdvProps {
  /**
   * Id of the feed object
   * @default 'custom_adv'
   */
  id?: string;

  /**
   * Override or extend the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Position of the ADV
   */
  position: SCCustomAdvPosition;

  /**
   * Category id if the adv must be related to a specific category
   */
  categoryId?: number | null;
}

export default function CustomAdv(props: CustomAdvProps): JSX.Element {
  // PROPS
  const {id = 'custom_adv', className = null, position, categoryId = null} = props;

  // retrieve adv
  const {scCustomAdv} = useSCFetchCustomAdv({position, categoryId});

  if (!scCustomAdv) {
    return null;
  }

  const adv = (
    <React.Fragment>
      {scCustomAdv.image && <img src={scCustomAdv.image} alt={scCustomAdv.title} className={classes.image} />}
      {scCustomAdv.embed_code && <span dangerouslySetInnerHTML={{__html: scCustomAdv.embed_code}} />}
    </React.Fragment>
  );

  return (
    <Root id={id} className={className}>
      {scCustomAdv.link ? (
        <a href={scCustomAdv.link} title={scCustomAdv.title}>
          {adv}
        </a>
      ) : (
        adv
      )}
    </Root>
  );
}
