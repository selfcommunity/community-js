import {Box, styled, useThemeProps} from '@mui/material';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {PREFIX} from './constants';
import {FormattedMessage} from 'react-intl';

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface HtmlInfoDialogProps extends BaseDialogProps {
  /**
   * The category's html text.
   */
  htmlInfo: string;
  /**
   * Overrides or extends the styles applied to the component.
   * @default undefined
   */
  className?: string;
  /**
   * Open dialog
   * @default false
   */
  open?: boolean;
  /**
   * On dialog close callback function
   * @default undefined
   */
  onClose?: () => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function HtmlInfoDialog(inProps: HtmlInfoDialogProps) {
  //PROPS
  const props: HtmlInfoDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {htmlInfo, className, open = false, onClose, ...rest} = props;

  return (
    <Root
      DialogContentProps={{dividers: false}}
      maxWidth="md"
      title={<FormattedMessage id="ui.categoryHeader.htmlInfo.dialog.title" defaultMessage="ui.categoryHeader.htmlInfo.dialog.title" />}
      fullWidth
      open={open}
      scroll="body"
      onClose={onClose}
      className={className}
      slotProps={{
        paper: {
          elevation: 0
        }
      }}
      {...rest}>
      <Box dangerouslySetInnerHTML={{__html: htmlInfo}} />
    </Root>
  );
}
