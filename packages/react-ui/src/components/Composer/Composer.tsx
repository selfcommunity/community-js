import React, {
  forwardRef,
  ReactNode,
  RefObject,
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from 'react';
import {
  SCCategoryType,
  SCContributionType,
  SCFeatureName,
  SCFeedDiscussionType,
  SCFeedPostType,
  SCFeedStatusType,
  SCLocalityType,
  SCMediaType,
  SCPollType,
  SCTagType
} from '@selfcommunity/types';
import {Endpoints, formatHttpErrorCode, http, HttpResponse} from '@selfcommunity/api-services';
import {
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCThemeType,
  SCUserContext,
  SCUserContextType,
  UserUtils,
  useSCFetchAddressingTagList
} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import Icon from '@mui/material/Icon';
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
  IconButton,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Tabs,
  TextField,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import {COMPOSER_POLL_MIN_CHOICES, COMPOSER_TITLE_MAX_LENGTH, COMPOSER_TYPE_DISCUSSION, COMPOSER_TYPE_POST} from '../../constants/Composer';
import {MEDIA_TYPE_SHARE} from '../../constants/Media';
import LoadingButton from '@mui/lab/LoadingButton';
import Audience from './Audience';
import CategoryAutocomplete from '../CategoryAutocomplete';
import {isObject, random, stripHtml} from '@selfcommunity/utils';
import classNames from 'classnames';
import {TransitionProps} from '@mui/material/transitions';
import PollPreview from '../FeedObject/Poll';
import Editor, {EditorProps, EditorRef} from '../Editor';
import {SCMediaChunkType, SCMediaObjectType} from '../../types/media';
import {Document, Image, Link, Share} from '../../shared/Media';
import MediasPreview from '../../shared/MediasPreview';
import Poll from './Poll';
import LocationAutocomplete from '../LocationAutocomplete';
import TagChip from '../../shared/TagChip';
import {DistributiveOmit} from '@mui/types';
import {OverrideProps} from '@mui/material/OverridableComponent';
import {ComposerSkeleton} from './index';
import {useSnackbar} from 'notistack';
import {useThemeProps} from '@mui/system';
import {extractHashtags} from '../../utils/editor';
import ClickAwayListener from '@mui/material/ClickAwayListener';

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
  root: `${PREFIX}-root`,
  writing: `${PREFIX}-writing`,
  title: `${PREFIX}-title`,
  titleDense: `${PREFIX}-title-dense`,
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
  mediasActionsTitle: `${PREFIX}-mediasActionsTitle`,
  mediasActionsActions: `${PREFIX}-mediasActionsActions`,
  sortableMedia: `${PREFIX}-sortableMedia`,
  sortableMediaCover: `${PREFIX}-sortableMediaCover`,
  links: `${PREFIX}-links`,
  actions: `${PREFIX}-actions`,
  mediaActions: `${PREFIX}-media-actions`,
  filterActions: `${PREFIX}-filter-actions`,
  actionInput: `${PREFIX}-actionInput`,
  badgeError: `${PREFIX}-badgeError`
};

