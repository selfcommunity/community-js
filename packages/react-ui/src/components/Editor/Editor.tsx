import React, {ForwardedRef, forwardRef, ForwardRefRenderFunction, useCallback, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {FormattedMessage} from 'react-intl';
import {Box, Stack} from '@mui/material';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import nodes from './nodes';
import {InitialConfigType, LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {RichTextPlugin} from './plugins/LexicalRichTextPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {HorizontalRulePlugin} from '@lexical/react/LexicalHorizontalRulePlugin';
import {
  AutoLinkPlugin,
  DefaultHtmlValuePlugin,
  EmojiPlugin,
  ImagePlugin,
  MediaPlugin,
  MediaPluginProps,
  MentionsPlugin,
  OnChangePlugin
} from './plugins';
import {LinkPlugin} from '@lexical/react/LexicalLinkPlugin';
import ApiPlugin, {ApiRef} from './plugins/ApiPlugin';
import {EditorThemeClasses, LexicalEditor} from 'lexical';
import ToolbarPlugin, {ToolbarPluginProps} from './plugins/ToolbarPlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import FloatingLinkPlugin from './plugins/FloatingLinkPlugin';
import OnBlurPlugin from './plugins/OnBlurPlugin';
import OnFocusPlugin from './plugins/OnFocusPlugin';
import {PREFIX} from './constants';
import {SCMediaType} from '@selfcommunity/types';

const classes = {
  root: `${PREFIX}-root`,
  focused: `${PREFIX}-focused`,
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
  image: `${PREFIX}-image`,
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
   * Show the toolbar on top of the editor, elsewhere show buttons at the bottom of the editor
   * @default false
   */
  toolbar?: boolean;

  /**
   * This editor can upload images and insert into the html dom
   * @default false
   */
  uploadImage?: boolean;
  /**
   * This editor can upload files
   * @default false
   */
  uploadFile?: boolean;

  /**
   * Handler for change event of the editor
   * @default null
   * */
  onChange?: (value: string) => void;

  /**
   * Handler for change media in the editor
   * @default null
   * */
  onMediaChange?: (media: SCMediaType) => void;

  /**
   * Props to spread to ToolBar.
   * @default {}
   */
  ToolBarProps?: ToolbarPluginProps;

  /**
   * Props to spread to MediaPlugin.
   * @default {}
   */
  MediaPluginProps?: MediaPluginProps;

  /**
   * Handler for blur event of the editor
   * @default null
   * */
  onBlur?: (event: FocusEvent) => void;

  /**
   * Handler for focus event of the editor
   * @default null
   * */
  onFocus?: (event: FocusEvent) => void;

  /**
   * Action to add to actions
   */
  action?: React.ReactNode | null;

  /**
   * The text displayed when the editor is empty
   * @default   <FormattedMessage id="ui.editor.placeholder" defaultMessage="ui.editor.placeholder" />
   */
  placeholder?: React.ReactNode;
}

/**
 * > API documentation for the Community-JS Editor component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a text editor.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/Editor)

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
 |toolbar|.SCEditor-toolbar|Styles applied to the toolbar element.|
 |content|.SCEditor-content|Styles applied to the content element.|
 |placeholder|.SCEditor-placeholder|Styles applied to the placeholder element.|
 |actions|.SCEditor-actions|Styles applied to the actions section.|

 * @param inProps
 */
const Editor: ForwardRefRenderFunction<EditorRef, EditorProps> = (inProps: EditorProps, ref: ForwardedRef<EditorRef>): JSX.Element => {
  // PROPS
  const props: EditorProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = 'editor',
    className = null,
    defaultValue = '',
    toolbar = false,
    uploadImage = false,
    uploadFile = false,
    editable = true,
    onChange = null,
    onMediaChange = null,
    onFocus = null,
    onBlur = null,
    action = null,
    ToolBarProps = {},
    MediaPluginProps = {},
    placeholder = <FormattedMessage id="ui.editor.placeholder" defaultMessage="ui.editor.placeholder" />
  } = props;
  const apiRef = useRef<ApiRef>();

  // STATE
  const [focused, setFocused] = useState<boolean>(false);

  // HANDLERS
  const handleChange = (value) => {
    onChange && onChange(value);
  };

  const handleMediaChange = (media) => {
    onMediaChange && onMediaChange(media);
  };

  const handleError = (error: Error, editor: LexicalEditor) => {
    console.log(error);
  };

  const handleFocus = () => {
    apiRef.current.focus();
  };

  const handleHasFocus = useCallback(
    (event: FocusEvent) => {
      setFocused(true);
      onFocus && onFocus(event);
    },
    [onFocus]
  );
  const handleHasBlur = useCallback(
    (event: FocusEvent) => {
      setFocused(false);
      onBlur && onBlur(event);
    },
    [onBlur]
  );

  // EXPOSED METHODS
  useImperativeHandle(ref, () => ({
    focus: () => {
      apiRef.current.focus();
    }
  }));

  // RENDER

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
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
    <Root id={id} className={classNames(classes.root, className, {[classes.toolbar]: toolbar, [classes.focused]: focused})}>
      <LexicalComposer initialConfig={initialConfig}>
        {toolbar ? (
          <>
            <ToolbarPlugin uploadImage={uploadImage} uploadFile={uploadFile} MediaPluginProps={{onMediaAdd: handleMediaChange}} {...ToolBarProps} />
            <ListPlugin />
            <HorizontalRulePlugin />
          </>
        ) : (
          <Stack className={classes.actions} direction="row">
            {uploadImage && <ImagePlugin />}
            {uploadFile && <MediaPlugin {...MediaPluginProps} />}
            <EmojiPlugin />
            {action && action}
          </Stack>
        )}
        <RichTextPlugin
          contentEditable={<ContentEditable className={classes.content} />}
          placeholder={
            <Box className={classes.placeholder} onClick={handleFocus}>
              {placeholder}
            </Box>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <DefaultHtmlValuePlugin defaultValue={defaultValue} />
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
        <OnBlurPlugin onBlur={handleHasBlur} />
        <OnFocusPlugin onFocus={handleHasFocus} />
        <AutoLinkPlugin />
        <MentionsPlugin />
        {/*<HashtagPlugin />*/}
        <LinkPlugin />
        <FloatingLinkPlugin />
        <ApiPlugin ref={apiRef} />
      </LexicalComposer>
    </Root>
  );
};

export default forwardRef(Editor);
