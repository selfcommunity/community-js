import React, {forwardRef, ReactNode, SyntheticEvent, useContext, useEffect, useMemo, useReducer, useState} from 'react';
import {
  Endpoints,
  formatHttpError,
  http,
  SCFeatures,
  SCFeedDiscussionType,
  SCFeedPostType,
  SCFeedObjectTypologyType,
  SCFeedStatusType,
  SCMediaType,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCTagType,
  SCUserContext,
  SCUserContextType
} from '@selfcommunity/core';
import {defineMessages, FormattedMessage} from 'react-intl';
import CloseIcon from '@mui/icons-material/CancelOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import WriteIcon from '@mui/icons-material/CreateOutlined';
import PublicIcon from '@mui/icons-material/PublicOutlined';
import TagIcon from '@mui/icons-material/LabelOutlined';
import BackIcon from '@mui/icons-material/ArrowBackOutlined';
import VideoIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import PollIcon from '@mui/icons-material/BarChartOutlined';
import LocationIcon from '@mui/icons-material/AddLocationAltOutlined';
import ErrorIcon from '@mui/icons-material/ErrorOutlineOutlined';
import {
  Alert,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Fade,
  FormControl,
  hexToRgb,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {COMPOSER_POLL_MIN_CHOICES, COMPOSER_TITLE_MAX_LENGTH, COMPOSER_TYPE_DISCUSSION, COMPOSER_TYPE_POST} from '../../constants/Composer';
import {MEDIA_TYPE_DOCUMENT, MEDIA_TYPE_IMAGE, MEDIA_TYPE_LINK, MEDIA_TYPE_VIDEO} from '../../constants/Media';
import LoadingButton from '@mui/lab/LoadingButton';
import Audience from './Audience';
import Categories from './Categories';
import {random, stripHtml} from '../../utils/string';
import classNames from 'classnames';
import {TransitionProps} from '@mui/material/transitions';
import PollPreview from '../FeedObject/Poll';
import Editor from '../Editor';
import {SCMediaObjectType} from '../../types/media';
import {Document, Image, Link} from '../../shared/Media';
import MediasPreview from '../../shared/MediasPreview';
import Poll from './Poll';
import Location from './Location';
import TagChip from '../../shared/TagChip';
import {AxiosResponse} from 'axios';
import ComposerSkeleton from '../Skeleton/ComposerSkeleton';

const DialogTransition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props}></Fade>;
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
  audienceContent: `${PREFIX}-audienceContent`,
  locationContent: `${PREFIX}-locationContent`,
  block: `${PREFIX}-block`,
  editor: `${PREFIX}-editor`,
  divider: `${PREFIX}-divider`,
  medias: `${PREFIX}-medias`,
  location: `${PREFIX}-location`,
  audience: `${PREFIX}-audience`,
  mediasActions: `${PREFIX}-mediasActions`,
  sortableMedia: `${PREFIX}-sortableMedia`,
  sortableMediaCover: `${PREFIX}-sortableMediaCover`,
  links: `${PREFIX}-links`,
  actions: `${PREFIX}-actions`,
  actionInput: `${PREFIX}-actionInput`,
  badgeError: `${PREFIX}-badgeError`
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
      textAlign: 'right',
      display: 'block'
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
  [`& .${classes.mediaContent}, & .${classes.audienceContent}, & .${classes.locationContent}`]: {
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
  [`& .${classes.location}, & .${classes.audience}`]: {
    padding: theme.spacing(2),
    paddingBottom: 0
  },
  [`& .${classes.mediasActions}`]: {
    position: 'absolute',
    left: 0,
    right: 0,
    background: hexToRgb(theme.palette.getContrastText(theme.palette.primary.main)).replace(')', ', .8)'),
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
  },
  [`& .${classes.badgeError} .MuiBadge-badge`]: {
    padding: 0
  }
}));

export interface ComposerProps extends DialogProps {
  feedObjectId?: number;
  feedObjectType?: SCFeedObjectTypologyType;
  view?: string;
  mediaObjectTypes?: SCMediaObjectType[];
  onSuccess?: (res: any) => void;
  onClose?: (event: SyntheticEvent) => void;
}