const Root = styled(Dialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export interface ComposerTypeMap<P = any, D extends React.ElementType = 'div'> {
  props: P &
    DistributiveOmit<DialogProps, 'defaultValue'> & {
      /**
       * Id of feed object
       * @default null
       */
      feedObjectId?: number;
      /**
       * Type of feed object
       * @default null
       */
      feedObjectType?: Exclude<SCContributionType, SCContributionType.COMMENT>;
      /**
       * Feed object
       * @default null
       */
      feedObject?: SCFeedDiscussionType | SCFeedPostType | SCFeedStatusType | null;
      /**
       * Initialization Data for the Composer, this is a hook to generate custom posts
       * @default null
       */
      defaultValue?: {
        title?: string;
        text?: string;
        categories?: SCCategoryType[];
        audience?: string;
        addressing?: SCTagType[];
        medias?: SCMediaType[];
        poll?: SCPollType;
        location?: string;
      };
      /**
       * Initial view to render
       * @default 'main'
       */
      view?: string;
      /**
       * Media objects available
       * @default Image, Document, Link
       */
      mediaObjectTypes?: SCMediaObjectType[];
      /**
       * Editor props
       * @default {toolbar: false}
       */
      EditorProps?: EditorProps;
      /**
       * Callback triggered on success contribution creation
       * @default null
       */
      onSuccess?: (res: any) => void;
      /**
       * Callback triggered on close click
       * @default null
       */
      onClose?: (event: SyntheticEvent) => void;
    };
  defaultComponent: D;
}

export type ComposerProps<D extends React.ElementType = ComposerTypeMap['defaultComponent'], P = any> = OverrideProps<ComposerTypeMap<P, D>, D>;

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
  id: null,
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
  location: null,
  error: null
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
/**
 * > API documentation for the Community-JS Composer component. Learn about the available props and the CSS API.
 *
 *
 * The Composer component contains the logic around the creation of [Post](https://developers.selfcommunity.com/docs/apireference/v2/post/create_a_post) and [Discussion](https://developers.selfcommunity.com/docs/apireference/v2/discussion/create_a_discussion) objects.

 #### Import
 ```jsx
 import {Composer} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCComposer` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCComposer-root|Styles applied to the root element.|
 |writing|.SCComposer-writing|Styles applied to the root element when user is writing in the editor.|
 |title|.SCComposer-title|Styles applied to the title element.|
 |titleDense|.SCComposer-title-dense|Styles applied to the dense title element.|
 |types|.SCComposer-types|Styles applied to the types element.|
 |avatar|.SCComposer-avatar|Styles applied to the avatar element.|
 |content|.SCComposer-content|Styles applied to the content.|
 |mediaContent|.SCComposer-mediaContent|Styles applied to the media content.|
 |audienceContent|.SCComposer-audienceContent|Styles applied to the audience content.|
 |locationContent|.SCComposer-locationContent|Styles applied to the location content.|
 |block|.SCComposer-block|Styles applied to the block element.|
 |editor|.SCComposer-editor|Styles applied to the editor element.|
 |divider|.SCComposer-divider|Styles applied to the divider element.|
 |medias|.SCComposer-medias|Styles applied to the medias.|
 |location|.SCComposer-location|Styles applied to the location element.|
 |audience|.SCComposer-audience|Styles applied to the audience element.|
 |mediasActions|.SCComposer-mediasActions|Styles applied to the medias actions section.|
 |sortableMedia|.SCComposer-sortableMedia|Styles applied to the sortable media element.|
 |sortableMediaCover|.SCComposer-sortableMediaCover|Styles applied to the sortable media cover element.|
 |links|.SCComposer-links|Styles applied to the links element.|
 |actions|.SCComposer-actions|Styles applied to the actions section.|
 |mediaActions|.SCComposer-media-actions|Styles applied to the media actions section.|
 |filterActions|.SCComposer-filter-actions|Styles applied to the filter actions section.|
 |actionInput|.SCComposer-actionInput|Styles applied to the action input element.|
 |badgeError|.SCComposer-badgeError|Styles applied to the badge error element.|


 * @param inProps
 */
export default function Composer(inProps: ComposerProps): JSX.Element {
  // PROPS
  const props: ComposerProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    feedObjectId = null,
    feedObjectType = null,
    feedObject = null,
    defaultValue = {},
    view = MAIN_VIEW,
    mediaObjectTypes = [Image, Document, Link, Share],
    EditorProps = null,
    onClose = null,
    onSuccess = null,
    maxWidth,
    ...rest
  } = props;

  // Context
  const scPrefernces: SCPreferencesContextType = useContext(SCPreferencesContext);
  const scAuthContext: SCUserContextType = useContext(SCUserContext);
  const {enqueueSnackbar} = useSnackbar();

  // HOOKS
  const {scAddressingTags} = useSCFetchAddressingTagList({fetch: rest.open});
  const theme: Theme = useTheme<SCThemeType>();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'), {noSsr: typeof window !== 'undefined'});

  // State variables
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [_view, setView] = useState<string>(view);
  const [composerTypes, setComposerTypes] = useState([]);
  const [mediaChunks, setMediaChunks] = useState<SCMediaChunkType[]>([]);
  const [editorFocused, setEditorFocused] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, {...COMPOSER_INITIAL_STATE, ...defaultValue, view, key: random()});
  const {key, id, type, title, titleError, text, categories, addressing, audience, medias, poll, pollError, location, error} = state;
  const addMedia = (media: SCMediaType) => {
    dispatch({type: 'medias', value: [...medias, media]});
  };

  const destructureFeedObject = (_feedObject) => {
    if (_feedObject.type === COMPOSER_TYPE_POST) {
      _feedObject = _feedObject as SCFeedPostType;
    } else if (_feedObject.type === COMPOSER_TYPE_DISCUSSION) {
      _feedObject = _feedObject as SCFeedDiscussionType;
    } else {
      _feedObject = _feedObject as SCFeedStatusType;
    }
    if (feedObject.author.id === scAuthContext.user.id) {
      dispatch({
        type: 'multiple',
        value: {
          id: _feedObject.id,
          type: _feedObject.type,
          title: _feedObject.title,
          text: _feedObject.html,
          categories: _feedObject.categories,
          audience: _feedObject.addressing ? AUDIENCE_TAG : AUDIENCE_ALL,
          addressing: _feedObject.addressing,
          medias: _feedObject.medias,
          poll: _feedObject.poll,
          location: _feedObject.location
        }
      });
      setIsLoading(false);
    } else {
      setLoadError(true);
    }
  };

  // Edit state variables
  const editMode = Boolean((feedObjectId && feedObjectType) || feedObject);
  const [isLoading, setIsLoading] = useState<boolean>(editMode);
  const [loadError, setLoadError] = useState<boolean>(false);

  // REFS
  const unloadRef = useRef<boolean>(false);
  let titleRef = useRef<any>();
  let editorRef: RefObject<EditorRef> = useRef<EditorRef>();

  // Create a ref for medias becaouse of state update error on chunk upload
  const mediasRef = useRef({medias, mediaChunks, addMedia, setMediaChunks});
  mediasRef.current = {medias, mediaChunks, addMedia, setMediaChunks};

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
    } else if (feedObject !== null) {
      destructureFeedObject(feedObject);
      return;
    }
    setIsLoading(true);
    http
      .request({
        url: Endpoints.FeedObject.url({type: feedObjectType, id: feedObjectId}),
        method: Endpoints.FeedObject.method
      })
      .then((res: HttpResponse<any>) => {
        destructureFeedObject(res.data);
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

  // Autofocus
  useEffect(() => {
    if (!rest.open || fullScreen) {
      return;
    }
    if (type === COMPOSER_TYPE_DISCUSSION) {
      titleRef.current && titleRef.current.focus();
    } else {
      editorRef.current && editorRef.current.focus();
    }
  }, [fullScreen, rest.open, type, editorRef]);

  // CHECKS
  const hasPoll = () => {
    return poll && poll.title.length > 0 && poll.title.length < COMPOSER_TITLE_MAX_LENGTH && poll.choices.length >= COMPOSER_POLL_MIN_CHOICES;
  };

  const canSubmit = () => {
    return (
      (type === COMPOSER_TYPE_DISCUSSION && title.length > 0 && title.length < COMPOSER_TITLE_MAX_LENGTH) ||
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

  const handleChangePoll = (poll: SCPollType): void => {
    dispatch({
      type: 'multiple',
      value: {
        poll: poll,
        pollError:
          poll.title.length > COMPOSER_TITLE_MAX_LENGTH
            ? {titleError: <FormattedMessage id="ui.composer.title.error.maxlength" defaultMessage="ui.composer.title.error.maxlength" />}
            : null
      }
    });
  };

  const handleChange =
    (prop: string) =>
    (event: SyntheticEvent, data?: any): void => {
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
          dispatch({type: prop, value: event});
          break;
        case 'location':
          const value =
            event && isObject(event)
              ? event['location']
                ? {location: event['location'], lat: event['lat'], lng: event['lng']}
                : {location: event['full_address'], lat: event['lat'], lng: event['lng']}
              : null;
          dispatch({type: prop, value});
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

  const handleDeleteMedia = (id?: number | null, mediaObjectType?: any) => {
    return (event: SyntheticEvent): void => {
      if (id) {
        dispatch({type: 'medias', value: medias.filter((m) => m.id != id)});
      } else if (mediaObjectType) {
        dispatch({type: 'medias', value: medias.filter((m) => !mediaObjectType.filter(m))});
      }
    };
  };

  const handleMediaProgress = (chunks: SCMediaChunkType[]) => {
    mediasRef.current.setMediaChunks(chunks);
  };

  const handleAddMedia = (media: SCMediaType) => {
    mediasRef.current.addMedia(media);
  };

  const handleSortMedia = (newSort: SCMediaType[]) => {
    dispatch({
      type: 'medias',
      value: [...medias.filter((media: any) => newSort.findIndex((m: any) => m.id === media.id) === -1), ...newSort]
    });
  };

  const handleSubmit = (event: SyntheticEvent): void => {
    if (UserUtils.isBlocked(scAuthContext.user)) {
      // deny submit action if authenticated user is blocked
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning',
        autoHideDuration: 3000
      });
      return;
    }
    // Extract hashtags and add to categories
    const _categories: string[] = [...categories.map((c: SCCategoryType) => c.id), ...extractHashtags(text)];
    const data: any = {
      title,
      text,
      medias: medias.map((m) => m.id),
      categories: _categories.filter((item, index) => _categories.indexOf(item) === index)
    };
    if (preferences[SCPreferences.ADDONS_POLLS_ENABLED] && hasPoll()) {
      data.poll = poll;
    }
    if (preferences[SCPreferences.ADDONS_POST_GEOLOCATION_ENABLED] && location) {
      data.location = {
        location: location.location,
        lat: location.lat,
        lng: location.lng
      };
    }
    if (scPrefernces.features.includes(SCFeatureName.TAGGING) && audience === AUDIENCE_TAG) {
      data.addressing = addressing.map((t) => t.id);
    }
    setIsSubmitting(true);

    // Finding right url
    let url = Endpoints.Composer.url({type});
    let method = Endpoints.Composer.method;
    if (editMode) {
      url = Endpoints.ComposerEdit.url({type, id});
      method = Endpoints.ComposerEdit.method;
    }

    // Perform request
    http
      .request({
        url,
        method,
        data
      })
      .then((res: HttpResponse<any>) => {
        onSuccess(res.data);
        if (unloadRef.current) {
          window.onbeforeunload = null;
        }
        dispatch({type: 'reset'});
      })
      .catch((error) => {
        dispatch({type: 'multiple', value: formatHttpErrorCode(error)});
      })
      .then(() => setIsSubmitting(false));
  };

  // MEMO
  const _EditorProps = useMemo(
    () => (EditorProps ? EditorProps : {toolbar: true, uploadImage: type === COMPOSER_TYPE_DISCUSSION}),
    [EditorProps, type]
  );

  // RENDER

  const hasMediaShare = useMemo(() => medias.findIndex((m) => m.type === MEDIA_TYPE_SHARE) !== -1, [medias]);

  const renderMediaAdornment = (mediaObjectType: SCMediaObjectType): JSX.Element => {
    return (
      <Box className={classes.mediasActions}>
        <Typography className={classes.mediasActionsTitle}>
          <FormattedMessage id={`ui.composer.media.${mediaObjectType.name}.edit`} defaultMessage={`ui.composer.media.${mediaObjectType.name}.edit`} />
        </Typography>
        <Typography className={classes.mediasActionsActions}>
          <Tooltip title={<FormattedMessage id="ui.composer.edit" defaultMessage="ui.composer.edit" />}>
            <IconButton onClick={handleChangeView(mediaObjectType.name)} color="inherit">
              <Icon>edit</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title={<FormattedMessage id="ui.composer.delete" defaultMessage="ui.composer.delete" />}>
            <IconButton onClick={handleDeleteMedia(null, mediaObjectType)} color="inherit">
              <Icon>delete</Icon>
            </IconButton>
          </Tooltip>
        </Typography>
      </Box>
    );
  };

  const renderAudienceView = () => {
    return (
      <React.Fragment>
        <DialogTitle className={classes.title}>
          <Typography component="div">
            <IconButton onClick={handleChangeView(MAIN_VIEW)}>
              <Icon>arrow_back</Icon>
            </IconButton>
          </Typography>
          <Box>
            <FormattedMessage id="ui.composer.audience.title" defaultMessage="ui.composer.audience.title" />
          </Box>
          <Box>
            <Tooltip title={<FormattedMessage id="ui.composer.done" defaultMessage="ui.composer.done" />}>
              <IconButton onClick={handleChangeView(MAIN_VIEW)} color="inherit">
                <Icon>check</Icon>
              </IconButton>
            </Tooltip>
          </Box>
        </DialogTitle>
        <DialogContent className={classNames(classes.content, classes.audienceContent)}>
          <Tabs value={audience} onChange={handleChange('audience')} aria-label="audience type">
            <Tab
              value={AUDIENCE_ALL}
              icon={<Icon>public</Icon>}
              label={<FormattedMessage id="ui.composer.audience.all" defaultMessage="ui.composer.audience.all" />}
            />
            <Tab
              value={AUDIENCE_TAG}
              icon={<Icon>label</Icon>}
              label={<FormattedMessage id="ui.composer.audience.tag" defaultMessage="ui.composer.audience.tag" />}
            />
          </Tabs>
          <Typography align="center" className={classes.block}>
            {audience === AUDIENCE_ALL && (
              <FormattedMessage id="ui.composer.audience.all.message" defaultMessage="ui.composer.audience.all.message" />
            )}
            {audience === AUDIENCE_TAG && (
              <FormattedMessage id="ui.composer.audience.tag.message" defaultMessage="ui.composer.audience.tag.message" />
            )}
          </Typography>
          {audience === AUDIENCE_TAG && <Audience onChange={handleChange('addressing')} defaultValue={addressing} tags={scAddressingTags} />}
        </DialogContent>
      </React.Fragment>
    );
  };

  const renderMediaView = (mediaObjectType: SCMediaObjectType) => {
    return () => {
      return (
        <React.Fragment>
          <DialogTitle className={classes.title}>
            <Typography component="div">
              <span>
                <IconButton onClick={handleChangeView(MAIN_VIEW)} disabled={mediasRef.current.mediaChunks.length > 0}>
                  <Icon>arrow_back</Icon>
                </IconButton>
              </span>
            </Typography>
            <Box>
              <FormattedMessage
                id={`ui.composer.media.${mediaObjectType.name}.edit`}
                defaultMessage={`ui.composer.media.${mediaObjectType.name}.edit`}
              />
            </Box>
            <Box>
              <Tooltip title={<FormattedMessage id="ui.composer.done" defaultMessage="ui.composer.done" />}>
                <span>
                  <IconButton onClick={handleChangeView(MAIN_VIEW)} color="inherit" disabled={mediasRef.current.mediaChunks.length > 0}>
                    <Icon>check</Icon>
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </DialogTitle>
          <DialogContent className={classNames(classes.content, classes.mediaContent)}>
            {
              <mediaObjectType.editComponent
                medias={medias.filter(mediaObjectType.filter)}
                onProgress={handleMediaProgress}
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

  const renderPollView = () => {
    return (
      <React.Fragment>
        <DialogTitle className={classes.title}>
          <Typography component="div">
            <IconButton onClick={handleChangeView(MAIN_VIEW)}>
              <Icon>arrow_back</Icon>
            </IconButton>
          </Typography>
          <Box>
            <FormattedMessage id="ui.composer.poll" defaultMessage="ui.composer.poll" />
          </Box>
          <Stack spacing={2} direction="row">
            <>
              <Tooltip title={<FormattedMessage id="ui.composer.delete" defaultMessage="ui.composer.delete" />}>
                <span>
                  <IconButton onClick={handleDeletePoll} color="inherit" disabled={!hasPoll()}>
                    <Icon>delete</Icon>
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={<FormattedMessage id="ui.composer.done" defaultMessage="ui.composer.done" />}>
                <span>
                  <IconButton onClick={handleChangeView(MAIN_VIEW)} color="inherit" disabled={!hasPoll()}>
                    <Icon>check</Icon>
                  </IconButton>
                </span>
              </Tooltip>
            </>
          </Stack>
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Poll onChange={handleChangePoll} value={poll} error={pollError} />
        </DialogContent>
      </React.Fragment>
    );
  };

  const renderLocationView = () => {
    return (
      <React.Fragment>
        <DialogTitle className={classes.title}>
          <Typography component="div">
            <IconButton onClick={handleChangeView(MAIN_VIEW)}>
              <Icon>arrow_back</Icon>
            </IconButton>
          </Typography>
          <Box>
            <FormattedMessage id="ui.locationAutocomplete.title" defaultMessage="ui.locationAutocomplete.title" />
          </Box>
          <Box>
            <Tooltip title={<FormattedMessage id="ui.composer.done" defaultMessage="ui.composer.done" />}>
              <IconButton onClick={handleChangeView(MAIN_VIEW)} color="inherit">
                <Icon>check</Icon>
              </IconButton>
            </Tooltip>
          </Box>
        </DialogTitle>
        <DialogContent className={classNames(classes.content, classes.locationContent)}>
          <LocationAutocomplete
            onChange={handleChange('location')}
            defaultValue={location ? ({full_address: location.location} as SCLocalityType) : ''}
          />
        </DialogContent>
      </React.Fragment>
    );
  };

  const renderMainView = () => {
    return (
      <React.Fragment>
        <DialogTitle className={classes.title}>
          <Box>
            <FormControl className={classes.types}>
              <Select value={type} onChange={handleChangeType} input={<TypeInput />} disabled={editMode}>
                {composerTypes.map((t) => (
                  <MenuItem value={t} key={t}>
                    <FormattedMessage id={`ui.composer.type.${t}`} defaultMessage={`ui.composer.type.${t}`} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            {!scAuthContext.user ? <Avatar className={classes.avatar} /> : <Avatar className={classes.avatar} src={scAuthContext.user.avatar} />}
          </Box>
          <Box>
            <IconButton onClick={handleClose}>
              <Icon>close</Icon>
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent className={classes.content}>
          {type === COMPOSER_TYPE_DISCUSSION && (
            <div className={classes.block}>
              <TextField
                inputRef={titleRef}
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
            ref={editorRef}
            {..._EditorProps}
            key={`${key}-editor`}
            className={classNames(classes.block, classes.editor)}
            onChange={handleChangeText}
            onFocus={() => setEditorFocused(true)}
            defaultValue={text}
            editable={!isSubmitting}
          />
          <Box className={classes.medias}>
            <MediasPreview
              medias={medias}
              mediaObjectTypes={mediaObjectTypes.map((mediaObjectType) => {
                return {
                  ...mediaObjectType,
                  previewProps: {adornment: mediaObjectType.editButton !== null ? renderMediaAdornment(mediaObjectType) : null, gallery: false}
                } as SCMediaObjectType;
              })}
            />
          </Box>
          {poll && <PollPreview pollObject={poll} />}
          <Stack spacing={2} className={classes.audience} direction="row">
            {location && (
              <Chip
                icon={<Icon>add_location_alt</Icon>}
                label={location.location}
                onDelete={handleDeleteLocation}
                onClick={handleChangeView(LOCATION_VIEW)}
              />
            )}
            {audience === AUDIENCE_TAG &&
              addressing &&
              addressing.map((t: SCTagType) => (
                <TagChip key={t.id} tag={t} onDelete={handleDeleteTag(t.id)} icon={<Icon>label</Icon>} onClick={handleChangeView(AUDIENCE_VIEW)} />
              ))}
          </Stack>
          <div className={classes.block}>
            <CategoryAutocomplete
              multiple
              key={`${key}-categories`}
              onChange={handleChange('categories')}
              defaultValue={categories}
              disabled={isSubmitting}
            />
          </div>
          {error && (
            <Typography className={classes.block} color="error">
              <FormattedMessage id="ui.composer.error.generic" defaultMessage="ui.composer.error.generic" />
            </Typography>
          )}
        </DialogContent>
        <DialogActions className={classes.actions} onClick={() => setEditorFocused(false)}>
          <Typography className={classes.mediaActions}>
            {mediaObjectTypes
              .filter((mediaObjectType: SCMediaObjectType) => mediaObjectType.editButton !== null)
              .map((mediaObjectType: SCMediaObjectType) => (
                <mediaObjectType.editButton
                  key={mediaObjectType.name}
                  onClick={handleChangeView(mediaObjectType.name)}
                  disabled={isSubmitting || hasMediaShare}
                  color={medias.filter(mediaObjectType.filter).length > 0 ? 'primary' : 'default'}
                />
              ))}
            {/*{preferences[SCPreferences.ADDONS_VIDEO_UPLOAD_ENABLED] && (*/}
            {/*  <IconButton aria-label="add video" size="medium">*/}
            {/*    <Icon>play_circle_outline</Icon>*/}
            {/*  </IconButton>*/}
            {/*)}*/}
            {(preferences[SCPreferences.ADDONS_POLLS_ENABLED] || UserUtils.isStaff(scAuthContext.user)) && (
              <IconButton aria-label="add poll" color={poll ? 'primary' : 'default'} disabled={isSubmitting} onClick={handleChangeView(POLL_VIEW)}>
                <Badge className={classes.badgeError} badgeContent={pollError ? ' ' : null} color="error">
                  <Icon>bar_chart</Icon>
                </Badge>
              </IconButton>
            )}
          </Typography>
          <Typography className={classes.filterActions}>
            {preferences[SCPreferences.ADDONS_POST_GEOLOCATION_ENABLED] && (
              <IconButton disabled={isSubmitting} onClick={handleChangeView(LOCATION_VIEW)} color={location !== null ? 'primary' : 'default'}>
                <Icon>add_location_alt</Icon>
              </IconButton>
            )}
            {scPrefernces.features.includes(SCFeatureName.TAGGING) && scAddressingTags.length > 0 && (
              <IconButton disabled={isSubmitting} onClick={handleChangeView(AUDIENCE_VIEW)}>
                {audience === AUDIENCE_TAG ? <Icon>label</Icon> : <Icon>public</Icon>}
              </IconButton>
            )}
          </Typography>
          <LoadingButton onClick={handleSubmit} color="primary" variant="contained" disabled={!canSubmit()} loading={isSubmitting}>
            <FormattedMessage id="ui.composer.submit" defaultMessage="ui.composer.submit" />
          </LoadingButton>
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
      const media = mediaObjectTypes
        .filter((mediaObjectType: SCMediaObjectType) => mediaObjectType.editComponent !== null)
        .find((mv) => mv.name === _view);
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

  const _maxWidth = useMemo(() => (maxWidth ? maxWidth : type === COMPOSER_TYPE_DISCUSSION ? 'md' : 'sm'), [maxWidth, type]);
  if (!scAuthContext.user) {
    return null;
  }

  return (
    <Root
      maxWidth={_maxWidth}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={handleClose}
      {...rest}
      className={classNames(classes.root, {[classes.writing]: editorFocused})}
      fullScreen={fullScreen}>
      {editorFocused && fullScreen && (
        <Box className={classes.titleDense}>
          <IconButton onClick={() => setEditorFocused(false)}>
            <Tooltip title={<FormattedMessage id="ui.composer.editorFullScreen.close" defaultMessage="ui.composer.editorFullScreen.close" />}>
              <Icon>zoom_out_map</Icon>
            </Tooltip>
          </IconButton>
          <IconButton onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
        </Box>
      )}
      {child()}
    </Root>
  );
}
