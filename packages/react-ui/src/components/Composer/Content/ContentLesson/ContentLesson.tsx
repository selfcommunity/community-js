import React, {useCallback} from 'react';
import {Box, BoxProps, TextField, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import Editor, {EditorProps} from '../../../Editor';
import {ComposerContentType} from '../../../../types/composer';
import {FormattedMessage, useIntl} from 'react-intl';
import {PREFIX} from '../../constants';

const classes = {
  root: `${PREFIX}-content-lesson-root`,
  generalError: `${PREFIX}-general-error`,
  title: `${PREFIX}-content-lesson-title`,
  medias: `${PREFIX}-content-lesson-medias`,
  editor: `${PREFIX}-content-lesson-editor`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'ContentLessonRoot'
})(({theme}) => ({}));

export interface ContentLessonProps extends Omit<BoxProps, 'value' | 'onChange'> {
  /**
   * Value of the component
   */
  value?: any;

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

export default (props: ContentLessonProps): JSX.Element => {
  // PROPS
  const {className = null, value, error = {}, disabled = false, onChange, EditorProps = {}} = props;
  const {titleError = null, error: generalError = null} = {...error};

  // HOOKS
  const intl = useIntl();

  // HANDLERS
  //TODO: title-> name
  const handleChangeTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange({...value, title: event.target.value});
    },
    [value]
  );

  const handleChangeHtml = useCallback(
    (html: string) => {
      onChange({...value, html});
    },
    [value]
  );

  // RENDER

  return (
    <Root className={classNames(classes.root, className)}>
      {generalError && (
        <Typography className={classes.generalError}>
          <FormattedMessage id={`ui.composer.error.${generalError}`} defaultMessage={`ui.composer.error.${generalError}`} />
        </Typography>
      )}
      {/*<TextField*/}
      {/*  className={classes.title}*/}
      {/*  placeholder={intl.formatMessage({*/}
      {/*    id: 'ui.composer.content.discussion.title.label',*/}
      {/*    defaultMessage: 'ui.composer.content.discussion.title.label'*/}
      {/*  })}*/}
      {/*  autoFocus*/}
      {/*  fullWidth*/}
      {/*  variant="outlined"*/}
      {/*  value={value.title}*/}
      {/*  multiline*/}
      {/*  onChange={handleChangeTitle}*/}
      {/*  InputProps={{*/}
      {/*    endAdornment: <Typography variant="body2">{COMPOSER_TITLE_MAX_LENGTH - value.title.length}</Typography>*/}
      {/*  }}*/}
      {/*  error={Boolean(titleError)}*/}
      {/*  helperText={titleError}*/}
      {/*  disabled={disabled}*/}
      {/*/>*/}
      <Editor {...EditorProps} editable={!disabled} className={classes.editor} onChange={handleChangeHtml} defaultValue={value.html} />
    </Root>
  );
};
