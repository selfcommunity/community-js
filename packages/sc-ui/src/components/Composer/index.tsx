import React, {forwardRef, ReactNode, SyntheticEvent, useContext, useMemo, useReducer, useState} from 'react';
import {
  Endpoints,
  formatHttpError,
  http,
  SCContext,
  SCContextType,
  SCMediaType,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType
} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import CloseIcon from '@mui/icons-material/CancelOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import WriteIcon from '@mui/icons-material/CreateOutlined';
import PublicIcon from '@mui/icons-material/PublicOutlined';
import TagIcon from '@mui/icons-material/LabelOutlined';
import BackIcon from '@mui/icons-material/ArrowBackOutlined';
import VideoIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {COMPOSER_TITLE_MAX_LENGTH, COMPOSER_TYPE_DISCUSSION, COMPOSER_TYPE_POST} from '../../constants/Composer';
import {MEDIA_TYPE_DOCUMENT, MEDIA_TYPE_IMAGE, MEDIA_TYPE_LINK, MEDIA_TYPE_VIDEO} from '../../constants/Media';
import LoadingButton from '@mui/lab/LoadingButton';
import Audience from './Audience';
import Categories from './Categories';
import {stripHtml} from '../../utils/string';
import classNames from 'classnames';
import {TransitionProps} from '@mui/material/transitions';
import Medias from '../FeedObject/Medias';
import Editor from '../Editor';
import {SCComposerMediaActionType} from '../../types/composer';
import {Document, Image, Link} from './MediaAction';

const DialogTransition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props}></Fade>;
});

const messages = defineMessages({
  drop: {
    id: 'ui.composer.media.drop',
    defaultMessage: 'ui.composer.media.drop'
  }
});

const TypeInput = styled(InputBase, {
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  '&.Mui-InputBase-root': {
    'label + &': {
      marginTop: theme.spacing(3)
    }
  },
  '& .Mui-InputBase-input': {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: 0,
    padding: '10px 26px 10px 12px'
  }
}));

const PREFIX = 'SCComposer';

const classes = {
  title: `${PREFIX}-title`,
  types: `${PREFIX}-types`,
  avatar: `${PREFIX}-avatar`,
  content: `${PREFIX}-content`,
  mediaContent: `${PREFIX}-mediaContent`,
  block: `${PREFIX}-block`,
  editor: `${PREFIX}-editor`,
  divider: `${PREFIX}-divider`,
  medias: `${PREFIX}-medias`,
  mediasActions: `${PREFIX}-mediasActions`,
  sortableMedia: `${PREFIX}-sortableMedia`,
  sortableMediaCover: `${PREFIX}-sortableMediaCover`,
  links: `${PREFIX}-links`,
  actions: `${PREFIX}-actions`,
  actionInput: `${PREFIX}-actionInput`
};

