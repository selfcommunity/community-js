import React from 'react';
import {styled} from '@mui/material/styles';
import {CardContent, Icon, Typography} from '@mui/material';
import classNames from 'classnames';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {PREFIX} from './constants';
import {FormattedMessage, useIntl} from 'react-intl';
import {SCGroupType, SCGroupPrivacyType} from '@selfcommunity/types';
import {useSCFetchGroup} from '@selfcommunity/react-core';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  description: `${PREFIX}-description`,
  privacy: `${PREFIX}-privacy`,
  privacyTitle: `${PREFIX}-privacy-title`,
  visibility: `${PREFIX}-visibility`,
  visibilityTitle: `${PREFIX}-visibility-title`,
  date: `${PREFIX}-date`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface GroupInfoWidgetProps extends VirtualScrollerItemProps {
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
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Group Info Widget component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a widget containing the group info.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/GroupInfoWidget)

 #### Import

 ```jsx
 import {GroupInfoWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCGroupInfoWidget` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroupInfoWidget-root|Styles applied to the root element.|
 |title|.SCGroupInfoWidget-title|Styles applied to the title element.|

 *
 * @param inProps
 */
export default function GroupInfoWidget(inProps: GroupInfoWidgetProps): JSX.Element {
  // PROPS
  const props: GroupInfoWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, group, groupId, onHeightChange, onStateChange, ...rest} = props;
  // HOOKS
  const {scGroup} = useSCFetchGroup({id: groupId, group});
  // INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <CardContent>
        <Typography variant="h4" className={classes.title}>
          <FormattedMessage id="ui.groupInfoWidget.title" defaultMessage="ui.groupInfoWidget.title" />
        </Typography>
        <Typography variant="body1" className={classes.description}>
          {scGroup.description}
        </Typography>
        <Typography component="div" className={classes.privacy}>
          {scGroup.privacy === SCGroupPrivacyType.PUBLIC ? (
            <>
              <Typography className={classes.privacyTitle}>
                <Icon>public</Icon>
                <FormattedMessage id="ui.createGroup.privacy.public" defaultMessage="ui.createGroup.privacy.public" />
              </Typography>
              <Typography variant="body2">
                <FormattedMessage
                  id="ui.createGroup.privacy.public.info"
                  defaultMessage="ui.createGroup.privacy.public.info"
                  values={{b: (chunks) => <strong>{chunks}</strong>}}
                />
              </Typography>
            </>
          ) : (
            <>
              <Typography className={classes.privacyTitle}>
                <Icon>private</Icon>
                <FormattedMessage id="ui.createGroup.privacy.private" defaultMessage="ui.createGroup.privacy.private" />
              </Typography>
              <Typography variant="body2">
                <FormattedMessage
                  id="ui.createGroup.privacy.private.info"
                  defaultMessage="ui.createGroup.private.public.info"
                  values={{b: (chunks) => <strong>{chunks}</strong>}}
                />
              </Typography>
            </>
          )}
        </Typography>
        {scGroup.privacy === SCGroupPrivacyType.PRIVATE && (
          <Typography component="div" className={classes.visibility}>
            {scGroup.visible ? (
              <>
                <Typography className={classes.visibilityTitle}>
                  <Icon>visibility</Icon>
                  <FormattedMessage id="ui.createGroup.visibility.visible" defaultMessage="ui.createGroup.visibility.visible" />
                </Typography>
                <Typography variant="body2">
                  <FormattedMessage
                    id="ui.createGroup.visibility.visible.info"
                    defaultMessage="ui.createGroup.visibility.visible.info"
                    values={{b: (chunks) => <strong>{chunks}</strong>}}
                  />
                </Typography>
              </>
            ) : (
              <>
                <Typography className={classes.visibilityTitle}>
                  <Icon>visibility_off</Icon>
                  <FormattedMessage id="ui.createGroup.visibility.hidden" defaultMessage="ui.createGroup.visibility.hidden" />
                </Typography>
                <Typography variant="body2">
                  <FormattedMessage
                    id="ui.createGroup.visibility.hidden.info"
                    defaultMessage="ui.createGroup.visibility.hidden.info"
                    values={{b: (chunks) => <strong>{chunks}</strong>}}
                  />
                </Typography>
              </>
            )}
          </Typography>
        )}
        <Typography variant="body2" className={classes.date}>
          <FormattedMessage
            id="ui.groupInfoWidget.date"
            defaultMessage="ui.groupInfoWidget.date"
            values={{date: intl.formatDate(scGroup.created_at, {day: 'numeric', year: 'numeric', month: 'long'})}}
          />
        </Typography>
      </CardContent>
    </Root>
  );
}
