import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import { Box, BoxProps, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SCMediaType } from '@selfcommunity/types/src/index';
import { useThemeProps } from '@mui/system';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import { ReactSortable } from 'react-sortablejs';
import DisplayComponent from './DisplayComponent';
import { PREFIX } from './constants';
import filter from './filter';

const classes = {
  previewRoot: `${PREFIX}-preview-root`,
  media: `${PREFIX}-media`,
  delete: `${PREFIX}-delete`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'PreviewRoot'
})(() => ({}));

export interface PreviewComponentProps extends Omit<BoxProps, 'value' | 'onChange'> {
  onChange: (value: SCMediaType[]) => void;
  value: SCMediaType[];
}

const PreviewComponent = React.forwardRef((props: PreviewComponentProps, ref: React.Ref<unknown>): ReactElement => {
  // PROPS
  const {className, onChange, value= [], ...rest} = props;

  // MEMO
  const medias = useMemo(() => value.filter(filter), [value]);

  // HANDLERS
  const handleSort = useCallback((medias: SCMediaType[]) => {
    onChange && onChange([...value.filter((media: any) => medias.findIndex((m: any) => m.id === media.id) === -1), ...medias]);
  }, [onChange]);
  const handleDelete = useCallback((id: number) => () => onChange && onChange(value.filter((media: SCMediaType) => media.id !== id)), [onChange, value]);

  return <Root ref={ref} className={classNames(className, classes.previewRoot)} {...rest}>
    {medias.length > 0 && (
      <ReactSortable list={medias} setList={handleSort}>
        {medias.map((media) => (
          <Box key={media.id} className={classes.media}>
            <DisplayComponent medias={[media]} />
            <IconButton className={classes.delete} onClick={handleDelete(media.id)} size="small">
              <Icon>delete</Icon>
            </IconButton>
          </Box>
        ))}
      </ReactSortable>
    )}
  </Root>
});

export default PreviewComponent;