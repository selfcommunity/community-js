import React, {Component} from 'react';
import {styled} from '@mui/material/styles';
import PropTypes from 'prop-types';
import {ContentState, convertFromHTML, convertToRaw} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {defineMessages, injectIntl, useIntl} from 'react-intl';
import MUIRichTextEditor from 'mui-rte';
import {Box} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const PREFIX = 'SCEditor';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  boxSizing: 'border-box',
  cursor: 'text',
  padding: theme.spacing(2),
  minHeight: 100
}));

const messages = defineMessages({
  placeholder: {
    id: 'editor.placeholder',
    defaultMessage: 'editor.placeholder'
  }
});

export default function Editor({
  className = '',
  defaultValue = '',
  onChange = null
}: {
  className?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}): JSX.Element {
  const editor = React.createRef();

  // INTL
  const intl = useIntl();

  const blocksFromHTML = convertFromHTML(defaultValue);
  const content = JSON.stringify(ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap));

  const handleChange = (editor) => {
    onChange && onChange(draftToHtml(convertToRaw(editor.getCurrentContent())));
  };

  const handleFocus = () => {
    const target = editor.current as HTMLElement;
    target.focus();
  };

  return (
    <Root className={className} onClick={handleFocus}>
      <MUIRichTextEditor
        label={intl.formatMessage(messages.placeholder)}
        onChange={handleChange}
        ref={this.editor}
        defaultValue={content}
        inlineToolbarControls={['bold', 'italic', 'underline', 'strikethrough', 'highlight', 'link', 'clear']}
        toolbar={false}
        inlineToolbar={true}
      />
    </Root>
  );
}
