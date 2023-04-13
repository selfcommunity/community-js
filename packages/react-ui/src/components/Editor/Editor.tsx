import React, {ForwardedRef, forwardRef, ForwardRefRenderFunction, useImperativeHandle, useMemo, useRef} from 'react';
import {styled} from '@mui/material/styles';
import {FormattedMessage} from 'react-intl';
import {Box, Stack, useTheme} from '@mui/material';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import nodes from './nodes';
import {InitialConfigType, LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {AutoLinkPlugin, DefaultHtmlValuePlugin, EmojiPlugin, ImagePlugin, MentionsPlugin, OnChangePlugin} from './plugins';
import {LinkPlugin} from '@lexical/react/LexicalLinkPlugin';
import ApiPlugin, {ApiRef} from './plugins/ApiPlugin';
import {EditorThemeClasses, LexicalEditor} from 'lexical';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import CodeHighlightPlugin from './plugins/CodeGutterPlugin';
import {SCThemeType} from '@selfcommunity/react-core';
import useMediaQuery from '@mui/material/useMediaQuery';
import FloatingLinkPlugin from './plugins/FloatingLinkPlugin';
import {shouldForwardProp} from '@mui/system/createStyled';

const PREFIX = 'SCEditor';

const classes = {
  root: `${PREFIX}-root`,
  toolbar: `${PREFIX}-toolbar`,
  content: `${PREFIX}-content`,
  placeholder: `${PREFIX}-placeholder`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => {
    return [styles.root, props.className.includes(classes.toolbar) && styles.toolbar];
  }
})(({theme}) => ({}));

export type EditorRef = {
  focus: () => void;
};

const editorTheme: EditorThemeClasses = {
  code: `${PREFIX}-code`,
  heading: {
    h1: `${PREFIX}-h1`,
    h2: `${PREFIX}-h2`,
    h3: `${PREFIX}-h3`,
    h4: `${PREFIX}-h4`,
    h5: `${PREFIX}-h5`,
    h6: `${PREFIX}-h6`
  },
  link: `${PREFIX}-link`,
  list: {
    listitem: `${PREFIX}-listItem`,
    nested: {
      listitem: `${PREFIX}-nestedListItem`
    },
    olDepth: [`${PREFIX}-ol1`, `${PREFIX}-ol2`, `${PREFIX}-ol3`, `${PREFIX}-ol4`, `${PREFIX}-ol5`],
    ul: `${PREFIX}-ul`
  },
  ltr: `${PREFIX}-ltr`,
  paragraph: `${PREFIX}-paragraph`,
  quote: `${PREFIX}-quote`,
  rtl: `${PREFIX}-rtl`,
  text: {
    bold: `${PREFIX}-textBold`,
    italic: `${PREFIX}-textItalic`,
    strikethrough: `${PREFIX}-textStrikethrough`,
    subscript: `${PREFIX}-textSubscript`,
    superscript: `${PREFIX}-textSuperscript`,
    underline: `${PREFIX}-textUnderline`,
    underlineStrikethrough: `${PREFIX}-textUnderlineStrikethrough`
  }
};

export interface EditorProps {
  /**
   * Id of the feed object
   * @default 'poll'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Default value for the editor
   * @default null
   */
  defaultValue?: string;

  /**
   * Is the content of the editor read only
   * @default true
   */
  editable?: boolean;

  /**
   * Show the toolbar on top of the editor
   * @default false
   */
  toolbar?: boolean;

  /**
   * Handler for change event of the editor
   * @default null
   * */
  onChange?: (value: string) => void;
}

/**
 * > API documentation for the Community-JS Editor component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {Editor} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCEditor` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEditor-root|Styles applied to the root element.|
 |content|.SCEditor-content|Styles applied to the content element.|

 * @param inProps
 */
const Editor: ForwardRefRenderFunction<EditorRef, EditorProps> = (inProps: EditorProps, ref: ForwardedRef<EditorRef>): JSX.Element => {
  // PROPS
  const props: EditorProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = 'editor', className = null, defaultValue = '', toolbar = false, editable = true, onChange = null} = props;
  const apiRef = useRef<ApiRef>();

  // MEMO
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // HANDLERS
  const handleChange = (value) => {
    onChange && onChange(value);
  };

  const handleError = (error: Error, editor: LexicalEditor) => {
    console.log(error);
  };

  const handleFocus = () => {
    apiRef.current.focus();
  };

  // EXPOSED METHODS
  useImperativeHandle(ref, () => ({
    focus: () => {
      apiRef.current.focus();
    }
  }));

  // RENDER

  const initialConfig: InitialConfigType = useMemo(
    () => ({
      namespace: 'LexicalEditor',
      editable: editable,
      onError: handleError,
      nodes: [...nodes],
      theme: editorTheme
    }),
    [editable]
  );

  return (
    <Root id={id} className={classNames(classes.root, className, {[classes.toolbar]: toolbar})}>
      <LexicalComposer initialConfig={initialConfig}>
        {toolbar && (
          <>
            <ToolbarPlugin />
            <ListPlugin />
            <CodeHighlightPlugin />
          </>
        )}
        <RichTextPlugin
          contentEditable={<ContentEditable className={classes.content} />}
          placeholder={
            <Box className={classes.placeholder} onClick={handleFocus}>
              <FormattedMessage id="ui.editor.placeholder" defaultMessage="ui.editor.placeholder" />
            </Box>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <DefaultHtmlValuePlugin defaultValue={defaultValue} />
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
        <AutoLinkPlugin />
        <MentionsPlugin />
        <LinkPlugin />
        {!isMobile && <FloatingLinkPlugin />}
        <Stack className={classes.actions} direction="row">
          <ImagePlugin />
          <EmojiPlugin />
        </Stack>
        <ApiPlugin ref={apiRef} />
      </LexicalComposer>
    </Root>
  );
};

export default forwardRef(Editor);
