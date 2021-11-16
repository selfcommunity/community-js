import {asUploadButton} from '@rpldy/upload-button';
import React, {forwardRef, SyntheticEvent, useContext, useState} from 'react';
import {Box, Button, Button as MuiButton, Dialog} from '@mui/material';
import ImageIcon from '@mui/icons-material/ImageOutlined';
import {FormattedMessage} from 'react-intl';
import {ReactSortable} from 'react-sortablejs';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {SCContext, SCContextType, SCPreferencesContext, SCPreferencesContextType, SCUserContext, SCUserContextType} from '@selfcommunity/core';
import {styled} from '@mui/material/styles';
import Link from '../../../FeedObject/Medias/Link';
import UrlTextField from './UrlTextField';

const PREFIX = 'SCMediaActionLink';

const classes = {
  sortableMedia: `${PREFIX}-sortableMedia`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  padding: theme.spacing(),
  [`& .${classes.sortableMedia}`]: {
    position: 'relative'
  }
}));

export default ({
  medias = [],
  onSuccess,
  onSort,
  onProgress,
  onDelete
}: {
  medias?: any[];
  onSuccess: (media: any) => void;
  onSort: (newSort: any[]) => void;
  onProgress: (id: number) => void;
  onDelete: (id?: number) => (event: SyntheticEvent) => void;
}): JSX.Element => {
  return (
    <Root>
      <UrlTextField
        id="page"
        name="page"
        label={<FormattedMessage id="ui.composer.media.link.add.label" defaultMessage="ui.composer.media.link.add.label" />}
        fullWidth
        variant="outlined"
        placeholder="https://"
        onSuccess={onSuccess}
      />
      {medias.length > 0 && (
        <ReactSortable list={medias} setList={onSort}>
          {medias.map((media) => (
            <Box key={media.id} m={1} className={classes.sortableMedia}>
              <Link media={media} fullWidth />
              <Box sx={{textAlign: 'right'}} m={1}>
                <Button onClick={onDelete(media.id)} size="small" color="primary" variant="contained">
                  <DeleteIcon />
                </Button>
              </Box>
            </Box>
          ))}
        </ReactSortable>
      )}
    </Root>
  );
};