export const MAIN_VIEW = 'main';
export const AUDIENCE_VIEW = 'audience';
export const POLL_VIEW = 'poll';
export const LOCATION_VIEW = 'location';

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
  audience: AUDIENCE_ALL,
  addressing: [],
  addressingError: null,
  medias: [],
  poll: null,
  location: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return {...COMPOSER_INITIAL_STATE, key: random()};
    case 'multiple':
      return {...state, ...action.value};
    default:
      return {...state, [action.type]: action.value};
  }
};

export default function Composer(props: ComposerProps): JSX.Element {
  // PROPS
  const {
    feedObjectId = null,
    feedObjectType = null,
    open = false,
    view = MAIN_VIEW,
    mediaObjectTypes = [Image, Document, Link],
    onClose = null,
    onSuccess = null,
    ...rest
  } = props;

  // Context
  const scPrefernces: SCPreferencesContextType = useContext(SCPreferencesContext);
  const scAuthContext: SCUserContextType = useContext(SCUserContext);

  // State variables
  const [fades, setFades] = useState({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [_view, setView] = useState<string>(view);
  const [composerTypes, setComposerTypes] = useState([]);

  const [state, dispatch] = useReducer(reducer, {...COMPOSER_INITIAL_STATE, open, view, key: random()});
  const {key, type, title, titleError, text, categories, addressing, audience, medias, poll, pollError, location} = state;

  // Edit state variables
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const editMode = feedObjectId && feedObjectType;

  // REFS
  const unloadRef = React.useRef<boolean>(false);

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

  // Load feed object
  useEffect(() => {
    if (!editMode) {
      return;
    }
    setIsLoading(true);
    http
      .request({
        url: Endpoints.FeedObject.url({type: feedObjectType, id: feedObjectId}),
        method: Endpoints.FeedObject.method
      })
      .then((res: AxiosResponse<any>) => {
        let feedObject = null;
        if (feedObjectType === COMPOSER_TYPE_POST) {
          feedObject = res.data as SCFeedPostType;
        } else if (feedObjectType === COMPOSER_TYPE_DISCUSSION) {
          feedObject = res.data as SCFeedDiscussionType;
        } else {
          feedObject = res.data as SCFeedStatusType;
        }
        if (feedObject.author.id === scAuthContext.user.id) {
          dispatch({
            type: 'multiple',
            value: {
              type: feedObjectType,
              title: feedObject.title,
              text: feedObject.html,
              categories: feedObject.categories,
              audience: feedObject.addressing ? AUDIENCE_TAG : AUDIENCE_ALL,
              addressing: feedObject.addressing,
              medias: feedObject.medias,
              poll: feedObject.poll,
              location: feedObject.location
            }
          });
        } else {
          setLoadError(true);
        }
      })
      .catch(() => {
        setLoadError(true);
      })
      .then(() => setIsLoading(false));
  }, [editMode]);

  // Props update
  useEffect(() => setView(view), [view]);

  // Prevent unload
  useEffect(() => {
    if (!unloadRef.current && canSubmit()) {
      unloadRef.current = true;
      const onUnload = (event) => {
        event.preventDefault();
        return '';
      };
      window.onbeforeunload = onUnload;
    } else if (unloadRef.current && !canSubmit()) {
      unloadRef.current = false;
      window.onbeforeunload = null;
    }
  }, [state]);

  // CHECKS
  const hasPoll = () => {
    return poll && poll.title.length > 0 && poll.choices.length >= COMPOSER_POLL_MIN_CHOICES;
  };

  const canSubmit = () => {
    return (
      (type === COMPOSER_TYPE_DISCUSSION && title.length > 0) ||
      (type === COMPOSER_TYPE_POST && (stripHtml(text).length > 0 || medias.length > 0 || hasPoll()))
    );
  };

  /* Handlers */

  const handleChangeView = (view) => {
    return (event: SyntheticEvent): void => {
      setView(view);
    };
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
      let target = null;
      switch (prop) {
        case 'title':
          target = event.target as HTMLInputElement;
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
        case 'poll':
        case 'location':
          dispatch({type: prop, value: event});
          break;
        case 'audience':
          data !== null && dispatch({type: 'multiple', value: {audience: data, addressing: audience === AUDIENCE_ALL ? [] : audience}});
          break;
        default:
          target = event.target as HTMLInputElement;
          dispatch({type: prop, value: target.value});
          break;
      }
    };

  const handleClose = (event: SyntheticEvent): void => {
    if (unloadRef.current) {
      window.onbeforeunload = null;
    }
    onClose && onClose(event);
  };

  const handleDeletePoll = (event: React.MouseEvent<HTMLButtonElement>): void => {
    dispatch({type: 'poll', value: null});
    setView(MAIN_VIEW);
  };

  const handleDeleteLocation = (event: React.MouseEvent<HTMLButtonElement>): void => {
    dispatch({type: 'location', value: null});
  };

  const handleDeleteTag =
    (id: number) =>
    (event: React.MouseEvent<HTMLButtonElement>): void => {
      const _addressing = addressing.filter((t) => t.id !== id);
      dispatch({type: 'multiple', value: {audience: _addressing.length === 0 ? AUDIENCE_ALL : AUDIENCE_TAG, addressing: _addressing}});
    };

  const handleFadeIn = (obj: string) => {
    return (event: SyntheticEvent): void => setFades({...fades, [obj]: true});
  };

  const handleFadeOut = (obj) => {
    return (event: SyntheticEvent): void => setFades({...fades, [obj]: false});
  };

  const handleDeleteMedia = (id?: number | null, mediaObjectType?: any) => {
    return (event: SyntheticEvent): void => {
      if (id) {
        dispatch({type: 'medias', value: medias.filter((m) => m.id != id)});
      } else if (mediaObjectType) {
        dispatch({type: 'medias', value: medias.filter((m) => !mediaObjectType.filter(m))});
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
    const data: any = {
      title,
      text,
      medias: medias.map((m) => m.id),
      categories: categories.map((c) => c.id)
    };
    if (preferences[SCPreferences.ADDONS_POLLS_ENABLED] && hasPoll()) {
      data.poll = poll;
    }
    if (preferences[SCPreferences.ADDONS_POST_GEOLOCATION_ENABLED] && location) {
      data.location = {
        location: location.full_address,
        lat: location.lat,
        lng: location.lng
      };
    }
    if (scPrefernces.features.includes(SCFeatures.USER_TAGGING) && audience === AUDIENCE_TAG) {
      data.addressing = addressing.map((t) => t.id);
    }
    setIsSubmitting(true);

    // Finding right url
    let url = Endpoints.Composer.url({type});
    let method = Endpoints.Composer.method;
    if (editMode) {
      let url = Endpoints.ComposerEdit.url({type: feedObjectType, id: feedObjectId});
      let method = Endpoints.ComposerEdit.method;
    }

    // Perform request
    http
      .request({
        url,
        method,
        data
      })
      .then((res: AxiosResponse<any>) => {
        onSuccess(res.data);
        if (unloadRef.current) {
          window.onbeforeunload = null;
        }
        dispatch({type: 'reset'});
      })
      .catch((error) => {
        dispatch({type: 'multiple', value: formatHttpError(error)});
      })
      .then(() => setIsSubmitting(false));
  };

  /* Renderers */

  const renderMediaAdornment = (mediaObjectType: SCMediaObjectType): JSX.Element => {
    return (
      <Box className={classes.mediasActions} onMouseEnter={handleFadeIn(mediaObjectType.name)} onMouseLeave={handleFadeOut(mediaObjectType.name)}>
        <Fade in={Boolean(fades[mediaObjectType.name])}>
          <Typography align="left">
            <Button onClick={handleChangeView(mediaObjectType.name)} variant="outlined" color="primary" size="small">
              <WriteIcon />{' '}
              <FormattedMessage
                id={`ui.composer.media.${mediaObjectType.name}.edit`}
                defaultMessage={`ui.composer.media.${mediaObjectType.name}.edit`}
              />
            </Button>
          </Typography>
        </Fade>
        <Typography align="right">
          <IconButton onClick={handleDeleteMedia(null, mediaObjectType)} size="small" color="primary">
            <DeleteIcon />
          </IconButton>
        </Typography>
      </Box>
    );
  };

  const renderAudienceView: Function = () => {
    return (
      <React.Fragment>
        <DialogTitle className={classes.title}>
          <Typography component="div">
            <IconButton onClick={handleChangeView(MAIN_VIEW)} size="small">
              <BackIcon />
            </IconButton>
            <FormattedMessage id="ui.composer.audience.title" defaultMessage="ui.composer.audience.title" />
          </Typography>
          <Box>
            <Avatar className={classes.avatar} src={scAuthContext.user.avatar}></Avatar>
          </Box>
          <Box>
            <Button onClick={handleChangeView(MAIN_VIEW)} variant="outlined">
              <FormattedMessage id="ui.composer.done" defaultMessage="ui.composer.done" />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent className={classes.audienceContent}>
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
                <Audience onChange={handleChange('addressing')} defaultValue={addressing} />
              </Box>
            </Box>
          )}
        </DialogContent>
      </React.Fragment>
    );
  };

  const renderMediaView: Function = (mediaObjectType: SCMediaObjectType) => {
    return () => {
      return (
        <React.Fragment>
          <DialogTitle className={classes.title}>
            <Typography component="div">
              <IconButton onClick={handleChangeView(MAIN_VIEW)} size="small">
                <BackIcon />
              </IconButton>
              <FormattedMessage
                id={`ui.composer.media.${mediaObjectType.name}.edit`}
                defaultMessage={`ui.composer.media.${mediaObjectType.name}.edit`}
              />
            </Typography>
            <Box>
              <Avatar className={classes.avatar} src={scAuthContext.user.avatar}></Avatar>
            </Box>
            <Box>
              <Button onClick={handleChangeView(MAIN_VIEW)} variant="outlined">
                <FormattedMessage id="ui.composer.done" defaultMessage="ui.composer.done" />
              </Button>
            </Box>
          </DialogTitle>
          <DialogContent className={classNames(classes.content, classes.mediaContent)}>
            {
              <mediaObjectType.editComponent
                medias={medias.filter(mediaObjectType.filter)}
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

  const renderPollView: Function = () => {
    return (
      <React.Fragment>
        <DialogTitle className={classes.title}>
          <Typography component="div">
            <IconButton onClick={handleChangeView(MAIN_VIEW)} size="small">
              <BackIcon />
            </IconButton>
            <FormattedMessage id="ui.composer.poll.title" defaultMessage="ui.composer.poll.title" />
          </Typography>
          <Box>
            <Avatar className={classes.avatar} src={scAuthContext.user.avatar}></Avatar>
          </Box>
          <Stack spacing={2} direction="row">
            <Button onClick={handleDeletePoll} variant="outlined">
              <FormattedMessage id="ui.composer.delete" defaultMessage="ui.composer.delete" />
            </Button>
            <Button onClick={handleChangeView(MAIN_VIEW)} variant="outlined">
              <FormattedMessage id="ui.composer.done" defaultMessage="ui.composer.done" />
            </Button>
          </Stack>
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Poll onChange={handleChange('poll')} value={poll} error={pollError} />
        </DialogContent>
      </React.Fragment>
    );
  };

  const renderLocationView: Function = () => {
    return (
      <React.Fragment>
        <DialogTitle className={classes.title}>
          <Typography component="div">
            <IconButton onClick={handleChangeView(MAIN_VIEW)} size="small">
              <BackIcon />
            </IconButton>
            <FormattedMessage id="ui.composer.location.title" defaultMessage="ui.composer.location.title" />
          </Typography>
          <Box>
            <Avatar className={classes.avatar} src={scAuthContext.user.avatar}></Avatar>
          </Box>
          <Box>
            <Button onClick={handleChangeView(MAIN_VIEW)} variant="outlined">
              <FormattedMessage id="ui.composer.done" defaultMessage="ui.composer.done" />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent className={classes.locationContent}>
          <Location onChange={handleChange('location')} defaultValue={location} />
        </DialogContent>
      </React.Fragment>
    );
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
            <IconButton onClick={handleClose}>
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
                disabled={isSubmitting}
              />
            </div>
          )}
          <Editor
            key={`${key}-editor`}
            className={classNames(classes.block, classes.editor)}
            onChange={handleChangeText}
            defaultValue={text}
            readOnly={isSubmitting}
          />
          <Box className={classes.medias}>
            <MediasPreview
              medias={medias}
              mediaObjectTypes={mediaObjectTypes.map((mediaObjectType) => {
                return {...mediaObjectType, previewProps: {adornment: renderMediaAdornment(mediaObjectType), gallery: false}} as SCMediaObjectType;
              })}
            />
          </Box>
          {poll && <PollPreview pollObject={poll} />}
          <Stack spacing={2} className={classes.audience} direction="row">
            {location && (
              <Chip icon={<LocationIcon />} label={location.full_address} onDelete={handleDeleteLocation} onClick={handleChangeView(LOCATION_VIEW)} />
            )}
            {audience === AUDIENCE_TAG &&
              addressing &&
              addressing.map((t: SCTagType) => (
                <TagChip key={t.id} tag={t} onDelete={handleDeleteTag(t.id)} icon={<TagIcon />} onClick={handleChangeView(AUDIENCE_VIEW)} />
              ))}
          </Stack>
          <div className={classes.block}>
            <Categories key={`${key}-categories`} onChange={handleChange('categories')} defaultValue={categories} disabled={isSubmitting} />
          </div>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Typography align="left">
            {mediaObjectTypes.map((mediaObjectType: SCMediaObjectType) => (
              <mediaObjectType.editButton
                key={mediaObjectType.name}
                onClick={handleChangeView(mediaObjectType.name)}
                disabled={isSubmitting}
                color={medias.filter(mediaObjectType.filter).length > 0 ? 'primary' : 'default'}
              />
            ))}
            {preferences[SCPreferences.ADDONS_VIDEO_UPLOAD_ENABLED] && (
              <IconButton aria-label="add video" size="medium">
                <VideoIcon />
              </IconButton>
            )}
            {preferences[SCPreferences.ADDONS_POLLS_ENABLED] && (
              <IconButton aria-label="add poll" color={poll ? 'primary' : 'default'} disabled={isSubmitting} onClick={handleChangeView(POLL_VIEW)}>
                <Badge className={classes.badgeError} badgeContent={pollError ? <ErrorIcon fontSize="small" /> : null} color="error">
                  <PollIcon />
                </Badge>
              </IconButton>
            )}
          </Typography>
          <Typography align="right">
            {preferences[SCPreferences.ADDONS_POST_GEOLOCATION_ENABLED] && (
              <IconButton disabled={isSubmitting} onClick={handleChangeView(LOCATION_VIEW)} color={location !== null ? 'primary' : 'default'}>
                <LocationIcon />
              </IconButton>
            )}
            {scPrefernces.features.includes(SCFeatures.USER_TAGGING) && (
              <IconButton disabled={isSubmitting} onClick={handleChangeView(AUDIENCE_VIEW)}>
                {audience === AUDIENCE_TAG ? <TagIcon /> : <PublicIcon />}
              </IconButton>
            )}
            <LoadingButton onClick={handleSubmit} color="primary" variant="contained" disabled={!canSubmit()} loading={isSubmitting}>
              <FormattedMessage id="ui.composer.submit" defaultMessage="ui.composer.submit" />
            </LoadingButton>
          </Typography>
        </DialogActions>
      </React.Fragment>
    );
  };

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
    case LOCATION_VIEW:
      child = renderLocationView;
      break;
    default:
      const media = mediaObjectTypes.find((mv) => mv.name === _view);
      child = media ? renderMediaView(media) : renderMainView;
  }

  if (editMode && isLoading) {
    child = () => <ComposerSkeleton />;
  } else if (editMode && loadError) {
    child = () => (
      <Alert severity="error" onClose={handleClose}>
        <AlertTitle>
          <FormattedMessage id="ui.composer.edit.error.title" defaultMessage="ui.composer.edit.error.title" />
        </AlertTitle>
        <FormattedMessage id="ui.composer.edit.error.content" defaultMessage="ui.composer.edit.error.content" />
      </Alert>
    );
  }

  return (
    <Root open={open} TransitionComponent={DialogTransition} keepMounted onClose={handleClose} {...rest}>
      {child()}
    </Root>
  );
}
