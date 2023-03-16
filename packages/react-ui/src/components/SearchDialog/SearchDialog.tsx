import {Dialog, DialogContent, DialogProps, styled} from '@mui/material';
import React from 'react';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import SearchAutocomplete, {SearchAutocompleteProps} from '../SearchAutocomplete';

const PREFIX = 'SCSearchDialog';

const classes = {
  root: `${PREFIX}-root`,
  search: `${PREFIX}-search`
};

const Root = styled(Dialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  '& .MuiAutocomplete-popperDisablePortal .MuiPaper-root': {
    boxShadow: 'none',
    borderRadius: 0,
    '& .MuiAutocomplete-listbox': {
      maxHeight: 'none'
    }
  }
}));

export interface SearchDialogProps extends DialogProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  SearchAutocompleteProps: SearchAutocompleteProps;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function Search(inProps: SearchDialogProps) {
  // PROPS
  const props: SearchDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, SearchAutocompleteProps = {}, ...rest} = props;

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <DialogContent>
        <SearchAutocomplete className={classes.search} blurOnSelect={false} open disablePortal {...SearchAutocompleteProps} />
      </DialogContent>
    </Root>
  );
}
