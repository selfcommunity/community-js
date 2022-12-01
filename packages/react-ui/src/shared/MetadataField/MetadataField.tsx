import React from 'react';
import {MenuItem, TextField} from '@mui/material';
import {SCMetadataType, SCMetadataTypeFieldType} from '@selfcommunity/types';
import EmailTextField from '../EmailTextField';
import UrlTextField from '../UrlTextField';
import PhoneTextField from '../PhoneTextField';
import {TextFieldProps} from '@mui/material/TextField';

export type MetadataFieldProps = TextFieldProps & {
  metadata: SCMetadataType;
};

const MetadataField = (props: MetadataFieldProps): JSX.Element => {
  // PROPS
  const {metadata, className = '', ...rest} = props;

  // RENDER
  let component = null;

  switch (metadata?.type) {
    case SCMetadataTypeFieldType.EMAIL:
      component = <EmailTextField {...rest} className={className} label={metadata.label} required={metadata?.mandatory} />;
      break;
    case SCMetadataTypeFieldType.URL:
      component = <UrlTextField {...rest} type="url" className={className} label={metadata.label} required={metadata?.mandatory} />;
      break;
    case SCMetadataTypeFieldType.PHONE_NUMBER:
      component = <PhoneTextField {...rest} className={className} label={metadata.label} required={metadata?.mandatory} />;
      break;
    case SCMetadataTypeFieldType.ENUM:
      component = (
        <TextField {...rest} className={className} label={metadata.label} required={metadata?.mandatory} select>
          {metadata?.type_options.map((option: string) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      );
      break;
    default:
      component = <TextField {...rest} className={className} label={metadata.label} required={metadata?.mandatory} />;
      break;
  }
  return <React.Fragment>{component}</React.Fragment>;
};

export default MetadataField;
