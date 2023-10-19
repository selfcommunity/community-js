import { styled } from '@mui/material/styles';
import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from '@mui/material';
import React, { ReactElement, useCallback, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import {
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  UserUtils,
  useSCPreferences,
  useSCUser,
} from '@selfcommunity/react-core';
import { COMPOSER_TYPE_DISCUSSION, COMPOSER_TYPE_POLL, COMPOSER_TYPE_POST } from '../../../constants/Composer';
import { PREFIX } from '../constants';

const classes = {
  root: `${PREFIX}-typeswitch-root`
};

const Root = styled(ToggleButtonGroup, {
  name: PREFIX,
  slot: 'TypeSwitchButtonGroupRoot'
})(() => ({}));

export interface ComposerTypeButtonGroupProps extends Omit<ToggleButtonGroupProps, 'exclusive' | 'children' | 'defaultValue' | 'onChange'> {
  onChange?: (value: string) => void;
}

export default function ComposerTypeButtonGroup(props: ComposerTypeButtonGroupProps): ReactElement {
  // Context
  const { preferences }: SCPreferencesContextType = useSCPreferences();
  const scUserContext: SCUserContextType = useSCUser();

  // MEMO
  const hasPollType = useMemo(() => preferences[SCPreferences.ADDONS_POLLS_ENABLED].value || UserUtils.isStaff(scUserContext.user), [preferences, scUserContext.user]);
  const hasPostType = useMemo(() => preferences[SCPreferences.CONFIGURATIONS_POST_TYPE_ENABLED].value, [preferences]);
  const hasDiscussionType = useMemo(() => preferences[SCPreferences.CONFIGURATIONS_DISCUSSION_TYPE_ENABLED].value, [preferences]);

  // PROPS
  const {className, onChange, value, ...rest} = props;

  // EFFECTS
  useEffect(() => {
    if (value === null) {
      onChange && onChange(hasPostType ? COMPOSER_TYPE_POST : COMPOSER_TYPE_DISCUSSION);
    }
  }, [value]);

  // HANDLERS
  const handleChange = useCallback((event: React.MouseEvent<HTMLElement>, value: any) => {
    onChange && onChange(value);
  }, [onChange]);

  return <Root className={classNames(classes.root, className)} onChange={handleChange} exclusive value={value} {...rest}>
    {hasPostType && <ToggleButton value={COMPOSER_TYPE_POST}>
      <FormattedMessage id="ui.composer.typeSwitch.post" defaultMessage="ui.composer.typeSwitch.post" />
    </ToggleButton>}
    {hasDiscussionType && <ToggleButton value={COMPOSER_TYPE_DISCUSSION}>
      <FormattedMessage id="ui.composer.typeSwitch.discussion" defaultMessage="ui.composer.typeSwitch.discussion" />
    </ToggleButton>}
    {hasPollType && <ToggleButton value={COMPOSER_TYPE_POLL}>
      <FormattedMessage id="ui.composer.typeSwitch.poll" defaultMessage="ui.composer.typeSwitch.poll" />
    </ToggleButton>}
  </Root>
}