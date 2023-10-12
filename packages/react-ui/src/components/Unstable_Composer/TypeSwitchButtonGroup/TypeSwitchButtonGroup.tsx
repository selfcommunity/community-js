import { styled } from '@mui/material/styles';
import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps, ToggleButtonProps } from '@mui/material';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useThemeProps } from '@mui/system';
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

const PREFIX = 'UnstableSCComposerTypeSwitchButtonGroup';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(ToggleButtonGroup, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export interface ComposerTypeButtonGroupProps extends Omit<ToggleButtonGroupProps, 'exclusive' | 'children' | 'defaultValue' | 'onChange'> {
  onChange?: (value: string) => void;
}

/**
 * > API documentation for the Community-JS Composer TypeSwitchButtonGroup component. Learn about the available props and the CSS API.
 *
 *
 * The Composer TypeSwitchButtonGroup component contains the presentation of the Composer header

 #### Import
 ```jsx
 import {ComposerTypeButtonGroup} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCComposerTypeButtonGroup` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCComposer-root|Styles applied to the root element.|

 * @param inProps
 */
export default function ComposerTypeButtonGroup(inProps: ComposerTypeButtonGroupProps): ReactElement {
  // Context
  const { preferences }: SCPreferencesContextType = useSCPreferences();
  const scUserContext: SCUserContextType = useSCUser();

  // MEMO
  const hasPollType = useMemo(() => preferences[SCPreferences.ADDONS_POLLS_ENABLED].value || UserUtils.isStaff(scUserContext.user), [preferences, scUserContext.user]);
  const hasPostType = useMemo(() => preferences[SCPreferences.CONFIGURATIONS_POST_TYPE_ENABLED].value, [preferences]);
  const hasDiscussionType = useMemo(() => preferences[SCPreferences.CONFIGURATIONS_DISCUSSION_TYPE_ENABLED].value, [preferences]);

  // PROPS
  const props: ComposerTypeButtonGroupProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
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
      <FormattedMessage id="ui.unstable_composer.typeSwitch.post" defaultMessage="ui.unstable_composer.typeSwitch.post" />
    </ToggleButton>}
    {hasDiscussionType && <ToggleButton value={COMPOSER_TYPE_DISCUSSION}>
      <FormattedMessage id="ui.unstable_composer.typeSwitch.discussion" defaultMessage="ui.unstable_composer.typeSwitch.discussion" />
    </ToggleButton>}
    {hasPollType && <ToggleButton value={COMPOSER_TYPE_POLL}>
      <FormattedMessage id="ui.unstable_composer.typeSwitch.poll" defaultMessage="ui.unstable_composer.typeSwitch.poll" />
    </ToggleButton>}
  </Root>
}