import React, {SyntheticEvent} from 'react';
import {Box, IconButton} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {ReactSortable} from 'react-sortablejs';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {styled} from '@mui/material/styles';
import Link from './PreviewComponent';
import UrlTextField from './UrlTextField';

const PREFIX = 'SCMediaActionLink';

const classes = {
  link: `${PREFIX}-link`,
  close: `${PREFIX}-close`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  padding: theme.spacing(),
  [`& .${classes.link}`]: {
    position: 'relative'
  },
  [`& .${classes.close}`]: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: theme.spacing()
  }
}));

export interface EditLinkProps {
  /**
   * Medias
   * @default []
   */
  medias?: any[];
  /**
   * Handles on success
   */
  onSuccess: (media: any) => void;
  /**
   * Handles on sort
   */
  onSort: (newSort: any[]) => void;
  /**
   * Handles on progress
   */
  onProgress: (id: number) => void;
  /**
   * Handles on delete
   */
  onDelete: (id?: number) => (event: SyntheticEvent) => void;
}
export default (props: EditLinkProps): JSX.Element => {
  // PROPS
  const {medias = [], onSuccess, onSort, onProgress, onDelete} = props;

  /**
   * Renders root object
   */
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
            <Box key={media.id} m={1} className={classes.link}>
              <Link medias={[media]} />
              <Box className={classes.close}>
                <IconButton onClick={onDelete(media.id)} size="small">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </ReactSortable>
      )}
    </Root>
  );
};
