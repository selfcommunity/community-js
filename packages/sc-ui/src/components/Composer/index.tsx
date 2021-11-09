import React, {forwardRef, ForwardRefExoticComponent, ReactNode, SyntheticEvent, useContext, useEffect, useMemo, useReducer, useState} from 'react';
import {Endpoints, http, formatHttpError, SCAuthContext, SCAuthContextType, SCContext, SCContextType, SCPreferences} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import CloseIcon from '@mui/icons-material/CancelOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import WriteIcon from '@mui/icons-material/CreateOutlined';
import PublicIcon from '@mui/icons-material/PublicOutlined';
import TagIcon from '@mui/icons-material/LabelOutlined';
import BackIcon from '@mui/icons-material/ArrowBackOutlined';
import ImageIcon from '@mui/icons-material/ImageOutlined';
import VideoIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import DocumentIcon from '@mui/icons-material/PictureAsPdfOutlined';
import LinkIcon from '@mui/icons-material/LinkOutlined';
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  capitalize,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  Grid,
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
import {asUploadButton} from '@rpldy/upload-button';
import ChunkedUploady, {UPLOADER_EVENTS} from '@rpldy/chunked-uploady';
import {styled} from '@mui/material/styles';
import {COMPOSER_TYPE_DISCUSSION, COMPOSER_TYPE_POST, COMPOSER_TITLE_MAX_LENGTH} from '../../constants/Composer';
import {MEDIA_TYPE_DOCUMENT, MEDIA_TYPE_IMAGE, MEDIA_TYPE_LINK, MEDIA_TYPE_VIDEO} from '../../constants/Media';
import LoadingButton from '@mui/lab/LoadingButton';
import Audience from './Audience';
import Categories from './Categories';
import UrlTextField from './Media/UrlTextField';
import {md5} from '../../utils/hash';
import {stripHtml} from '../../utils/string';
import classNames from 'classnames';
import UploadDropZone from '@rpldy/upload-drop-zone';
import {TransitionProps} from '@mui/material/transitions';
import {ReactSortable} from 'react-sortablejs';
import {AxiosResponse} from 'axios';
import {CHUNK_EVENTS} from '@rpldy/chunked-sender';
import Link from '../Post/Medias/Link';
import Medias from '../Post/Medias';
import Editor from '../../shared/Editor';

const DialogTransition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props}></Fade>;
});

const ImageUploadButton = asUploadButton(
  forwardRef((props, ref) => (
    <Button {...props} aria-label="upload image" ref={ref} variant="outlined">
      <ImageIcon /> <FormattedMessage id="thread.dialog.media.images.add" defaultMessage="thread.dialog.media.images.add" />
    </Button>
  ))
);

const ImageUploadIconButton = asUploadButton(
  forwardRef((props, ref) => (
    <IconButton {...props} aria-label="upload image" ref={ref} size="large">
      <ImageIcon />
    </IconButton>
  ))
);

const DocumentUploadButton = asUploadButton(
  forwardRef((props, ref) => (
    <Button {...props} aria-label="upload image" ref={ref} variant="outlined">
      <DocumentIcon /> <FormattedMessage id="thread.dialog.media.documents.add" defaultMessage="thread.dialog.media.documents.add" />
    </Button>
  ))
);

const DocumentUploadIconButton = asUploadButton(
  forwardRef((props, ref) => (
    <IconButton {...props} aria-label="upload document" ref={ref} size="large">
      <DocumentIcon />
    </IconButton>
  ))
);

