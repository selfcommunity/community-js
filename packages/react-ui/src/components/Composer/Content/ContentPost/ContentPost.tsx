import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import { Box, BoxProps, FormGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import Editor, { EditorProps } from '../../../Editor';
import { ComposerContentType } from '../../../../types/composer';
import { PREFIX } from '../../constants';

const classes = {
  root: `${PREFIX}-content-post-root`,
  generalError: `${PREFIX}-general-error`,
  medias: `${PREFIX}-content-post-medias`,
  editor: `${PREFIX}-content-post-editor`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'ContentPostRoot'
})(({theme}) => ({}));

const SortableComponent = forwardRef<HTMLDivElement, any>(({children, ...props}, ref) => {
  return (
    <FormGroup direction="column" ref={ref} {...props}>
      {children}
    </FormGroup>
  );
});

/**
 * Default post
 */
const DEFAULT_POST: ComposerContentType = {
  categories: [],
  medias: [],
  html: '',
  addressing: []
};

export interface ContentPostProps extends Omit<BoxProps, 'value' | 'onChange'> {
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
  EditorProps?: Omit<EditorProps, ''>;
}

export default (props: ContentPostProps): JSX.Element => {
  // PROPS
  const {className = null, value = {...DEFAULT_POST}, error = {}, disabled = false, onChange, EditorProps = {}} = props;
  const {error: generalError = null} = {...error};

  // REF
  const editorRef = useRef<any>();

  // EFFECTS
  useEffect(() => {
    editorRef && editorRef.current && editorRef.current.focus();
  }, [editorRef]);

  // HANDLERS
  const handleChangeHtml = useCallback((html: string) => {
    onChange({...value, html});
  }, [value]);

  // RENDER

  return (
    <Root className={classNames(classes.root, className)}>
      {generalError && <Typography className={classes.generalError}>{generalError}</Typography>}
      <Editor
        ref={editorRef}
        {...EditorProps}
        editable={!disabled}
        className={classes.editor}
        onChange={handleChangeHtml}
        defaultValue={value.html}
      />
    </Root>
  );
};
