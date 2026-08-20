import {Avatar, Box, CardContent, Stack, Typography, styled} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import Widget, {WidgetProps} from '../Widget';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import editIcon from '../../assets/leaderboard/edit';
import starIcon from '../../assets/leaderboard/star';
import usersIcon from '../../assets/leaderboard/users';
import trophyIcon from '../../assets/leaderboard/trophy';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  itemList: `${PREFIX}-item-list`,
  item: `${PREFIX}-item`,
  itemIcon: `${PREFIX}-item-icon`,
  itemIconGlyph: `${PREFIX}-item-icon-glyph`,
  itemContent: `${PREFIX}-item-content`,
  itemTitle: `${PREFIX}-item-title`,
  itemDescription: `${PREFIX}-item-description`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

const STEPS = [
  {id: 'createContent', icon: editIcon},
  {id: 'quality', icon: starIcon},
  {id: 'participate', icon: usersIcon},
  {id: 'challenges', icon: trophyIcon}
];

export type LeaderboardInfoWidgetProps = WidgetProps;

/**
 * > API documentation for the Community-JS Leaderboard Info Widget component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a widget explaining how a user can climb the leaderboard.

 #### Import

 ```jsx
 import {LeaderboardInfoWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLeaderboardInfoWidget` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLeaderboardInfoWidget-root|Styles applied to the root element.|
 |title|.SCLeaderboardInfoWidget-title|Styles applied to the title element.|
 |itemList|.SCLeaderboardInfoWidget-item-list|Styles applied to the list of items.|
 |item|.SCLeaderboardInfoWidget-item|Styles applied to the single item element.|
 |itemIcon|.SCLeaderboardInfoWidget-item-icon|Styles applied to the icon of the single item.|
 |itemIconGlyph|.SCLeaderboardInfoWidget-item-icon-glyph|Styles applied to the icon glyph (CSS mask) of the single item.|
 |itemContent|.SCLeaderboardInfoWidget-item-content|Styles applied to the content of the single item.|
 |itemTitle|.SCLeaderboardInfoWidget-item-title|Styles applied to the title of the single item.|
 |itemDescription|.SCLeaderboardInfoWidget-item-description|Styles applied to the description of the single item.|
 *
 * @param inProps
 */
export default function LeaderboardInfoWidget(inProps: LeaderboardInfoWidgetProps): JSX.Element {
  const props: LeaderboardInfoWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, ...rest} = props;

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <CardContent>
        <Typography variant="h4" className={classes.title}>
          <FormattedMessage id="ui.leaderboardInfoWidget.title" defaultMessage="ui.leaderboardInfoWidget.title" />
        </Typography>
        <Stack spacing={2.5} className={classes.itemList} mt={2}>
          {STEPS.map((step) => (
            <Stack key={step.id} direction="row" spacing={2} className={classes.item}>
              <Avatar className={classes.itemIcon}>
                <Box
                  component="span"
                  className={classes.itemIconGlyph}
                  style={{maskImage: `url(${step.icon})`, WebkitMaskImage: `url(${step.icon})`}}
                />
              </Avatar>
              <Stack className={classes.itemContent}>
                <Typography variant="body1" fontWeight={600} className={classes.itemTitle}>
                  <FormattedMessage id={`ui.leaderboardInfoWidget.${step.id}.title`} defaultMessage={`ui.leaderboardInfoWidget.${step.id}.title`} />
                </Typography>
                <Typography variant="body2" className={classes.itemDescription}>
                  <FormattedMessage
                    id={`ui.leaderboardInfoWidget.${step.id}.description`}
                    defaultMessage={`ui.leaderboardInfoWidget.${step.id}.description`}
                  />
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Root>
  );
}
