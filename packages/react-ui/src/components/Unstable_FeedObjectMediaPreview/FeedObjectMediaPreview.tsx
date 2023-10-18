import React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {SCMediaObjectType} from '../../types/media';
import {useSCMediaClick} from '@selfcommunity/react-core';
import { BoxProps } from '@mui/material';
import { SCMediaType } from '@selfcommunity/types/src/types';
import Link from '../../shared/Media/Link';
import Share from '../../shared/Media/Share';
import Image from '../../shared/Media/Image';
import Document from '../../shared/Media/Document';
import { useThemeProps } from '@mui/system';
import { ComposerIconButtonProps } from '../Unstable_ComposerIconButton';

const PREFIX = 'UnstableSCFeedObjectMediaPreview';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({}));

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
export default (inProps: FeedObjectMediaPreviewProps): JSX.Element => {
  //PROPS
  const props: FeedObjectMediaPreviewProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {medias, mediaObjectTypes = [Image, Document, Link, Share], ...rest} = props;
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
    <Root {...rest}>
      {mediaObjectTypes.map((mediaObject: SCMediaObjectType) => {
        const {previewProps = {}} = mediaObject;
        return (
          <div key={mediaObject.name}>
            <mediaObject.previewComponent medias={medias.filter(mediaObject.filter)} {...previewProps} onMediaClick={handleMediaClick} />
          </div>
        );
      })}
    </Root>
  );
};
