import React from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {Box} from '@mui/material';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCNoParticipants';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#1e1e1e',
  transition: 'opacity .2sease-in-out',
  pointerEvents: 'none',
  borderRadius: 7
}));

export interface NoParticipantsProps {
  className?: string;
}

export default function NoParticipants(inProps: NoParticipantsProps): JSX.Element {
  // PROPS
  const props: NoParticipantsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, ...rest} = props;

  // RENDER
  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      <FormattedMessage id="ui.liveStreamRoom.noParticipants" defaultMessage="ui.liveStreamRoom.noParticipants" />
    </Root>
  );
}
