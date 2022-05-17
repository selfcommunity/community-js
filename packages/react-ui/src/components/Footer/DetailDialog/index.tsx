import React from 'react';
import {styled} from '@mui/material/styles';
import {TextField, Box} from '@mui/material';
import BaseDialog from '../../../shared/BaseDialog';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCDetailDialog';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface DetailDialogProps {
  /**
   * The page obj
   */
  pageObj: any;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Opens dialog
   * @default false
   */
  open: boolean;
  /**
   * On dialog close callback function
   * @default null
   */
  onClose?: () => void;
}

export default function DetailDialog(inProps: DetailDialogProps): JSX.Element {
  // PROPS
  const props: DetailDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {pageObj, className, open, onClose, ...rest} = props;

  // RENDER
  return (
    <Root title={pageObj.label} open={open} onClose={onClose} className={classNames(classes.root, className)} {...rest}>
      <Box dangerouslySetInnerHTML={{__html: pageObj.html_body !== '<p></p>' ? pageObj.html_body : pageObj.html_summary}} />
    </Root>
  );
}
