import React, {useRef} from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {useIsComponentMountedRef, useSCFetchCustomAdv} from '@selfcommunity/react-core';
import {SCCustomAdvPosition} from '@selfcommunity/types';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import useResizeObserver from 'use-resize-observer';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  wrap: `${PREFIX}-wrap`,
  image: `${PREFIX}-image`,
  embedCode: `${PREFIX}-embed-code`,
  prefixedHeight: `${PREFIX}-prefixed-height`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface CustomAdvProps extends VirtualScrollerItemProps {
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
   * Advertising id
   */
  advId?: number;

  /**
   * Position of the ADV
   */
  position: SCCustomAdvPosition;

  /**
   * Category ids if the adv must be related to specific categories
   */
  categoriesId?: Array<number> | null;

  /**
   * Prefixed height. Usefull to re-mount item on scroll feed.
   */
  prefixedHeight?: number;
}
/**
 * > API documentation for the Community-JS CustomAdv component. Learn about the available props and the CSS API.
 *
 *
 * This component renders custom adv banners.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/CustomAdv)

 #### Import
 ```jsx
 import {CustomAdv} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCCustomAdv` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCustomAdv-root|Styles applied to the root element.|
 |wrap|.SCCustomAdv-wrap|Styles applied to wrap an element.|
 |image|.SCCustomAdv-image|Styles applied to the image element.|
 |embedCode|.SCCustomAdv-embed-code|Styles applied to the embed code section.|
 |prefixedHeight|.SCCustomAdv-prefixed-height|Styles applied to handle a prefixed height.|

 * @param inProps
 */
export default function CustomAdv(inProps: CustomAdvProps): JSX.Element {
  // PROPS
  const props: CustomAdvProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {id = 'custom_adv', className, advId = null, position, categoriesId, prefixedHeight, onStateChange, onHeightChange} = props;

  // REFS
  const isMountedRef = useIsComponentMountedRef();
  const estimatedHeight = useRef(0);

  // ADV
  const {scCustomAdv} = useSCFetchCustomAdv({id: advId, position, categoriesId});

  /**
   * Virtual Feed update
   */
  useDeepCompareEffectNoCheck(() => {
    if (scCustomAdv) {
      onStateChange && onStateChange({advId: scCustomAdv.id, prefixedHeight: estimatedHeight.current});
    }
    onHeightChange && onHeightChange();
  }, [scCustomAdv]);

  /**
   * Use useResizeObserver to intercept layout change:
   * onResize callback function, receive the width and height of the
   * element when it changes and call onHeightChange
   */
  const {ref} = useResizeObserver<HTMLDivElement>({
    round: (n) => {
      return n;
    },
    onResize: ({width, height}) => {
      if (isMountedRef.current) {
        estimatedHeight.current = height;
        onStateChange && onStateChange({advId: scCustomAdv.id, prefixedHeight: height});
      }
    }
  });

  if (!scCustomAdv) {
    return <HiddenPlaceholder />;
  }

  const adv = (
    <Box className={classes.wrap}>
      {scCustomAdv.image && (
        <img
          src={scCustomAdv.image}
          alt={scCustomAdv.title}
          className={classNames(classes.image, {[classes.prefixedHeight]: Boolean(prefixedHeight)})}
        />
      )}
      {scCustomAdv.embed_code && (
        <Box
          className={classNames(classes.embedCode, {[classes.prefixedHeight]: Boolean(prefixedHeight)})}
          dangerouslySetInnerHTML={{__html: scCustomAdv.embed_code}}
        />
      )}
    </Box>
  );

  return (
    <Root
      id={id}
      className={classNames(classes.root, className)}
      ref={ref}
      style={{...(prefixedHeight ? {paddingBottom: prefixedHeight} : {width: '100%'})}}>
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
