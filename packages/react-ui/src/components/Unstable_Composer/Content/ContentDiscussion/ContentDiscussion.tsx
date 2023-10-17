import React, { forwardRef, RefObject, SyntheticEvent, useCallback } from 'react';
import { Box, BoxProps, FormGroup, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import itLocale from 'date-fns/locale/it';
import enLocale from 'date-fns/locale/en-US';
import classNames from 'classnames';
import { useThemeProps } from '@mui/system';
import Editor, { EditorProps, EditorRef } from '../../../Editor';
import Attributes from '../../Attributes';
import { ComposerContentType } from '../../../../types/composer';
import { FormattedMessage, useIntl } from 'react-intl';
import { COMPOSER_TITLE_MAX_LENGTH } from '../../../../constants/Composer';

const localeMap = {
  en: enLocale,
  it: itLocale
};

const PREFIX = 'UnstableSCComposerContentDiscussion';

const classes = {
  root: `${PREFIX}-root`,
  generalError: `${PREFIX}-generalError`,
  attributes: `${PREFIX}-attributes`,
  title: `${PREFIX}-title`,
  medias: `${PREFIX}-medias`,
  editor: `${PREFIX}-editor`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

/**
 * Default post
 */
const DEFAULT_DISCUSSION: ComposerContentType = {
  title: '',
  categories: [],
  medias: [],
  html: '',
  addressing: []
};

export interface ContentDiscussionProps extends Omit<BoxProps, 'value' | 'onChange'> {
  /**
   * Value of the component
   */
  value?: ComposerContentType | null;

  /**
   * Widgets to insert into the feed
   * @default empty array
   */
  error?: any;

  /**
   * All the inputs should be disabled?
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback for change event on poll object
   * @param value
   * @default empty object
   */
  onChange: (value: ComposerContentType) => void;

  /**
   * Props to spread into the editor object
   * @default empty object
   */
  EditorProps?: EditorProps;
}

export default (inProps: ContentDiscussionProps): JSX.Element => {
  // PROPS
  const props: ContentDiscussionProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className = null,
    value = {...DEFAULT_DISCUSSION},
    error = {},
    disabled=false,
    onChange,
    EditorProps = {}
  } = props;
  const {titleError = null, error: generalError = null} = {...error};

  // HOOKS
  const intl = useIntl();

  // HANDLERS
  const handleChangeTitle = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({...value, title: event.target.value});
  }, [value]);

  const handleChangeHtml = useCallback((html: string) => {
    onChange({...value, html});
  }, [value]);

  // RENDER

  return (
    <Root className={classNames(classes.root, className)}>
      {generalError && <Typography className={classes.generalError}>{generalError}</Typography>}
      <Attributes value={value} className={classes.attributes} onChange={onChange} />
      <TextField
        className={classes.title}
        placeholder={intl.formatMessage({id: "ui.unstable_composer.content.discussion.title.label", defaultMessage: "ui.unstable_composer.content.discussion.title.label"})}
        autoFocus
        fullWidth
        variant="outlined"
        value={value.title}
        multiline
        onChange={handleChangeTitle}
        InputProps={{
          endAdornment: <Typography variant="body2">{COMPOSER_TITLE_MAX_LENGTH - value.title.length}</Typography>
        }}
        error={Boolean(titleError)}
        helperText={titleError}
        disabled={disabled}
      />
      <Box className={classes.medias}>
        {/*<MediasPreview*/}
        {/*  medias={value.medias}*/}
        {/*  mediaObjectTypes={mediaObjectTypes.map((mediaObjectType) => {*/}
        {/*    return {*/}
        {/*      ...mediaObjectType,*/}
        {/*      previewProps: {adornment: mediaObjectType.editButton !== null ? renderMediaAdornment(mediaObjectType) : null, gallery: false}*/}
        {/*    } as SCMediaObjectType;*/}
        {/*  })}*/}
        {/*/>*/}
      </Box>
      <Editor
        {...EditorProps}
        editable={!disabled}
        className={classes.editor}
        onChange={handleChangeHtml}
        defaultValue={value.html}
      />
    </Root>
  );
};
