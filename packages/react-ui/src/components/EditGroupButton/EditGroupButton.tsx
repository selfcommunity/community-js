import React from 'react';
import {useThemeProps} from '@mui/system';
import {styled} from '@mui/material/styles';
import {FormattedMessage} from 'react-intl';
import {SCUserContextType, useSCFetchGroup, useSCUser} from '@selfcommunity/react-core';
import classNames from 'classnames';
import CreateGroupButton, {CreateGroupButtonProps} from '../CreateGroupButton';
import {SCGroupType} from '@selfcommunity/types';

const PREFIX = 'SCEditGroupButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(CreateGroupButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface EditGroupButtonProps extends CreateGroupButtonProps {
  /**
   * Group Object
   * @default null
   */
  group?: SCGroupType;

  /**
   * Id of the group
   * @default null
   */
  groupId?: number | string;
  /**
   * On edit success callback function
   * @default null
   */
  onEditSuccess?: (data: SCGroupType) => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS Create Group Button component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CreateGroupButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCEditGroupButton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEditGroupButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function EditGroupButton(inProps: EditGroupButtonProps): JSX.Element {
  //PROPS
  const props: EditGroupButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, groupId, group, onEditSuccess, ...rest} = props;
  const {scGroup, setSCGroup} = useSCFetchGroup({id: groupId, group});
  const scUserContext: SCUserContextType = useSCUser();

  const handleSuccess = (data: SCGroupType) => {
    setSCGroup(data);
    onEditSuccess && onEditSuccess(data);
  };

  if (!scUserContext.user) {
    return null;
  }
  /**
   * Renders root object
   */
  return (
    <Root variant="outlined" className={classNames(classes.root, className)} GroupFormProps={{group: scGroup, onSuccess: handleSuccess}} {...rest}>
      <FormattedMessage id="ui.editGroupButton" defaultMessage="ui.editGroupButton" />
    </Root>
  );
}
