import React from 'react';
import {styled} from '@mui/material/styles';
import {FormattedMessage} from 'react-intl';
import BaseDialog from '../../../shared/BaseDialog';
import LoyaltyProgramCard from '../LoyaltyProgramCard';

const PREFIX = 'SCLoyaltyProgramDialog';

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

export default function LoyaltyProgramDialog({
  open = false,
  onClose = null,
  points = null,
  cardType = null,
  ...rest
}: {
  open: boolean;
  onClose?: () => void;
  points?: number;
  cardType?: boolean;
  [p: string]: any;
}): JSX.Element {
  return (
    <Root title={<FormattedMessage id="ui.loyaltyProgram.lp" defaultMessage="ui.loyaltyProgram.lp" />} open={open} onClose={onClose} {...rest}>
      <LoyaltyProgramCard points={points} cardType={false} />
    </Root>
  );
}
