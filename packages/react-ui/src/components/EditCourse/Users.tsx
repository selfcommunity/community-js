import {Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';

export default function Users() {
  return (
    <>
      <Typography variant="h6">
        <FormattedMessage id="ui.editCourse.tab.users" defaultMessage="ui.editCourse.tab.users" />
      </Typography>
    </>
  );
}
