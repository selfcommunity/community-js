import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Box, BoxProps, Icon, IconButton, InputAdornment, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import Editor, {EditorProps} from '../../../Editor';
import {FormattedMessage} from 'react-intl';
import {PREFIX} from '../../constants';
import {SCMediaType} from '@selfcommunity/types';
import {File, Link} from '../../../../shared/Media';
import {SCMediaObjectType} from '../../../../types';
import UrlTextField from '../../../../shared/Media/Link/UrlTextField';

const classes = {
  root: `${PREFIX}-content-lesson-root`,
  generalError: `${PREFIX}-general-error`,
  title: `${PREFIX}-content-lesson-title`,
  medias: `${PREFIX}-content-lesson-medias`,
  editor: `${PREFIX}-content-lesson-editor`,
  link: `${PREFIX}-content-lesson-link`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'ContentLessonRoot'
})(({theme}) => ({}));

export interface ContentLessonProps extends Omit<BoxProps, 'value' | 'onChange'> {
  /**
   * Value of the component
   */
  value?: any;

  /**
   * Widgets to insert into the feed
   * @default empty array
   */
  error?: any;

  /**
   * All the inputs should be disabled?
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback for change html
   * @param value
   * @default empty object
   */
  onChange: (html: string) => void;
  /**
   * Callback for media change
   * @param media
   * @default null
   */
  onMediaChange: (medias: SCMediaType[]) => void;
  /**
   * Props to spread into the editor object
   * @default empty object
   */
  EditorProps?: EditorProps;
}

export default (props: ContentLessonProps): JSX.Element => {
  // PROPS
  const {className = null, value, error = {}, disabled = false, onChange, onMediaChange, EditorProps = {}} = props;
  const {error: generalError = null} = {...error};
  const mediaObjectTypes = [File, Link];
  const [medias, setMedias] = useState<SCMediaType[]>(value?.medias || []);
  const [openLink, setOpenLink] = useState<boolean>();
  const linkInputRef = useRef<HTMLInputElement>(null);

  // HANDLERS

  const handleChangeHtml = useCallback(
    (html: string) => {
      onChange(html);
    },
    [value]
  );

  const handleChangeMedias = useCallback((value: SCMediaType[] | null) => {
    setMedias([...value]);
    onMediaChange([...value]);
  }, []);

  const handleChangeMedia = (value: SCMediaType): void => {
    setMedias((prev) => [...prev, value]);
    onMediaChange([...medias, value]);
  };

  const handleLinkAdd = useCallback(
    (media: SCMediaType) => {
      setMedias([...medias, media]);
      setOpenLink(false);
    },
    [medias]
  );

  useEffect(() => {
    if (openLink && linkInputRef.current) {
      linkInputRef.current.scrollIntoView({behavior: 'smooth'});
      console.log('scroll debug');
    }
  }, [openLink]);

  // RENDER
  return (
    <Root className={classNames(classes.root, className)}>
      {generalError && (
        <Typography className={classes.generalError}>
          <FormattedMessage id={`ui.composer.error.${generalError}`} defaultMessage={`ui.composer.error.${generalError}`} />
        </Typography>
      )}
      <Editor
        {...EditorProps}
        editable={!disabled}
        className={classes.editor}
        onChange={handleChangeHtml}
        onMediaChange={handleChangeMedia}
        defaultValue={value.html}
        ToolBarProps={{
          customLink: <Link.triggerButton key={Link.name} color="default" onClick={() => setOpenLink(true)} />,
          uploadImage: false,
          uploadFile: true
        }}
      />
      {openLink && (
        <UrlTextField
          inputRef={linkInputRef}
          className={classes.link}
          id="page"
          name="page"
          label={<FormattedMessage id="ui.composer.media.link.add.label" defaultMessage="ui.composer.media.link.add.label" />}
          fullWidth
          variant="outlined"
          placeholder="https://"
          onSuccess={handleLinkAdd}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setOpenLink(false)}>
                  <Icon>close</Icon>
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      )}
      {medias && medias.length > 0 && (
        <Box className={classes.medias}>
          {mediaObjectTypes.map((mediaObjectType: SCMediaObjectType) => {
            if (mediaObjectType.previewComponent) {
              return <mediaObjectType.previewComponent key={mediaObjectType.name} value={medias} onChange={handleChangeMedias} />;
            }
          })}
        </Box>
      )}
    </Root>
  );
};
