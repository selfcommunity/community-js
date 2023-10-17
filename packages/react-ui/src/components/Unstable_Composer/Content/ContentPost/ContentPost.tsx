import React, { forwardRef, RefObject, useCallback, useEffect, useRef } from 'react';
import { Box, BoxProps, Chip, FormGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Icon from '@mui/material/Icon';
import itLocale from 'date-fns/locale/it';
import enLocale from 'date-fns/locale/en-US';
import { SCCategoryType, SCFeedObjectType, SCFeedPostType, SCTagType } from '@selfcommunity/types/src/index';
import classNames from 'classnames';
import { useThemeProps } from '@mui/system';
import TagChip from '../../../../shared/TagChip';
import MediasPreview from '../../../../shared/MediasPreview';
import Editor, { EditorProps, EditorRef } from '../../../Editor';
import Attributes from '../../Attributes';
import { ComposerContentType } from '../../../../types/composer';

const localeMap = {
  en: enLocale,
  it: itLocale
};

const PREFIX = 'SCComposerContentPost';

const classes = {
  root: `${PREFIX}-root`,
  generalError: `${PREFIX}-generalError`,
  attributes: `${PREFIX}-attributes`,
  medias: `${PREFIX}-medias`,
  editor: `${PREFIX}-editor`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
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

export default (inProps: ContentPostProps): JSX.Element => {
  // PROPS
  const props: ContentPostProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
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
