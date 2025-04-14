import React from 'react';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import {Box, Link, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import {MEDIA_TYPE_DOCUMENT} from '../../constants/Media';

const PREFIX = 'SCLessonFilePreview';

const classes = {
  root: `${PREFIX}-root`,
  item: `${PREFIX}-item`,
  title: `${PREFIX}-title`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export interface LessonFilePreviewProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The media object to show
   */
  media: any;
}

export default function LessonFilePreview(props: LessonFilePreviewProps): JSX.Element {
  // PROPS
  const {className, media} = props;

  /**
   * Renders component
   */
  return (
    <Root
      key={media.id}
      className={classNames(classes.root, className)}
      sx={{backgroundImage: `url(${media?.image_thumbnail ? media.image_thumbnail.url : media.image})`}}>
      {media.title && (
        <Link href={media.url} target="_blank" rel="noopener noreferrer">
          <Typography className={classes.title}>
            {media.type === MEDIA_TYPE_DOCUMENT && <Icon>picture_as_pdf</Icon>}
            {media.title}
          </Typography>
        </Link>
      )}
    </Root>
  );
}
