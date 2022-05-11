import React, {ForwardedRef, forwardRef, ForwardRefRenderFunction, useImperativeHandle, useMemo, useRef} from 'react';
import {styled} from '@mui/material/styles';
import {FormattedMessage} from 'react-intl';
import {Box, Stack} from '@mui/material';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';
import LexicalComposer from '@lexical/react/LexicalComposer';
import LexicalContentEditable from '@lexical/react/LexicalContentEditable';
import LexicalRichTextPlugin from '@lexical/react/LexicalRichTextPlugin';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {AutoLinkPlugin, DefaultHtmlValuePlugin, EmojiPlugin, ImagePlugin, MentionsPlugin, OnChangePlugin} from './plugins';
import {LexicalEditor} from 'lexical';
import nodes from './nodes';
import LexicalLinkPlugin from '@lexical/react/LexicalLinkPlugin';
import LexicalAutoFocusPlugin from '@lexical/react/LexicalAutoFocusPlugin';
import ApiPlugin, {ApiRef} from './plugins/ApiPlugin';

const PREFIX = 'SCEditor';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  placeholder: `${PREFIX}-placeholder`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  boxSizing: 'border-box',
  cursor: 'text',
  padding: theme.spacing(1),
  position: 'relative',
  [`& .${classes.content}`]: {
    outline: 'none',
    minHeight: 60,
    '& > p': {
      margin: theme.spacing(1, 0, 1, 0),
      '&:first-child': {
        marginTop: 0
      },
      '&:last-child': {
        marginBottom: 0
      }
    },
    '& img': {
      margin: theme.spacing(1, 0, 1, 0),
      '&.focused': {
        outline: '2px solid rgb(60, 132, 244)',
        userSelect: 'none'
      }
    },
    ['& mention']: {
      backgroundColor: theme.palette.primary.light
    }
  },
  [`& .${classes.placeholder}`]: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    color: theme.palette.text.disabled
  },
  [`& .${classes.actions}`]: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    color: theme.palette.text.primary
  },
  '& .image-resizer': {
    display: 'block',
    width: 7,
    height: 7,
    position: 'absolute',
    backgroundColor: 'rgb(60, 132, 244)',
    border: '1px solid #fff',
    '&.image-resizer-n': {
      top: -6,
      left: '48%',
      cursor: 'n-resize'
    },
    '&.image-resizer-ne': {
      top: -6,
      right: -6,
      cursor: 'ne-resize'
    },
    '&.image-resizer-e': {
      top: '48%',
      right: -6,
      cursor: 'e-resize'
    },
    '&.image-resizer-se': {
      bottom: -2,
      right: -6,
      cursor: 'se-resize'
    },
    '&.image-resizer-s': {
      bottom: -2,
      left: '48%',
      cursor: 's-resize'
    },
    '&.image-resizer-sw': {
      bottom: -2,
      left: -6,
      cursor: 'sw-resize'
    },
    '&.image-resizer-w': {
      bottom: '48%',
      left: -6,
      cursor: 'w-resize'
    },
    '&.image-resizer-nw': {
      top: -6,
      left: -6,
      cursor: 'nw-resize'
    }
  }
}));

export type EditorRef = {
  focus: () => void;
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
   * @default false
   */
  readOnly?: boolean;

  /**
   * Handler for change event of the editor
   * @default null
   * */
  onChange?: (value: string) => void;
}

/**
 * > API documentation for the Community-UI Editor component. Learn about the available props and the CSS API.

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
  const {id = 'editor', className = null, defaultValue = '', readOnly = false, onChange = null} = props;
  const apiRef = useRef<ApiRef>();

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

  const initialConfig = useMemo(
    () => ({
      readOnly: readOnly,
      onError: handleError,
      nodes: [...nodes]
    }),
    [readOnly]
  );

  return (
    <Root id={id} className={classNames(classes.root, className)}>
      <LexicalComposer initialConfig={initialConfig}>
        <LexicalRichTextPlugin
          contentEditable={<LexicalContentEditable className={classes.content} />}
          placeholder={
            <Box className={classes.placeholder} onClick={handleFocus}>
              <FormattedMessage id="ui.editor.placeholder" defaultMessage="ui.editor.placeholder" />
            </Box>
          }
        />
        <DefaultHtmlValuePlugin defaultValue={defaultValue} />
        <LexicalAutoFocusPlugin />
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
        <LexicalLinkPlugin />
        <AutoLinkPlugin />
        <MentionsPlugin />
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
