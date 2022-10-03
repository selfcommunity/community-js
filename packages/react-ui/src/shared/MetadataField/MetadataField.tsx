import React from 'react';
import {styled} from '@mui/material/styles';
import {MenuItem, TextField} from '@mui/material';
import {SCMetadataType, SCMetadataTypeFieldType} from '@selfcommunity/types';
import EmailTextField from '../EmailTextField';
import UrlTextField from '../UrlTextField';
import classNames from 'classnames';
import {TextFieldProps} from '@mui/material/TextField';

const {MuiTelInput} = require('mui-tel-input');

const PREFIX = 'SCMetadataField';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(React.Fragment, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export type MetadataFieldProps = TextFieldProps & {
  metadata: SCMetadataType;
};

const MetadataField = (props: MetadataFieldProps): JSX.Element => {
  // PROPS
  const {metadata, className = '', ...rest} = props;

  // HANDLERS
  const handleChangeValue = (value) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    rest.onChange && rest.onChange({target: {name: rest.name, value}});
  };

  // RENDER
  let component = null;

  switch (metadata?.type) {
    case SCMetadataTypeFieldType.EMAIL:
      component = <EmailTextField {...rest} className={classNames(className, classes.root)} label={metadata.label} required={metadata?.mandatory} />;
      break;
    case SCMetadataTypeFieldType.URL:
      component = (
        <UrlTextField {...rest} type="url" className={classNames(className, classes.root)} label={metadata.label} required={metadata?.mandatory} />
      );
      break;
    case SCMetadataTypeFieldType.PHONE_NUMBER:
      component = (
        <MuiTelInput
          {...rest}
          className={classNames(className, classes.root)}
          label={metadata.label}
          onChange={handleChangeValue}
          required={metadata?.mandatory}
        />
      );
      break;
    case SCMetadataTypeFieldType.ENUM:
      component = (
        <TextField {...rest} className={classNames(className, classes.root)} label={metadata.label} required={metadata?.mandatory} select>
          {metadata?.type_options.map((option: string) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      );
      break;
    default:
      component = <TextField {...rest} className={classNames(className, classes.root)} label={metadata.label} required={metadata?.mandatory} />;
      break;
  }
  return <Root>{component}</Root>;
};

export default MetadataField;
