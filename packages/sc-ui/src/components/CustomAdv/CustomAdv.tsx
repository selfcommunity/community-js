import React from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {SCCustomAdvPosition, useSCFetchCustomAdv} from '@selfcommunity/core';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCCustomAdv';

const classes = {
  root: `${PREFIX}-root`,
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
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Position of the ADV
   */
  position: SCCustomAdvPosition;

  /**
   * Category ids if the adv must be related to specific categories
   */
  categoriesId?: Array<number> | null;
}
/**
 > API documentation for the Community-UI CustomAdv component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CustomAdv} from '@selfcommunity/ui';
 ```
 #### Component Name
 The name `SCCustomAdv` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCustomAdv-root|Styles applied to the root element.|
 |image|.SCCustomAdv-image|Styles applied to the image element.|

 * @param inProps
 */
export default function CustomAdv(inProps: CustomAdvProps): JSX.Element {
  // PROPS
  const props: CustomAdvProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {id = 'custom_adv', className = null, position, categoriesId = null} = props;

  // retrieve adv
  const {scCustomAdv} = useSCFetchCustomAdv({position, categoriesId});

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
    <Root id={id} className={classNames(classes.root, className)}>
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
