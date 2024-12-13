import {Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';

export default function Options() {
  return (
    <>
      <Typography variant="h6">
        <FormattedMessage id="ui.editCourse.tab.options" defaultMessage="ui.editCourse.tab.options" />
      </Typography>
    </>
  );
}
