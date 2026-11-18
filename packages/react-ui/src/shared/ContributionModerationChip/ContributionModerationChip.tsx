import React, {useEffect, useState} from 'react';
import {Chip, ChipProps, Icon, styled} from '@mui/material';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {defineMessages, useIntl} from 'react-intl';
import {SCCommentType, SCFeedObjectType, SCGroupType} from '@selfcommunity/types';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {GroupUtils, UserUtils, useSCUser} from '@selfcommunity/react-core';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {
  MODERATION_CONTRIBUTION_STATE_HIDDEN,
  REPORT_AGGRESSIVE,
  REPORT_OFFTOPIC,
  REPORT_POORCONTENT,
  REPORT_SPAM,
  REPORT_VULGAR
} from '../../constants/Flagging';

const PREFIX = 'SCContributionModerationChip';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Chip, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

const messages = defineMessages({
  deleted: {
    id: 'ui.contributionModerationChip.deleted',
    defaultMessage: 'ui.contributionModerationChip.deleted'
  },
  hidden: {
    id: 'ui.contributionModerationChip.hidden',
    defaultMessage: 'ui.contributionModerationChip.hidden'
  },
  hiddenByModeration: {
    id: 'ui.contributionModerationChip.hiddenByModeration',
    defaultMessage: 'ui.contributionModerationChip.hiddenByModeration'
  },
  hiddenByModerationWithReason: {
    id: 'ui.contributionModerationChip.hiddenByModerationWithReason',
    defaultMessage: 'ui.contributionModerationChip.hiddenByModerationWithReason'
  },
  hiddenToGroupMembers: {
    id: 'ui.contributionModerationChip.hiddenToGroupMembers',
    defaultMessage: 'ui.contributionModerationChip.hiddenToGroupMembers'
  },
  spam: {
    id: 'ui.contributionActionMenu.spam',
    defaultMessage: 'ui.contributionActionMenu.spam'
  },
  aggressive: {
    id: 'ui.contributionActionMenu.aggressive',
    defaultMessage: 'ui.contributionActionMenu.aggressive'
  },
  vulgar: {
    id: 'ui.contributionActionMenu.vulgar',
    defaultMessage: 'ui.contributionActionMenu.vulgar'
  },
  poorContent: {
    id: 'ui.contributionActionMenu.poorContent',
    defaultMessage: 'ui.contributionActionMenu.poorContent'
  },
  offtopic: {
    id: 'ui.contributionActionMenu.offtopic',
    defaultMessage: 'ui.contributionActionMenu.offtopic'
  }
});

const REASON_MESSAGES = {
  [REPORT_SPAM]: messages.spam,
  [REPORT_AGGRESSIVE]: messages.aggressive,
  [REPORT_VULGAR]: messages.vulgar,
  [REPORT_POORCONTENT]: messages.poorContent,
  [REPORT_OFFTOPIC]: messages.offtopic
};

interface ModerationStatus {
  /**
   * True if the contribution has been hidden by a moderator
   */
  hiddenByModeration: boolean;
  /**
   * Reason of the moderation (it could be 0: spam)
   */
  flagType: number | null;
}

export interface ContributionModerationChipProps extends Omit<ChipProps, 'label' | 'icon'> {
  /**
   * Contribution (feed obj or comment)
   */
  contribution: SCFeedObjectType | SCCommentType;
  /**
   * Group of the contribution, if any
   * @default null
   */
  group?: SCGroupType;
}

/**
 * Chip that explains why the authenticated user sees a deleted or hidden contribution:
 * - deleted -> "Deleted"
 * - hidden by a moderator -> "Hidden by moderation: <reason>" (the content is hidden to everyone)
 * - hidden by the group manager -> "Hidden from group members"
 * The author of a hidden contribution does not see it as hidden, so nothing is rendered for them.
 */
export default function ContributionModerationChip(inProps: ContributionModerationChipProps): JSX.Element {
  // PROPS
  const props: ContributionModerationChipProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {contribution, group = null, className, ...rest} = props;

  // CONTEXT
  const {user} = useSCUser();
  const intl = useIntl();

  // CONST
  const isStaff: boolean = UserUtils.isAdmin(user) || UserUtils.isModerator(user);
  const isGroupManager: boolean = Boolean(group) && GroupUtils.isGroupAdmin(group, user);
  const hidden: boolean = Boolean(contribution?.collapsed) && !contribution?.deleted;
  // Only moderators can read the moderation status: it tells who hid the contribution and why
  const fetchStatus: boolean = hidden && isStaff;

  // STATE
  const [status, setStatus] = useState<ModerationStatus>(null);

  useEffect(() => {
    if (!fetchStatus) {
      setStatus(null);
      return;
    }
    let active = true;
    http
      .request({
        url: Endpoints.ModerateContributionStatus.url({contribution_type: contribution.type, id: contribution.id}),
        method: Endpoints.ModerateContributionStatus.method
      })
      .then((res: HttpResponse<any>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        if (active) {
          const flagType = res.data['flag_type'];
          setStatus({
            hiddenByModeration: res.data.status === MODERATION_CONTRIBUTION_STATE_HIDDEN,
            flagType: flagType !== undefined && flagType !== null ? flagType : null
          });
        }
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
        if (active) {
          setStatus({hiddenByModeration: false, flagType: null});
        }
      });
    return () => {
      active = false;
    };
  }, [fetchStatus, contribution?.id, contribution?.type, contribution?.collapsed]);

  /**
   * Label of the chip, null if nothing has to be shown
   */
  function getLabel(): string {
    if (contribution?.deleted) {
      return intl.formatMessage(messages.deleted);
    }
    if (!hidden) {
      return null;
    }
    if (isStaff) {
      if (!status) {
        // Wait for the moderation status, to avoid showing a wrong label
        return null;
      }
      if (status.hiddenByModeration) {
        const reason = REASON_MESSAGES[status.flagType];
        return reason
          ? intl.formatMessage(messages.hiddenByModerationWithReason, {reason: intl.formatMessage(reason)})
          : intl.formatMessage(messages.hiddenByModeration);
      }
      return intl.formatMessage(group ? messages.hiddenToGroupMembers : messages.hidden);
    }
    if (isGroupManager) {
      // The group manager cannot show again what a moderator hid
      return intl.formatMessage(contribution.can_uncollapse === false ? messages.hiddenByModeration : messages.hiddenToGroupMembers);
    }
    // The author of a hidden contribution must not know it is hidden
    return null;
  }

  const label = getLabel();
  if (!label) {
    return null;
  }
  return (
    <Root
      className={classNames(classes.root, className)}
      size="small"
      icon={<Icon>{contribution.deleted ? 'delete' : 'visibility_off'}</Icon>}
      label={label}
      {...rest}
    />
  );
}