const messages = defineMessages({
  drop: {
    id: 'thread.dialog.media.drop',
    defaultMessage: 'thread.dialog.media.drop'
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
  block: `${PREFIX}-block`,
  divider: `${PREFIX}-divider`,
  drop: `${PREFIX}-drop`,
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
    minHeight: 300,
    position: 'relative',
    overflowY: 'visible'
  },
  [`& .${classes.block}`]: {
    padding: theme.spacing(2),
    width: '100%'
  },
  [`& .${classes.divider}`]: {
    borderTop: '1px solid #D1D1D1'
  },
  [`& .${classes.drop}`]: {
    position: 'relative',
    '&::before': {
      content: 'attr(data-content)',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
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
    padding: theme.spacing(2),
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
const AUDIENCE_VIEW = 'audience';
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
  images: [],
  videos: [],
  docs: [],
  links: []
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

interface Chunk {
  id: number;
  name: string;
  type: string;
  image: string;
  completed: number;
  error: string;
}

export default function Composer({
  open = false,
  view = MAIN_VIEW,
  onClose = null,
  onSuccess = null
}: {
  open?: boolean;
  view?: string;
  onClose?: Function;
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
  const scAuthContext: SCAuthContextType = useContext(SCAuthContext);

  // INTL
  const intl = useIntl();

  // State variables
  const [_open, setOpen] = useState(open);
  const [fades, setFades] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_view, setView] = useState(view);
  const [composerTypes, setComposerTypes] = useState([]);

  const [state, dispatch] = useReducer(reducer, {...COMPOSER_INITIAL_STATE, open, view});
  const {type, title, titleError, text, categories, addressing, audience, images, videos, docs, links} = state;

  const [chunks, setChunks] = useState({});
  const setChunk: Function = (id, data) => {
    setChunk({...chunks, [id]: {...chunks[id], ...data}});
  };

  /*
   * Compute preferences
   */
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scContext.preferences ? scContext.preferences[p].value : null));
    return _preferences;
  }, [scContext.preferences]);

  /*
   * Compute views
   * */
  const VIEWS: string[] = useMemo(() => {
    const views = [MAIN_VIEW, LINKS_VIEW];
    if (preferences[SCPreferences.ADDONS_POLLS_ENABLED]) {
      views.push(POLL_VIEW);
    }
    return views;
  }, [preferences]);

  /*
   * Compute uploads views
   * */
  const UPLOAD_VIEWS: string[] = useMemo(() => {
    const views = [IMAGES_VIEW, DOCUMENTS_VIEW];
    if (preferences[SCPreferences.ADDONS_VIDEO_UPLOAD_ENABLED]) {
      views.push(VIDEOS_VIEW);
    }
    return views;
  }, [preferences]);

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

  // componentDidUpdate
  useEffect(() => {
    if (UPLOAD_VIEWS.includes(view)) {
      setView(MAIN_VIEW);
    } else if (VIEWS.includes(view)) {
      setView(view);
    }
  }, [_view]);

  useEffect(() => {
    if (UPLOAD_VIEWS.includes(_view)) {
      refs[_view].current.click();
    }
  }, [_view]);

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
                  <FormattedMessage id="thread.title.error.maxlength" defaultMessage="thread.title.error.maxlength" />
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
    onClose && onClose();
  };

  const handleFadeIn = (obj: string) => {
    return (event: SyntheticEvent): void => setFades({...fades, [obj]: true});
  };

  const handleFadeOut = (obj) => {
    return (event: SyntheticEvent): void => setFades({...fades, [obj]: false});
  };

  const handleDeleteMedia = (type: string, id?: number) => {
    return (event: SyntheticEvent): void => {
      const key = `${type}s`;
      if (id) {
        dispatch({type: key, value: state[key].filter((m) => m.id != id)});
      } else {
        dispatch({type: key, value: []});
      }
    };
  };

  const handleDeleteMediaChunk = (id) => {
    return (event: SyntheticEvent): void => {
      delete chunks[id];
      setChunks(chunks);
    };
  };

  const handleAddMedia = (type: string) => {
    return (media) => {
      const key = `${type}s`;
      dispatch({type: key, value: [...state[key], media]});
    };
  };

  const handleSubmit = (event: SyntheticEvent): void => {
    const data = {
      title,
      text,
      addressing,
      medias: [...images, ...videos, ...docs, ...links].map((m) => m.id),
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
            <Fade in={Boolean(this.state.fades[MEDIA_TYPE_IMAGE])}>
              <Typography align="left">
                <Button onClick={() => setView(IMAGES_VIEW)} variant="contained" color="primary" size="small">
                  <WriteIcon /> <FormattedMessage id="thread.dialog.media.images.edit" defaultMessage="thread.dialog.media.images.edit" />
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
            <Fade in={Boolean(this.state.fades[MEDIA_TYPE_VIDEO])}>
              <Typography align="left">
                <Button onClick={() => setView(VIDEOS_VIEW)} variant="contained" color="primary" size="small">
                  <WriteIcon /> <FormattedMessage id="thread.dialog.media.videos.edit" defaultMessage="thread.dialog.media.videos.edit" />
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
            <Fade in={Boolean(this.state.fades[MEDIA_TYPE_DOCUMENT])}>
              <Typography align="left">
                <Button onClick={() => setView(DOCUMENTS_VIEW)} variant="contained" color="primary" size="small">
                  <WriteIcon /> <FormattedMessage id="thread.dialog.media.images.edit" defaultMessage="thread.dialog.media.images.edit" />
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
            <Fade in={Boolean(this.state.fades[MEDIA_TYPE_LINK])}>
              <Typography align="left">
                <Button onClick={() => setView(LINKS_VIEW)} variant="contained" color="primary" size="small">
                  <WriteIcon /> <FormattedMessage id="thread.dialog.media.links.edit" defaultMessage="thread.dialog.media.links.edit" />
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

  const getChunkUploadHeaders: Function = () => {
    return {Authorization: `Bearer ${scContext.settings.session.authToken.accessToken}`};
  };

  const getChunkUploadListeners: Function = () => {
    return {
      [UPLOADER_EVENTS.ITEM_START]: (item) => {
        if (item.file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setChunk(item.id, {image: e.target.result});
          };
          reader.readAsDataURL(item.file);
        }
        setChunk(item.id, {id: item.id, [`upload_id`]: null, completed: 0, name: item.file.name});
      },
      [UPLOADER_EVENTS.ITEM_PROGRESS]: (item) => {
        setChunk(item.id, {completed: item.completed});
      },
      [UPLOADER_EVENTS.ITEM_FINISH]: (item) => {
        md5(item.file, 2142880, (hash) => {
          const formData = new FormData();
          formData.append('upload_id', chunks[item.id].upload_id);
          formData.append('type', chunks[item.id].type === 'document' ? MEDIA_TYPE_DOCUMENT : chunks[item.id].type);
          formData.append('md5', hash);
          http
            .request({
              url: Endpoints.ChunkUploadMediaComplete.url(),
              method: Endpoints.ChunkUploadMediaComplete.method,
              data: formData,
              headers: {'Content-Type': 'multipart/form-data'}
            })
            .then((res: AxiosResponse<any>) => {
              const mediasKey = `${res.data.type}s`;
              const medias = [...state[mediasKey], res.data];
              delete chunks[item.id];
              setChunks(chunks);
              dispatch({type: mediasKey, value: medias});
            })
            .catch((error) => {
              error = formatHttpError(error);
              setChunk(item.id, {error: error.error});
            });
        });
      },
      [CHUNK_EVENTS.CHUNK_START]: (data) => {
        if (chunks[data.item.id].upload_id) {
          return {
            sendOptions: {
              params: {[`upload_id`]: chunks[data.item.id].upload_id}
            }
          };
        } else {
          setChunk(data.item.id, {type: data.sendOptions.paramName === 'document' ? MEDIA_TYPE_DOCUMENT : data.sendOptions.paramName});
        }
      },
      [CHUNK_EVENTS.CHUNK_FINISH]: (data) => {
        setChunk(data.item.id, {[`upload_id`]: data.uploadData.response.data.upload_id});
      },
      [UPLOADER_EVENTS.REQUEST_PRE_SEND]: ({items, options}) => {
        if (items.length == 0) {
          return Promise.resolve({options});
        }
        //returned object can be wrapped with a promise
        return Promise.resolve({
          options: {
            inputFieldName: items[0].file.type === 'application/pdf' ? 'document' : options.inputFieldName
          }
        });
      }
    };
  };

  const renderAudienceView: Function = () => {
    return (
      <React.Fragment>
        <DialogTitle className={classes.title}>
          <Typography align="left" component="div">
            <IconButton onClick={() => setView(MAIN_VIEW)} size="small">
              <BackIcon />
            </IconButton>
            <FormattedMessage id="thread.audience.title" defaultMessage="thread.audience.title" />
          </Typography>
          <Box sx={{textAlign: 'center'}}>
            <Avatar className={classes.avatar} src={scAuthContext.user.avatar}></Avatar>
          </Box>
          <Box sx={{textAlign: 'right'}}>
            <Button onClick={() => setView(MAIN_VIEW)} variant="outlined">
              <FormattedMessage id="thread.dialog.done" defaultMessage="thread.dialog.done" />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Box sx={{textAlign: 'center'}} className={classes.block}>
            <ToggleButtonGroup value={audience} exclusive onChange={handleChange('audience')}>
              <ToggleButton value={AUDIENCE_ALL} size="small">
                <PublicIcon />
                <FormattedMessage id="thread.audience.all" defaultMessage="thread.audience.all" />
              </ToggleButton>
              <ToggleButton value={AUDIENCE_TAG} size="small">
                <TagIcon /> <FormattedMessage id="thread.audience.tag" defaultMessage="thread.audience.tag" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Typography align="center" className={classes.block} gutterBottom>
            {audience === AUDIENCE_ALL && <FormattedMessage id="thread.audience.all.message" defaultMessage="thread.audience.all.message" />}
            {audience === AUDIENCE_TAG && <FormattedMessage id="thread.audience.tag.message" defaultMessage="thread.audience.tag.message" />}
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

  const renderImagesView: Function = () => {
    const headers = getChunkUploadHeaders();
    const listeners = getChunkUploadListeners();

    return (
      <React.Fragment>
        <DialogTitle className={classes.title}>
          <Typography align="left" component="div">
            <IconButton onClick={() => setView(MAIN_VIEW)} size="small">
              <BackIcon />
            </IconButton>
            <FormattedMessage id="thread.dialog.media.images.edit" defaultMessage="thread.dialog.media.images.edit" />
          </Typography>
          <Box sx={{textAlign: 'center'}}>
            <Avatar className={classes.avatar} src={scAuthContext.user.avatar}></Avatar>
          </Box>
          <Box sx={{textAlign: 'right'}}>
            <Button onClick={() => setView(MAIN_VIEW)} variant="outlined">
              <FormattedMessage id="thread.dialog.done" defaultMessage="thread.dialog.done" />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Typography gutterBottom component="div">
            <ReactSortable
              list={images}
              setList={(newSort) => dispatch({type: 'images', value: newSort})}
              tag={Grid as ForwardRefExoticComponent<any>}
              container>
              {images.map((media) => (
                <Grid
                  key={media.id}
                  item
                  xs={12}
                  className={classNames(classes.sortableMedia, classes.sortableMediaCover)}
                  style={{backgroundImage: `url(${media.image})`}}>
                  <Box sx={{textAlign: 'right'}} m={1}>
                    <Button onClick={handleDeleteMedia(MEDIA_TYPE_IMAGE, media.id)} size="small" color="primary" variant="contained">
                      <DeleteIcon />
                    </Button>
                  </Box>
                </Grid>
              ))}
            </ReactSortable>
            <Grid container>
              {Object.values(chunks)
                .filter((c: Chunk) => c.type === MEDIA_TYPE_IMAGE && !c.error)
                .map((media: Chunk) => (
                  <Grid
                    key={media.id}
                    item
                    xs={12}
                    className={classNames(classes.sortableMedia, classes.sortableMediaCover)}
                    style={{backgroundImage: `url(${media.image})`}}>
                    <Box sx={{textAlign: 'right'}} m={1}>
                      <Button onClick={handleDeleteMedia(MEDIA_TYPE_IMAGE, media.id)} size="small" color="primary" variant="contained">
                        <DeleteIcon />
                      </Button>
                    </Box>
                    <Box>
                      <Box>
                        <CircularProgress variant="determinate" value={media.completed} />
                        <Box top={0} left={0} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
                          <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(media.completed)}%`}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </Typography>
          <Box>
            {Object.values(chunks)
              .filter((c: Chunk) => c.type === MEDIA_TYPE_IMAGE && c.error)
              .map((c: Chunk) => (
                <Fade in key={c.id}>
                  <Alert severity="error" onClose={handleDeleteMediaChunk(c.id)}>
                    <AlertTitle>{c.name}</AlertTitle>
                    {c.error}
                  </Alert>
                </Fade>
              ))}
          </Box>
          <Typography align="center">
            <ChunkedUploady
              destination={{
                url: `${scContext.settings.portal}${Endpoints.ChunkUploadMedia.url()}`,
                headers,
                method: Endpoints.ChunkUploadMedia.method
              }}
              listeners={listeners}
              chunkSize={2142880}
              multiple
              accept="image/*">
              <ImageUploadButton inputFieldName="image" />
            </ChunkedUploady>
          </Typography>
        </DialogContent>
      </React.Fragment>
    );
  };

  const renderDocumentsView: Function = () => {
    const headers = getChunkUploadHeaders();
    const listeners = getChunkUploadListeners();

    return (
      <React.Fragment>
        <DialogTitle className={classes.title}>
          <Typography align="left" component="div">
            <IconButton onClick={() => setView(MAIN_VIEW)} size="small">
              <BackIcon />
            </IconButton>
            <FormattedMessage id="thread.dialog.media.documents.edit" defaultMessage="thread.dialog.media.documents.edit" />
          </Typography>
          <Box sx={{textAlign: 'center'}}>
            <Avatar className={classes.avatar} src={scAuthContext.user.avatar}></Avatar>
          </Box>
          <Box sx={{textAlign: 'right'}}>
            <Button onClick={() => setView(MAIN_VIEW)} variant="outlined">
              <FormattedMessage id="thread.dialog.done" defaultMessage="thread.dialog.done" />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Typography gutterBottom component="div">
            <ReactSortable
              list={docs}
              setList={(newSort) => dispatch({type: 'docs', value: newSort})}
              tag={Grid as ForwardRefExoticComponent<any>}
              container>
              {docs.map((media) => (
                <Grid key={media.id} item xs={12} className={classes.sortableMedia} style={{backgroundImage: `url(${media.image})`}}>
                  <Box sx={{textAlign: 'right'}} m={1}>
                    <Button onClick={handleDeleteMedia(MEDIA_TYPE_DOCUMENT, media.id)} size="small" color="primary" variant="contained">
                      <DeleteIcon />
                    </Button>
                  </Box>
                </Grid>
              ))}
            </ReactSortable>
            <Grid container>
              {Object.values(chunks)
                .filter((c: Chunk) => c.type === MEDIA_TYPE_DOCUMENT && !c.error)
                .map((media: Chunk) => (
                  <Grid
                    key={media.id}
                    item
                    xs={12}
                    className={classNames(classes.sortableMedia, classes.sortableMediaCover)}
                    style={{backgroundImage: `url(${media.image})`}}>
                    <Box sx={{textAlign: 'right'}} m={1}>
                      <Button onClick={handleDeleteMedia(MEDIA_TYPE_DOCUMENT, media.id)} size="small" color="primary" variant="contained">
                        <DeleteIcon />
                      </Button>
                    </Box>
                    <Box>
                      <Box>
                        <CircularProgress variant="determinate" value={media.completed} />
                        <Box top={0} left={0} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
                          <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(media.completed)}%`}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </Typography>
          <Box>
            {Object.values(chunks)
              .filter((c: Chunk) => c.type === MEDIA_TYPE_DOCUMENT && c.error)
              .map((c: Chunk) => (
                <Fade in key={c.id}>
                  <Alert severity="error" onClose={handleDeleteMediaChunk(c.id)}>
                    <AlertTitle>{c.name}</AlertTitle>
                    {c.error}
                  </Alert>
                </Fade>
              ))}
          </Box>
          <Typography align="center">
            <ChunkedUploady
              destination={{
                url: `${scContext.settings.portal}${Endpoints.ChunkUploadMedia.url()}`,
                headers,
                method: Endpoints.ChunkUploadMedia.method
              }}
              listeners={listeners}
              chunkSize={2142880}
              multiple
              accept="application/pdf">
              <DocumentUploadButton inputFieldName="document" />
            </ChunkedUploady>
          </Typography>
        </DialogContent>
      </React.Fragment>
    );
  };

  const renderLinksView: Function = () => {
    return (
      <React.Fragment>
        <DialogTitle className={classes.title}>
          <Typography align="left" component="div">
            <IconButton onClick={() => setView(MAIN_VIEW)} size="small">
              <BackIcon />
            </IconButton>
            <FormattedMessage id="thread.dialog.media.links.edit" defaultMessage="thread.dialog.media.links.edit" />
          </Typography>
          <Box sx={{textAlign: 'center'}}>
            <Avatar className={classes.avatar} src={scAuthContext.user.avatar}></Avatar>
          </Box>
          <Box sx={{textAlign: 'right'}}>
            <Button onClick={() => setView(MAIN_VIEW)} variant="outlined">
              <FormattedMessage id="thread.dialog.done" defaultMessage="thread.dialog.done" />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent className={classNames(classes.content, classes.links)}>
          <UrlTextField
            id="page"
            name="page"
            label={<FormattedMessage id="thread.dialog.media.links.add.label" defaultMessage="thread.dialog.media.links.add.label" />}
            fullWidth
            variant="outlined"
            placeholder="https://"
            onSuccess={handleAddMedia(MEDIA_TYPE_LINK)}
          />
          {links.length > 0 && (
            <ReactSortable list={links} setList={(newSort) => dispatch({type: 'links', value: newSort})}>
              {links.map((media) => (
                <Box key={media.id} m={1} className={classes.sortableMedia}>
                  <Link media={media} wide />
                  <Box className={classes.mediasActions}>
                    &nbsp;
                    <Button onClick={handleDeleteMedia(MEDIA_TYPE_LINK, media.id)} size="small" color="primary" variant="contained">
                      <DeleteIcon />
                    </Button>
                  </Box>
                </Box>
              ))}
            </ReactSortable>
          )}
        </DialogContent>
      </React.Fragment>
    );
  };

  const renderVideosView: Function = () => null;

  const renderMainView: Function = () => {
    const headers = getChunkUploadHeaders();
    const listeners = getChunkUploadListeners();
    const chunkErrors = Object.values(chunks).filter((c: Chunk) => c.error);

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
                      <FormattedMessage id={'thread.dialog.type.post'} defaultMessage={'thread.dialog.type.post'} />
                    ) : (
                      <FormattedMessage id={'thread.dialog.type.discussion'} defaultMessage={'thread.dialog.type.discussion'} />
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
          <ChunkedUploady
            destination={{url: `${scContext.settings.portal}${Endpoints.ChunkUploadMedia.url()}`, headers, method: Endpoints.ChunkUploadMedia.method}}
            listeners={listeners}
            chunkSize={2142880}
            multiple>
            <UploadDropZone
              onDragOverClassName={classes.drop}
              inputFieldName="image"
              // TODO: accept="image/*"
              extraProps={{'data-content': intl.formatMessage(messages.drop)}}>
              {type === COMPOSER_TYPE_DISCUSSION && (
                <div className={classes.block}>
                  <TextField
                    label={<FormattedMessage id="thread.title.label" defaultMessage="thread.title.label" />}
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
              <Editor className={classes.block} onChange={handleChangeText} defaultValue={text} />
              <Box className={classes.medias}>
                <Medias
                  medias={[...images, ...videos, ...docs, ...links, ...Object.values(chunks).filter((c: Chunk) => !c.error)]}
                  GridImageProps={{gallery: false, overlay: false}}
                  imagesAdornment={this.renderMediaControls(MEDIA_TYPE_IMAGE)}
                  videosAdornment={this.renderMediaControls(MEDIA_TYPE_VIDEO)}
                  documentsAdornment={this.renderMediaControls(MEDIA_TYPE_DOCUMENT)}
                  linksAdornment={this.renderMediaControls(MEDIA_TYPE_LINK)}
                />
              </Box>
              <div className={classes.block}>
                <Categories onChange={handleChange('categories')} defaultValue={categories} />
              </div>
            </UploadDropZone>
          </ChunkedUploady>
          {chunkErrors.length > 0 && (
            <Box>
              {chunkErrors.map((c: Chunk) => (
                <Fade in key={c.id}>
                  <Alert severity="error" onClose={handleDeleteMediaChunk(c.id)}>
                    <AlertTitle>{c.name}</AlertTitle>
                    {c.error}
                  </Alert>
                </Fade>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Typography align="left">
            <ChunkedUploady
              destination={{
                url: `${scContext.settings.portal}${Endpoints.ChunkUploadMedia.url()}`,
                headers,
                method: Endpoints.ChunkUploadMedia.method
              }}
              listeners={listeners}
              chunkSize={2142880}
              multiple
              accept="image/*">
              <ImageUploadIconButton inputFieldName="image" ref={this.imagesUploadRef} />
            </ChunkedUploady>
            {preferences[SCPreferences.ADDONS_VIDEO_UPLOAD_ENABLED] && (
              <IconButton aria-label="add video" size="large">
                <VideoIcon />
              </IconButton>
            )}
            <ChunkedUploady
              destination={{
                url: `${scContext.settings.portal}${Endpoints.ChunkUploadMedia.url()}`,
                headers,
                method: Endpoints.ChunkUploadMedia.method
              }}
              listeners={listeners}
              chunkSize={2142880}
              multiple
              accept="application/pdf">
              <DocumentUploadIconButton inputFieldName="document" ref={this.documentsUploadRef} />
            </ChunkedUploady>
            <IconButton aria-label="add link" onClick={() => setView(LINKS_VIEW)} size="large">
              <LinkIcon />
            </IconButton>
          </Typography>
          <Typography align="right">
            <IconButton onClick={() => setView(AUDIENCE_VIEW)} size="large">
              {addressing.length > 0 ? <TagIcon /> : <PublicIcon />}
            </IconButton>
            <LoadingButton
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              disabled={
                Object.keys(chunks).length > 0 ||
                (type === COMPOSER_TYPE_DISCUSSION && title.length === 0) ||
                (type === COMPOSER_TYPE_POST && stripHtml(text).length === 0)
              }
              loading={isSubmitting}>
              <FormattedMessage id="thread.dialog.submit" defaultMessage="thread.dialog.submit" />
            </LoadingButton>
          </Typography>
        </DialogActions>
      </React.Fragment>
    );
  };

  const renderPollView: Function = () => null;

  const views = {
    [MAIN_VIEW]: renderMainView,
    [AUDIENCE_VIEW]: renderAudienceView,
    [IMAGES_VIEW]: renderImagesView,
    [VIDEOS_VIEW]: renderVideosView,
    [DOCUMENTS_VIEW]: renderDocumentsView,
    [LINKS_VIEW]: renderLinksView,
    [POLL_VIEW]: renderPollView
  };

  return (
    <Root open={open} TransitionComponent={DialogTransition} keepMounted onClose={handleClose} maxWidth="sm" fullWidth scroll="body">
      {views[view]()}
    </Root>
  );
}
