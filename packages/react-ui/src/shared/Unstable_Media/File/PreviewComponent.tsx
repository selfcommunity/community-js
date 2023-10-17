import React, { ReactElement, useCallback, useEffect, useMemo, useRef } from 'react';
import { Box, BoxProps, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SCMediaType } from '@selfcommunity/types/src/index';
import { useThemeProps } from '@mui/system';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import { ReactSortable } from 'react-sortablejs';
import DisplayComponent from './DisplayComponent';
import { PREFIX } from './constants';
import filter from './filter';
import { MEDIA_TYPE_DOCUMENT } from '../../../constants/Media';

const classes = {
  previewRoot: `${PREFIX}-preview-root`,
  media: `${PREFIX}-media`,
  delete: `${PREFIX}-delete`,
  title: `${PREFIX}-title`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'PreviewRoot',
  overridesResolver: (props, styles) => styles.previewRoot
})(() => ({}));

export interface PreviewComponentProps extends Omit<BoxProps, 'value' | 'onChange'> {
  onChange: (value: SCMediaType[]) => void;
  value: SCMediaType[];
}

const SORTABLE_ID = 'file_sort';

const PreviewComponent = React.forwardRef((inProps: PreviewComponentProps, ref: React.Ref<unknown>): ReactElement => {
  // Props
  const props: PreviewComponentProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, onChange, value= [], ...rest} = props;

  // MEMO
  const medias = useMemo(() => value.filter(filter), [value]);

  // EFFECTS
  useEffect(() => {
    if (typeof document === undefined) {
      return null;
    }
    const sortable = document.getElementById(SORTABLE_ID);
    if (sortable) {
      sortable.scrollLeft = sortable.scrollWidth;
    }
  }, [medias]);

  // HANDLERS
  const handleSort = useCallback((medias: SCMediaType[]) => {
    onChange && onChange([...value.filter((media: any) => medias.findIndex((m: any) => m.id === media.id) === -1), ...medias]);
  }, [onChange]);
  const handleDelete = useCallback((id: number) => () => onChange && onChange(value.filter((media: SCMediaType) => media.id !== id)), [onChange, value]);

  return <Root ref={ref} className={classNames(className, classes.previewRoot)} {...rest}>
    {medias.length > 0 && (
      <ReactSortable id={SORTABLE_ID} list={medias} setList={handleSort}>
        {medias.map((media) => (
          <Box key={media.id} className={classes.media} sx={{backgroundImage: `url(${media?.image_thumbnail ? media.image_thumbnail.url : media.image})`}}>
            <IconButton className={classes.delete} onClick={handleDelete(media.id)} size="small">
              <Icon>delete</Icon>
            </IconButton>
            {media.title && <Typography className={classes.title}>{media.type === MEDIA_TYPE_DOCUMENT && <Icon>picture_as_pdf</Icon>}{media.title}</Typography>}
          </Box>
        ))}
      </ReactSortable>
    )}
  </Root>
});

export default PreviewComponent;