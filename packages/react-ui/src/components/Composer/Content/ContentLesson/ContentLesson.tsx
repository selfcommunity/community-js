import React, {useCallback} from 'react';
import {Box, BoxProps, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import Editor, {EditorProps} from '../../../Editor';
import {FormattedMessage} from 'react-intl';
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
  onChange: (html: string) => void;

  /**
   * Props to spread into the editor object
   * @default empty object
   */
  EditorProps?: EditorProps;
}

export default (props: ContentLessonProps): JSX.Element => {
  // PROPS
  const {className = null, value, error = {}, disabled = false, onChange, EditorProps = {}} = props;
  const {error: generalError = null} = {...error};

  // HANDLERS
  const handleChangeHtml = useCallback(
    (html: string) => {
      onChange(html);
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
      <Editor {...EditorProps} editable={!disabled} className={classes.editor} onChange={handleChangeHtml} defaultValue={value.html} />
    </Root>
  );
};
