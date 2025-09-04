import {forwardRef, ReactElement, Ref, useCallback, useEffect, useMemo} from 'react';
import {Box, BoxProps, IconButton, Typography, styled, Icon} from '@mui/material';
import {SCMediaType} from '@selfcommunity/types';
import classNames from 'classnames';
import {ReactSortable} from 'react-sortablejs';
import {PREFIX} from './constants';
import {filteredDocs, filteredImages} from './filter';
import DocComponent from './DocComponent';

const classes = {
  previewRoot: `${PREFIX}-preview-root`,
  media: `${PREFIX}-media`,
  delete: `${PREFIX}-delete`,
  title: `${PREFIX}-title`,
  docsWrapper: `${PREFIX}-docs-wrapper`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'PreviewRoot'
})(() => ({}));

export interface PreviewComponentProps extends Omit<BoxProps, 'value' | 'onChange'> {
  onChange: (value: SCMediaType[]) => void;
  value: SCMediaType[];
}

const SORTABLE_ID = 'file_sort';

const PreviewComponent = forwardRef((props: PreviewComponentProps, ref: Ref<unknown>): ReactElement => {
  // PROPS
  const {className, onChange, value = [], ...rest} = props;

  // MEMO
  const images = useMemo(() => value.filter(filteredImages), [value]);
  const docs = useMemo(() => value.filter(filteredDocs), [value]);
  const mediasLength = useMemo(() => images.length + docs.length, [images, docs]);

  // EFFECTS
  useEffect(() => {
    if (typeof document === undefined) {
      return null;
    }
    const sortable = document.getElementById(SORTABLE_ID);
    if (sortable) {
      sortable.scrollLeft = sortable.scrollWidth;
    }
  }, [images]);

  // HANDLERS
  const handleSort = useCallback(
    (medias: SCMediaType[]) =>
      onChange && onChange([...value.filter((media: SCMediaType) => medias.findIndex((m: SCMediaType) => m.id === media.id) === -1), ...medias]),
    [onChange, value]
  );
  const handleDelete = useCallback((id: number) => onChange && onChange(value.filter((media: SCMediaType) => media.id !== id)), [onChange, value]);

  // RENDER
  const imageElements = useMemo(
    () =>
      images.map((media) => (
        <Box
          key={media.id}
          className={classes.media}
          sx={{backgroundImage: `url(${media?.image_thumbnail ? media.image_thumbnail.url : media.image})`}}>
          <IconButton className={classes.delete} onClick={() => handleDelete(media.id)} size="small">
            <Icon>delete</Icon>
          </IconButton>
          {media.title && <Typography className={classes.title}>{media.title}</Typography>}
        </Box>
      )),
    [images]
  );
  const docElements = useMemo(() => docs.map((doc) => <DocComponent key={doc.id} doc={doc} onDelete={handleDelete} />), [docs]);

  return (
    <Root ref={ref} className={classNames(className, classes.previewRoot)} {...rest}>
      {mediasLength > 0 && (
        <>
          <ReactSortable list={images} setList={handleSort} scroll animation={200} scrollSensitivity={50}>
            {imageElements}
          </ReactSortable>

          <ReactSortable list={docs} setList={handleSort} animation={200} direction="vertical" className={classes.docsWrapper}>
            {docElements}
          </ReactSortable>
        </>
      )}
    </Root>
  );
});

export default PreviewComponent;
