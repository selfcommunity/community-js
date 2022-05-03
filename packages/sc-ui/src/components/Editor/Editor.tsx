import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {defineMessages, FormattedMessage} from 'react-intl';
import {Box} from '@mui/material';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';

import LexicalComposer from '@lexical/react/LexicalComposer';
import LexicalContentEditable from '@lexical/react/LexicalContentEditable';
import LexicalRichTextPlugin from '@lexical/react/LexicalRichTextPlugin';
import {AutoLinkPlugin, DefaultHtmlValuePlugin} from './plugins';
import LexicalLinkPlugin from '@lexical/react/LexicalLinkPlugin';
import {EditorThemeClasses, LexicalEditor} from 'lexical';
import nodes from './nodes';
import LexicalAutoFocusPlugin from '@lexical/react/LexicalAutoFocusPlugin';
import OnChangePlugin from './plugins/OnChangePlugin';
import MentionsPlugin from './plugins/MentionsPlugin';

const PREFIX = 'SCEditor';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  placeholder: `${PREFIX}-placeholder`
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
      }
    }
  },
  [`& .${classes.placeholder}`]: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    color: theme.palette.text.disabled
  },
  ['& mention']: {
    backgroundColor: theme.palette.primary.light
  }
}));

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
 import {Editor} from '@selfcommunity/ui';
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
export default function Editor(inProps: EditorProps): JSX.Element {
  // PROPS
  const props: EditorProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = 'editor', className = null, defaultValue = '', readOnly = false, onChange = null} = props;

  // HANDLERS
  const handleChange = (value) => {
    console.log(value);
    onChange && onChange(value);
  };

  const handleError = (error: Error, editor: LexicalEditor) => {
    console.log(error);
  };

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
            <Box className={classes.placeholder}>
              <FormattedMessage id="ui.editor.placeholder" defaultMessage="ui.editor.placeholder" />
            </Box>
          }
        />
        <DefaultHtmlValuePlugin defaultValue={defaultValue} />
        <LexicalAutoFocusPlugin />
        <OnChangePlugin onChange={handleChange} />
        <LexicalLinkPlugin />
        <AutoLinkPlugin />
        <MentionsPlugin />
      </LexicalComposer>
    </Root>
  );
}
