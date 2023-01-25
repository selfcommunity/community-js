import React from 'react';
import {styled} from '@mui/material/styles';
import ImagePreview, {ImagePreviewComponentProps} from '../Image/PreviewComponent';
import {MAX_GRID_IMAGES} from '../../../constants/Media';

const PREFIX = 'SCPreviewMediaDocument';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(ImagePreview, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default (props: ImagePreviewComponentProps): JSX.Element => {
  // PROPS
  const {medias = [], onMediaClick, ...rest} = props;

  /**
   * Handles click on pdf
   * @param doc
   */
  const handleClickOnPdf = (doc) => {
    if (doc && doc.index >= MAX_GRID_IMAGES - 1) {
      // Open the post/discussion
      // history.push(url(threadType, {id: thread.id, slug: thread.slug})());
    } else if (doc.src && doc.src.url) {
      // Open file in target blank
      let win = window.open(doc.src.url, '_blank');
      win.focus();
    }
    onMediaClick(doc.src);
  };

  /**
   * Renders document preview
   */
  if (medias.length > 0) {
    return <Root className={classes.root} medias={medias} {...rest} onClick={handleClickOnPdf} />;
  }
  return null;
};
