import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {FormControl, FormHelperText, InputLabel, MenuItem, Select, Typography} from '@mui/material';
import {FormattedMessage, useIntl} from 'react-intl';
import {UserService} from '@selfcommunity/api-services';
import {SCUserType, SCLanguageType} from '@selfcommunity/types';
import {SCLocaleContextType, SCUserContextType, useSCLocale, useSCUser} from '@selfcommunity/react-core';
import {SelectProps} from '@mui/material/Select/Select';
import {TypographyProps} from '@mui/material/Typography/Typography';

const PREFIX = 'SCLanguageSwitcher';

const classes = {
  root: `${PREFIX}-root`,
  label: `${PREFIX}-label`
};

const Root = styled(FormControl, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(({theme}) => ({
  [`& .${classes.label}`]: {
    fontWeight: theme.typography.fontWeightBold
  }
}));

export interface LanguageSwitcherProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Props to apply to Label component
   * @default {}
   */
  LabelComponentProps?: TypographyProps;
  /**
   * Props to apply to Select component
   * @default {}
   */
  SelectComponentProps?: SelectProps;
  /**
   * Locales
   * @default [SCLanguageType.EN, SCLanguageType.IT]
   */
  languages?: SCLanguageType[];
  /**
   * Handles language switch callback
   * @param provider
   */
  handleLanguageSwitch?: (language) => Promise<any>;
  /**
   * Minimized version
   */
  minimized?: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function LanguageSwitcher(inProps: LanguageSwitcherProps): JSX.Element {
  // PROPS
  const props: LanguageSwitcherProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  // CONTEXT
  const {
    className = null,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handleLanguageSwitch,
    languages = [SCLanguageType.EN, SCLanguageType.IT],
    minimized = false,
    LabelComponentProps = {},
    SelectComponentProps = {},
    ...rest
  } = props;
  const scUserContext: SCUserContextType = useSCUser();
  const scLocaleContext: SCLocaleContextType = useSCLocale();
	const [updating, setUpdating] = useState(false);
  const intl = useIntl();

  // Handle callback switch language
  const handleSwitchLanguage = (language) => {
    if (handleLanguageSwitch) {
      handleLanguageSwitch(language)
        .then(() => {
          scLocaleContext.selectLocale(language);
          setUpdating(false);
        })
        .catch((e) => {
          console.log(e);
          setUpdating(false);
        });
    } else {
      scLocaleContext.selectLocale(language);
      setUpdating(false);
    }
  };

  // Handle change language
  const handleChange = (e: {target: {value: any}}) => {
    const language = e.target.value;
    if (language !== intl.locale) {
      setUpdating(true);
      if (scUserContext.user) {
        UserService.userPatch(scUserContext.user?.id, {
          language
        } as SCUserType)
          .then((user: SCUserType) => {
            scUserContext.updateUser(user);
            handleSwitchLanguage(language);
          })
          .catch((error) => {
            console.log(error);
            setUpdating(false);
          });
      } else {
        handleSwitchLanguage(language);
      }
    }
  };

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      <Typography variant="body1" className={classes.label} {...LabelComponentProps}>
        <FormattedMessage id="ui.languageSwitcher.selectLanguage" defaultMessage="ui.languageSwitcher.selectLanguage" />
      </Typography>
      <Select disabled={updating} labelId="language" id="language" value={intl.locale} onChange={handleChange} size="small" {...SelectComponentProps}>
        {languages.map((l) => (
          <MenuItem value={l} key={l}>
            {minimized ? l : <FormattedMessage id={`ui.languageSwitcher.language.${l}`} defaultMessage={`ui.languageSwitcher.language.${l}`} />}
          </MenuItem>
        ))}
      </Select>
    </Root>
  );
}
