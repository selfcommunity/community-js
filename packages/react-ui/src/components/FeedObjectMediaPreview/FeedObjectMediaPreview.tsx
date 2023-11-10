import React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {SCMediaObjectType} from '../../types/media';
import {useSCMediaClick} from '@selfcommunity/react-core';
import {BoxProps} from '@mui/material';
import {SCMediaType} from '@selfcommunity/types';
import {useThemeProps} from '@mui/system';
import {File, Link, Share} from '../../shared/Media';
import classNames from 'classnames';
import {PREFIX} from '../FeedObject/constants';

const classes = {
  root: `${PREFIX}-media-preview-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'MediaPreviewRoot'
})(() => ({}));

export interface FeedObjectMediaPreviewProps extends BoxProps {
  /**
   * Medias preview array
   */
  medias: SCMediaType[];
  /**
   * Media types
   * @default 'image', 'document', 'link', 'share'
   */
  mediaObjectTypes?: SCMediaObjectType[];
}

/**
 * > API documentation for the Community-JS FeedObjectMediaPreview component. Learn about the available props and the CSS API.
 *
 *
 * The FeedObjectMediaPreview component render the list of medias in a feed object thanks to given configurations.

 #### Import
 ```jsx
 import {FeedObjectMediaPreview} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCFeedObject-media-preview-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFeedObject-media-preview-root|Styles applied to the root element.|


 * @param inProps
 */
export default (inProps: FeedObjectMediaPreviewProps): JSX.Element => {
  //PROPS
  const props: FeedObjectMediaPreviewProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, medias, mediaObjectTypes = [File, Link, Share], ...rest} = props;
  const {handleMediaClick} = useSCMediaClick();

  if (!medias.length) {
    /**
     * Feed without any medias:
     * don't render anything
     */
    return null;
  }

  /**
   * Renders list of media preview
   * The adornment prop is used to insert the controls
   * for re-editing the media at the top of the group of elements
   */
  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      {mediaObjectTypes.map((mediaObject: SCMediaObjectType) => {
        const {displayProps = {}} = mediaObject;
        return (
          <div key={mediaObject.name}>
            <mediaObject.displayComponent medias={medias} {...displayProps} onMediaClick={handleMediaClick} />
          </div>
        );
      })}
    </Root>
  );
};
