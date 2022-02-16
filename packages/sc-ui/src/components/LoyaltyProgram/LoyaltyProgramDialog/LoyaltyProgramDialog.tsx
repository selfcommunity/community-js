import React from 'react';
import {styled} from '@mui/material/styles';
import {FormattedMessage} from 'react-intl';
import BaseDialog from '../../../shared/BaseDialog';
import LoyaltyProgramDetail from '../LoyaltyProgramDetail';
import classNames from 'classnames';

const PREFIX = 'SCLoyaltyProgramDialog';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  // minWidth: 500,
  margin: 2,
  [theme.breakpoints.down(500)]: {
    minWidth: 300
  }
}));

export interface LoyaltyProgramDialogProps {
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
  /**
   * user loyalty points
   * @default null
   */
  points?: number;
}

export default function LoyaltyProgramDialog(props: LoyaltyProgramDialogProps): JSX.Element {
  // PROPS
  const {className, open, onClose, points, ...rest} = props;
  return (
    <Root
      title={<FormattedMessage id="ui.loyaltyProgram.lp" defaultMessage="ui.loyaltyProgram.lp" />}
      open={open}
      onClose={onClose}
      className={classNames(classes.root, className)}
      {...rest}>
      <LoyaltyProgramDetail points={points} cardType={false} />
    </Root>
  );
}