const Root = styled(Dialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.title}`]: {
    borderBottom: '1px solid #D1D1D1',
    padding: theme.spacing(),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& > div': {
      flex: 1,
      textAlign: 'center'
    },
    '& > div:first-of-type': {
      textAlign: 'left'
    },
    '& > div:last-of-type': {
      textAlign: 'right'
    }
  },
  [`& .${classes.types}`]: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  [`& .${classes.avatar}`]: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    display: 'inline-block'
  },
  [`& .${classes.content}`]: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    position: 'relative',
    overflowY: 'visible'
  },
  [`& .${classes.mediaContent}`]: {
    minHeight: 300
  },
  [`& .${classes.block}`]: {
    padding: theme.spacing(2)
  },
  [`& .${classes.editor}`]: {
    minHeight: 200
  },
  [`& .${classes.divider}`]: {
    borderTop: '1px solid #D1D1D1'
  },
  [`& .${classes.medias}`]: {
    margin: '0 23px'
  },
  [`& .${classes.mediasActions}`]: {
    position: 'absolute',
    top: theme.spacing(),
    left: theme.spacing(),
    right: theme.spacing(),
    padding: theme.spacing(),
    zIndex: 1,
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-between'
  },
  [`& .${classes.sortableMedia}`]: {
    position: 'relative'
  },
  [`& .${classes.sortableMediaCover}`]: {
    backgroundSize: 'cover !important',
    backgroundPosition: 'center !important',
    backgroundRepeat: 'no-repeat !important',
    border: '2px solid white',
    borderRadius: 6,
    height: 300
  },
  [`& .${classes.links}`]: {
    padding: theme.spacing(2)
  },
  [`& .${classes.actions}`]: {
    margin: 0,
    borderTop: '1px solid #D1D1D1',
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  [`& .${classes.actionInput}`]: {
    display: 'none !important'
  }
}));

export const MAIN_VIEW = 'main';
export const AUDIENCE_VIEW = 'audience';
export const IMAGES_VIEW = 'images';
export const VIDEOS_VIEW = 'videos';
export const DOCUMENTS_VIEW = 'documents';
export const LINKS_VIEW = 'links';
export const POLL_VIEW = 'poll';

const AUDIENCE_ALL = 'all';
const AUDIENCE_TAG = 'tag';

const PREFERENCES = [
  SCPreferences.CONFIGURATIONS_POST_TYPE_ENABLED,
  SCPreferences.CONFIGURATIONS_DISCUSSION_TYPE_ENABLED,
  SCPreferences.ADDONS_POST_GEOLOCATION_ENABLED,
  SCPreferences.ADDONS_POLLS_ENABLED,
  SCPreferences.ADDONS_VIDEO_UPLOAD_ENABLED
];

const COMPOSER_INITIAL_STATE = {
  type: null,
  title: '',
  titleError: null,
  text: '',
  textError: null,
  categories: [],
  categoriesError: null,
  addressing: [],
  addressingError: null,
  medias: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return {...COMPOSER_INITIAL_STATE};
    case 'multiple':
      return {...state, ...action.value};
    default:
      return {...state, [action.type]: action.value};
  }
};

export default function Composer({
  open = false,
  view = MAIN_VIEW,
  mediaActions = [Image, Document, Link],
  onClose = null,
  onSuccess = null
}: {
  open?: boolean;
  view?: string;
  mediaActions?: SCComposerMediaActionType[];
  onClose?: (event: SyntheticEvent) => void;
  onSuccess?: (res: any) => void;
}): JSX.Element {
  // Refs
  const refs = {
    images: React.createRef(),
    videos: React.createRef(),
    documents: React.createRef()
  };

  // Context
  const scContext: SCContextType = useContext(SCContext);
  const scPrefernces: SCPreferencesContextType = useContext(SCPreferencesContext);
  const scAuthContext: SCUserContextType = useContext(SCUserContext);

  // INTL
  const intl = useIntl();

  // State variables
  const [fades, setFades] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_view, setView] = useState(view);
  const [composerTypes, setComposerTypes] = useState([]);

  const [state, dispatch] = useReducer(reducer, {...COMPOSER_INITIAL_STATE, open, view});
  const {type, title, titleError, text, categories, addressing, audience, medias} = state;

  /*
   * Compute preferences
   */
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPrefernces.preferences ? scPrefernces.preferences[p].value : null));
    return _preferences;
  }, [scPrefernces.preferences]);

  /*
   * Compose the enabled types of posts that can be created based on preferences
   */
  const setEnabledComposerTypes = () => {
    const types = [];
    if (preferences[SCPreferences.CONFIGURATIONS_POST_TYPE_ENABLED]) {
      types.push(COMPOSER_TYPE_POST);
    }
    if (preferences[SCPreferences.CONFIGURATIONS_DISCUSSION_TYPE_ENABLED]) {
      types.push(COMPOSER_TYPE_DISCUSSION);
    }
    if (!type) {
      dispatch({type: 'type', value: preferences[SCPreferences.CONFIGURATIONS_POST_TYPE_ENABLED] ? COMPOSER_TYPE_POST : COMPOSER_TYPE_DISCUSSION});
    }
    if (JSON.stringify(composerTypes) !== JSON.stringify(types)) {
      setComposerTypes(types);
    }
  };
  setEnabledComposerTypes();

  /* Handlers */

  const handleChangeView = (view) => {
    return (event: SyntheticEvent): void => setView(view);
  };

  const handleChangeType = (event: SelectChangeEvent<any>, child: ReactNode): void => {
    const target = event.target as HTMLInputElement;
    dispatch({type: 'type', value: target.value});
  };

  const handleChangeText = (value: string): void => {
    dispatch({type: 'text', value});
  };

  const handleChange =
    (prop: string) =>
    (event: SyntheticEvent, data?: object): void => {
      const target = event.target as HTMLInputElement;
      switch (prop) {
        case 'title':
          dispatch({
            type: 'multiple',
            value: {
              title: target.value,
              titleError:
                target.value.length > COMPOSER_TITLE_MAX_LENGTH ? (
                  <FormattedMessage id="ui.composer.title.error.maxlength" defaultMessage="ui.composer.title.error.maxlength" />
                ) : null
            }
          });
          break;
        case 'categories':
        case 'addressing':
          dispatch({type: prop, value: event});
          break;
        case 'audience':
          dispatch({type: 'multiple', value: {audience: data, addressing: audience === AUDIENCE_ALL ? [] : audience}});
          break;
        default:
          dispatch({type: prop, value: target.value});
          break;
      }
    };

  const handleClose = (event: SyntheticEvent): void => {
    dispatch({type: 'reset'});
    onClose && onClose(event);
  };

  const handleFadeIn = (obj: string) => {
    return (event: SyntheticEvent): void => setFades({...fades, [obj]: true});
  };

  const handleFadeOut = (obj) => {
    return (event: SyntheticEvent): void => setFades({...fades, [obj]: false});
  };

  const handleDeleteMedia = (id?: number) => {
    return (event: SyntheticEvent): void => {
      if (id) {
        dispatch({type: 'medias', value: medias.filter((m) => m.id != id)});
      } else {
        dispatch({type: 'medias', value: []});
      }
    };
  };

  const handleAddMedia = (media: SCMediaType) => {
    dispatch({type: 'medias', value: [...medias, media]});
  };

  const handleSortMedia = (newSort: SCMediaType[]) => {
    dispatch({
      type: 'medias',
      value: [...medias.filter((media: any) => newSort.findIndex((m: any) => m.id === media.id) === -1), ...newSort]
    });
  };

  const handleSubmit = (event: SyntheticEvent): void => {
    const data = {
      title,
      text,
      addressing,
      medias: medias.map((m) => m.id),
      categories: categories.map((c) => c.id)
    };
    setIsSubmitting(true);
    http
      .request({
        url: Endpoints.Composer.url({type}),
        method: Endpoints.Composer.method,
        data
      })
      .then(onSuccess)
      .catch((error) => {
        dispatch({type: 'multiple', value: formatHttpError(error)});
      });
  };

  /* Renderers */

  const renderMediaControls = (type: string): JSX.Element => {
    switch (type) {
      case MEDIA_TYPE_IMAGE:
        return (
          <Box className={classes.mediasActions} onMouseEnter={handleFadeIn(MEDIA_TYPE_IMAGE)} onMouseLeave={handleFadeOut(MEDIA_TYPE_IMAGE)}>
            <Fade in={Boolean(fades[MEDIA_TYPE_IMAGE])}>
              <Typography align="left">
                <Button onClick={handleChangeView(IMAGES_VIEW)} variant="contained" color="primary" size="small">
                  <WriteIcon /> <FormattedMessage id="ui.composer.media.images.edit" defaultMessage="ui.composer.media.images.edit" />
                </Button>
              </Typography>
            </Fade>
            <Typography align="right">
              <Button onClick={handleDeleteMedia(MEDIA_TYPE_IMAGE)} size="small" color="primary" variant="contained">
                <DeleteIcon />
              </Button>
            </Typography>
          </Box>
        );
      case MEDIA_TYPE_VIDEO:
        return (
          <Box className={classes.mediasActions} onMouseEnter={handleFadeIn(MEDIA_TYPE_VIDEO)} onMouseLeave={handleFadeOut(MEDIA_TYPE_VIDEO)}>
            <Fade in={Boolean(fades[MEDIA_TYPE_VIDEO])}>
              <Typography align="left">
                <Button onClick={handleChangeView(VIDEOS_VIEW)} variant="contained" color="primary" size="small">
                  <WriteIcon /> <FormattedMessage id="ui.composer.media.videos.edit" defaultMessage="ui.composer.media.videos.edit" />
                </Button>
              </Typography>
            </Fade>
            <Typography align="right">
              <Button onClick={handleDeleteMedia(MEDIA_TYPE_VIDEO)} size="small" color="primary" variant="contained">
                <DeleteIcon />
              </Button>
            </Typography>
          </Box>
        );
      case MEDIA_TYPE_DOCUMENT:
        return (
          <Box
            component="div"
            className={classes.mediasActions}
            onMouseEnter={handleFadeIn(MEDIA_TYPE_DOCUMENT)}
            onMouseLeave={handleFadeOut(MEDIA_TYPE_DOCUMENT)}>
            <Fade in={Boolean(fades[MEDIA_TYPE_DOCUMENT])}>
              <Typography align="left">
                <Button onClick={handleChangeView(DOCUMENTS_VIEW)} variant="contained" color="primary" size="small">
                  <WriteIcon /> <FormattedMessage id="ui.composer.media.images.edit" defaultMessage="ui.composer.media.images.edit" />
                </Button>
              </Typography>
            </Fade>
            <Typography align="right">
              <Button onClick={handleDeleteMedia(MEDIA_TYPE_DOCUMENT)} size="small" color="primary" variant="contained">
                <DeleteIcon />
              </Button>
            </Typography>
          </Box>
        );
      case MEDIA_TYPE_LINK:
        return (
          <Box className={classes.mediasActions} onMouseEnter={handleFadeIn(MEDIA_TYPE_LINK)} onMouseLeave={handleFadeOut(MEDIA_TYPE_LINK)}>
            <Fade in={Boolean(fades[MEDIA_TYPE_LINK])}>
              <Typography align="left">
                <Button onClick={handleChangeView(LINKS_VIEW)} variant="contained" color="primary" size="small">
                  <WriteIcon /> <FormattedMessage id="ui.composer.media.link.edit" defaultMessage="ui.composer.media.link.edit" />
                </Button>
              </Typography>
            </Fade>
            <Typography align="right">
              <Button onClick={handleDeleteMedia(MEDIA_TYPE_LINK)} size="small" color="primary" variant="contained">
                <DeleteIcon />
              </Button>
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  const renderAudienceView: Function = () => {
    return (
      <React.Fragment>
        <DialogTitle className={classes.title}>
          <Typography align="left" component="div">
            <IconButton onClick={handleChangeView(MAIN_VIEW)} size="small">
              <BackIcon />
            </IconButton>
            <FormattedMessage id="ui.composer.audience.title" defaultMessage="ui.composer.audience.title" />
          </Typography>
          <Box sx={{textAlign: 'center'}}>
            <Avatar className={classes.avatar} src={scAuthContext.user.avatar}></Avatar>
          </Box>
          <Box sx={{textAlign: 'right'}}>
            <Button onClick={handleChangeView(MAIN_VIEW)} variant="outlined">
              <FormattedMessage id="ui.composer.done" defaultMessage="ui.composer.done" />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Box sx={{textAlign: 'center'}} className={classes.block}>
            <ToggleButtonGroup value={audience} exclusive onChange={handleChange('audience')}>
              <ToggleButton value={AUDIENCE_ALL} size="small">
                <PublicIcon />
                <FormattedMessage id="ui.composer.audience.all" defaultMessage="ui.composer.audience.all" />
              </ToggleButton>
              <ToggleButton value={AUDIENCE_TAG} size="small">
                <TagIcon /> <FormattedMessage id="ui.composer.audience.tag" defaultMessage="ui.composer.audience.tag" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Typography align="center" className={classes.block} gutterBottom>
            {audience === AUDIENCE_ALL && (
              <FormattedMessage id="ui.composer.audience.all.message" defaultMessage="ui.composer.audience.all.message" />
            )}
            {audience === AUDIENCE_TAG && (
              <FormattedMessage id="ui.composer.audience.tag.message" defaultMessage="ui.composer.audience.tag.message" />
            )}
          </Typography>
          {audience === AUDIENCE_TAG && (
            <Box className={classes.divider}>
              <Box className={classes.block} sx={{textAlign: 'center'}}>
                <Audience onChange={handleChange('addressing')} defaultValue={addressing} tags={[{id: 0, name: 'zero'}]} />
              </Box>
            </Box>
          )}
        </DialogContent>
      </React.Fragment>
    );
  };

  const renderVideosView: Function = () => null;

  const renderMediaView: Function = (action: SCComposerMediaActionType) => {
    return () => {
      return (
        <React.Fragment>
          <DialogTitle className={classes.title}>
            <Typography align="left" component="div">
              <IconButton onClick={handleChangeView(MAIN_VIEW)} size="small">
                <BackIcon />
              </IconButton>
              <FormattedMessage id={`ui.composer.media.${action.name}.edit`} defaultMessage={`ui.composer.media.${action.name}.edit`} />
            </Typography>
            <Box sx={{textAlign: 'center'}}>
              <Avatar className={classes.avatar} src={scAuthContext.user.avatar}></Avatar>
            </Box>
            <Box sx={{textAlign: 'right'}}>
              <Button onClick={handleChangeView(MAIN_VIEW)} variant="outlined">
                <FormattedMessage id="ui.composer.done" defaultMessage="ui.composer.done" />
              </Button>
            </Box>
          </DialogTitle>
          <DialogContent className={classNames(classes.content, classes.mediaContent)}>
            {
              <action.component
                medias={medias.filter(action.filter)}
                onSuccess={handleAddMedia}
                onSort={handleSortMedia}
                onDelete={handleDeleteMedia}
              />
            }
          </DialogContent>
        </React.Fragment>
      );
    };
  };

  const renderMainView: Function = () => {
    return (
      <React.Fragment>
        <DialogTitle className={classes.title}>
          <Box>
            <FormControl className={classes.types}>
              <WriteIcon />
              <Select value={type} onChange={handleChangeType} input={<TypeInput />}>
                {composerTypes.map((t) => (
                  <MenuItem value={t} key={t}>
                    {t === 'post' ? (
                      <FormattedMessage id={'ui.composer.type.post'} defaultMessage={'ui.composer.type.post'} />
                    ) : (
                      <FormattedMessage id={'ui.composer.type.discussion'} defaultMessage={'ui.composer.type.discussion'} />
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Avatar className={classes.avatar} src={scAuthContext.user.avatar}></Avatar>
          </Box>
          <Box>
            <IconButton onClick={handleClose} size="large">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent className={classes.content}>
          {type === COMPOSER_TYPE_DISCUSSION && (
            <div className={classes.block}>
              <TextField
                label={<FormattedMessage id="ui.composer.title.label" defaultMessage="ui.composer.title.label" />}
                fullWidth
                variant="outlined"
                value={title}
                multiline
                onChange={handleChange('title')}
                InputProps={{
                  endAdornment: <Typography variant="body2">{COMPOSER_TITLE_MAX_LENGTH - title.length}</Typography>
                }}
                error={Boolean(titleError)}
                helperText={titleError}
              />
            </div>
          )}
          <Editor className={classNames(classes.block, classes.editor)} onChange={handleChangeText} defaultValue={text} />
          <Box className={classes.medias}>
            <Medias
              medias={medias}
              GridImageProps={{gallery: false, overlay: false}}
              imagesAdornment={renderMediaControls(MEDIA_TYPE_IMAGE)}
              videosAdornment={renderMediaControls(MEDIA_TYPE_VIDEO)}
              documentsAdornment={renderMediaControls(MEDIA_TYPE_DOCUMENT)}
              linksAdornment={renderMediaControls(MEDIA_TYPE_LINK)}
            />
          </Box>
          <div className={classes.block}>
            <Categories onChange={handleChange('categories')} defaultValue={categories} />
          </div>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Typography align="left">
            {mediaActions.map((action: SCComposerMediaActionType) => (
              <action.button key={action.name} onClick={handleChangeView(action.name)} />
            ))}
            {preferences[SCPreferences.ADDONS_VIDEO_UPLOAD_ENABLED] && (
              <IconButton aria-label="add video" size="medium">
                <VideoIcon />
              </IconButton>
            )}
          </Typography>
          <Typography align="right">
            <IconButton onClick={handleChangeView(AUDIENCE_VIEW)}>{addressing.length > 0 ? <TagIcon /> : <PublicIcon />}</IconButton>
            <LoadingButton
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              disabled={
                (type === COMPOSER_TYPE_DISCUSSION && title.length === 0) ||
                (type === COMPOSER_TYPE_POST && stripHtml(text).length === 0 && medias.length === 0)
              }
              loading={isSubmitting}>
              <FormattedMessage id="ui.composer.submit" defaultMessage="ui.composer.submit" />
            </LoadingButton>
          </Typography>
        </DialogActions>
      </React.Fragment>
    );
  };

  const renderPollView: Function = () => null;

  let child = null;
  switch (_view) {
    case MAIN_VIEW:
      child = renderMainView;
      break;
    case POLL_VIEW:
      child = renderPollView;
      break;
    case AUDIENCE_VIEW:
      child = renderAudienceView;
      break;
    default:
      child = renderMediaView(mediaActions.find((mv) => mv.name === _view));
  }

  return (
    <Root open={open} TransitionComponent={DialogTransition} keepMounted onClose={handleClose} maxWidth="sm" fullWidth scroll="body">
      {child()}
    </Root>
  );
}
