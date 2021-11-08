import React, {Component} from 'react';
import {styled} from '@mui/material/styles';
import PropTypes from 'prop-types';
import {ContentState, convertFromHTML, convertToRaw} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {defineMessages, injectIntl} from 'react-intl';
import MUIRichTextEditor from 'mui-rte';
import {Box} from '@mui/material';

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

class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: JSON.stringify(convertToRaw(this.createContentState()))
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);

    this.editor = React.createRef();
  }

  createContentState() {
    const blocksFromHTML = convertFromHTML(this.props.defaultValue);
    return ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
  }

  handleChange(editor) {
    this.props.onChange && this.props.onChange(draftToHtml(convertToRaw(editor.getCurrentContent())));
  }

  handleFocus() {
    this.editor.current.focus();
  }

  render() {
    const {intl, className} = this.props;
    const {content} = this.state;
    return (
      <Root className={className} onClick={this.handleFocus}>
        <MUIRichTextEditor
          label={intl.formatMessage(messages.placeholder)}
          onChange={this.handleChange}
          ref={this.editor}
          defaultValue={content}
          inlineToolbarControls={['bold', 'italic', 'underline', 'strikethrough', 'highlight', 'link', 'clear']}
          toolbar={false}
          inlineToolbar={true}
        />
      </Root>
    );
  }
}

Editor.defaultProps = {
  defaultValue: ''
};

Editor.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,

  /* Translation */
  intl: PropTypes.object.isRequired
};

export default injectIntl(Editor);
