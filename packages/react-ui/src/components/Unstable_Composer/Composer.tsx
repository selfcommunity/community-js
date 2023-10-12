import React, {
  forwardRef,
  RefObject,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  SCCategoryType,
  SCContributionLocation,
  SCContributionType,
  SCFeatureName,
  SCFeedDiscussionType,
  SCFeedPostType,
  SCFeedStatusType,
  SCMediaType,
  SCPollType,
  SCTagType,
} from '@selfcommunity/types';
import { Endpoints, formatHttpErrorCode, http, HttpResponse } from '@selfcommunity/api-services';
import {
  SCPreferences,
  SCPreferencesContextType,
  SCThemeType,
  SCUserContextType,
  UserUtils,
  useSCPreferences,
  useSCUser,
} from '@selfcommunity/react-core';
import { FormattedMessage } from 'react-intl';
import Icon from '@mui/material/Icon';
import {
  Alert,
  AlertTitle,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Fade,
  IconButton,
  Slide,
  TextField,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import {
  COMPOSER_POLL_MIN_CHOICES,
  COMPOSER_TITLE_MAX_LENGTH,
  COMPOSER_TYPE_DISCUSSION,
  COMPOSER_TYPE_POLL,
  COMPOSER_TYPE_POST,
} from '../../constants/Composer';
import { MEDIA_TYPE_SHARE } from '../../constants/Media';
import LoadingButton from '@mui/lab/LoadingButton';
import AudienceLayer from './Layer/AudienceLayer';
import { iOS, random, stripHtml } from '@selfcommunity/utils';
import classNames from 'classnames';
import { TransitionProps } from '@mui/material/transitions';
import { EditorProps, EditorRef } from '../Editor';
import { SCMediaChunkType, SCMediaObjectType } from '../../types/media';
import { Document, Image, Link, Share } from '../../shared/Media';
import ContentPoll from './Content/ContentPoll';
import { ComposerSkeleton } from './index';
import { useSnackbar } from 'notistack';
import { useThemeProps } from '@mui/system';
import { extractHashtags } from '../../utils/editor';
import TypeSwitchButtonGroup from './TypeSwitchButtonGroup';
import ContentPost from './Content/ContentPost';
import CategoryLayer from './Layer/CategoryLayer';
import { ComposerContentType, ComposerLayerType } from '../../types/composer';
import LocationLayer from './Layer/LocationLayer';
import ContentDiscussion from './Content/ContentDiscussion';

const DialogTransition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props}></Fade>;
});

const PREFIX = 'UnstableSCComposer';

const classes = {
  root: `${PREFIX}-root`,
  ios: `${PREFIX}-ios`,
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
  badgeError: `${PREFIX}-badgeError`,
  layerTransitionRoot: `${PREFIX}-layer-transition-root`
};

const Root = styled(Dialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

const LayerTransitionRoot = styled(Slide, {
  name: PREFIX,
  slot: 'LayerTransitionRoot',
  overridesResolver: (props, styles) => styles.layerTransitionRoot
})(({theme}) => ({

}));

export interface ComposerProps extends Omit<DialogProps, 'defaultValue' | 'scroll'> {
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
   * Media objects available
   * @default File, Document, Link
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
}

export const MAIN_VIEW = 'main';
export const POLL_VIEW = 'poll';

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
  html: '',
  htmlError: null,
  categories: [],
  categoriesError: null,
  addressing: null,
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
    mediaObjectTypes = [Image, Document, Link, Share],
    EditorProps = null,
    onClose = null,
    onSuccess = null,
    maxWidth,
    ...rest
  } = props;

  // Context
  const scPrefernces: SCPreferencesContextType = useSCPreferences();
  const scUserContext: SCUserContextType = useSCUser();
  const {enqueueSnackbar} = useSnackbar();

  // HOOKS
  const theme: Theme = useTheme<SCThemeType>();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'), {noSsr: typeof window !== 'undefined'});

  // State variables
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [layer, setLayer] = useState<ComposerLayerType | null>();
  const [mediaChunks, setMediaChunks] = useState<SCMediaChunkType[]>([]);
  const [editorFocused, setEditorFocused] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, {...COMPOSER_INITIAL_STATE, ...defaultValue, key: random()});
  const {id, type, title, titleError, html, categories, addressing, audience, medias, poll, pollError, location, error} = state;
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
    if (feedObject.author.id === scUserContext.user.id) {
      dispatch({
        type: 'multiple',
        value: {
          id: _feedObject.id,
          type: _feedObject.type,
          title: _feedObject.title,
          html: _feedObject.html,
          categories: _feedObject.categories,
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
  const dialogRef = useRef<any>();
  const unloadRef = useRef<boolean>(false);

  // Create a ref for medias becaouse of state update error on chunk upload
  const mediasRef = useRef({medias, mediaChunks, addMedia, setMediaChunks});
  mediasRef.current = {medias, mediaChunks, addMedia, setMediaChunks};

  // MEMO
  const hasPoll = useMemo(() => {
    return poll && poll.title.length > 0 && poll.title.length < COMPOSER_TITLE_MAX_LENGTH && poll.choices.length >= COMPOSER_POLL_MIN_CHOICES;
  }, [poll]);
  const canSubmit = useMemo(() => {
    return (
      (type === COMPOSER_TYPE_DISCUSSION && title.length > 0 && title.length < COMPOSER_TITLE_MAX_LENGTH) ||
      (type === COMPOSER_TYPE_POST && (stripHtml(html).length > 0 || medias.length > 0 || hasPoll))
    );
  }, [type, title, html, medias, hasPoll]);

  /*
   * Compute preferences
   */
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPrefernces.preferences ? scPrefernces.preferences[p].value : null));
    return _preferences;
  }, [scPrefernces.preferences]);

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

  // Prevent unload
  useEffect(() => {
    if (!unloadRef.current && canSubmit) {
      unloadRef.current = true;
      const onUnload = (event) => {
        event.preventDefault();
        return '';
      };
      window.onbeforeunload = onUnload;
    } else if (unloadRef.current && !canSubmit) {
      unloadRef.current = false;
      window.onbeforeunload = null;
    }
  }, [state, canSubmit]);

  /* Handlers */

  const handleAddLayer = useCallback((layer: ComposerLayerType) => setLayer(layer), []);
  const handleRemoveLayer = useCallback(() => setLayer(null), []);

  const handleChangeType = useCallback((value: string) => {
    dispatch({type: 'type', value});
  }, []);

  const handleChangePoll = useCallback((content: ComposerContentType): void => {
    dispatch({
      type: 'multiple',
      value: {
        ...content,
        pollError:
          content.poll.title.length > COMPOSER_TITLE_MAX_LENGTH
            ? {titleError: <FormattedMessage id="ui.unstable_composer.title.error.maxlength" defaultMessage="ui.unstable_composer.title.error.maxlength" />}
            : null
      }
    });
  }, []);

  const handleChangeDiscussion = useCallback((content: ComposerContentType): void => {
    dispatch({
      type: 'multiple',
      value: {
        ...content,
        titleError:
          content.title.length > COMPOSER_TITLE_MAX_LENGTH ? (
            <FormattedMessage id="ui.unstable_composer.title.error.maxlength" defaultMessage="ui.unstable_composer.title.error.maxlength" />
          ) : null
      }
    });
  }, []);

  const handleChangePost = useCallback((content: ComposerContentType): void => {
    dispatch({
      type: 'multiple',
      value: {
        ...content
      }
    });
  }, []);

  const handleChangeCategories = useCallback((value: SCCategoryType[]) => {
    dispatch({ type: 'categories', value });
    setLayer(null);
  }, []);

  const handleAddCategoryLayer = useCallback(() => handleAddLayer({
    name: 'category',
    Component: CategoryLayer,
    ComponentProps: {
      onClose: handleRemoveLayer,
      onSave: handleChangeCategories,
      defaultValue: categories
    }
  }), [handleAddLayer, handleRemoveLayer, handleChangeCategories, categories]);

  const handleChangeAudience = useCallback((value: SCTagType[] | null) => {
    dispatch({ type: 'addressing', value });
    setLayer(null);
  }, []);

  const handleAddAudienceLayer = useCallback(() => handleAddLayer({
    name: 'audience',
    Component: AudienceLayer,
    ComponentProps: {
      onClose: handleRemoveLayer,
      onSave: handleChangeAudience,
      defaultValue: addressing
    }
  }), [handleAddLayer, handleRemoveLayer, handleChangeAudience, addressing]);

  const handleChangeLocation = useCallback((value: SCContributionLocation | null) => {
    dispatch({ type: 'location', value });
    setLayer(null);
  }, []);

  const handleAddLocationLayer = useCallback(() => handleAddLayer({
    name: 'location',
    Component: LocationLayer,
    ComponentProps: {
      onClose: handleRemoveLayer,
      onSave: handleChangeLocation,
      defaultValue: location
    }
  }), [handleRemoveLayer, handleChangeLocation, location]);

  const handleSubmit = useCallback((event: SyntheticEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    if (UserUtils.isBlocked(scUserContext.user)) {
      // deny submit action if authenticated user is blocked
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning',
        autoHideDuration: 3000
      });
      return;
    }
    // Extract hashtags and add to categories
    const _categories: string[] = [...categories.map((c: SCCategoryType) => c.id), ...extractHashtags(html)];
    const data: any = {
      title,
      html,
      medias: medias.map((m) => m.id),
      categories: _categories.filter((item, index) => _categories.indexOf(item) === index)
    };
    if (preferences[SCPreferences.ADDONS_POLLS_ENABLED] && hasPoll) {
      data.poll = poll;
    }
    if (preferences[SCPreferences.ADDONS_POST_GEOLOCATION_ENABLED] && location) {
      data.location = location;
    }
    if (scPrefernces.features.includes(SCFeatureName.TAGGING) && addressing !== null) {
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
  }, [scUserContext.user, type, title, html, categories, addressing, audience, medias, poll, location, hasPoll]);

  // DEPRECATED

  const handleClose = (event: SyntheticEvent): void => {
    if (unloadRef.current) {
      window.onbeforeunload = null;
    }
    onClose && onClose(event);
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

  const isIOS = useMemo(() => iOS(), []);

  // RENDER

  const hasMediaShare = useMemo(() => medias.findIndex((m) => m.type === MEDIA_TYPE_SHARE) !== -1, [medias]);
  const content = useMemo(() => {
    if (editMode && isLoading) {
      return <ComposerSkeleton />;
    } else if (editMode && loadError) {
      return (
        <Alert severity="error" onClose={handleClose}>
          <AlertTitle>
            <FormattedMessage id="ui.unstable_composer.edit.error.title" defaultMessage="ui.unstable_composer.edit.error.title" />
          </AlertTitle>
          <FormattedMessage id="ui.unstable_composer.edit.error.content" defaultMessage="ui.unstable_composer.edit.error.content" />
        </Alert>
      );
    }
    switch (type) {
      case COMPOSER_TYPE_POLL:
        return <ContentPoll onChange={handleChangePoll} value={{html, categories, addressing, medias, poll, location}} error={pollError} />;
      case COMPOSER_TYPE_DISCUSSION:
        return <ContentDiscussion
          value={{title, html, categories, addressing, medias, poll, location}}
          error={{titleError, error}}
          onChange={handleChangeDiscussion}
          disabled={isSubmitting}
          EditorProps={{
            toolbar: true,
            uploadImage: true,
            onFocus: () => setEditorFocused(true)
          }}
        />;
      default:
        return <ContentPost
          value={{html, categories, addressing, medias, poll, location}}
          error={{error}}
          onChange={handleChangePost}
          disabled={isSubmitting}
          EditorProps={{
            toolbar: false,
            uploadImage: false,
            onFocus: () => setEditorFocused(true)
          }}
        />;
    }
  }, [type, title, html, categories, addressing, medias, poll, pollError, location, error, handleChangePoll, handleChangePost, isSubmitting]);
  const renderMediaAdornment = (mediaObjectType: SCMediaObjectType): JSX.Element => {
    return (
      <Box className={classes.mediasActions}>
        <Typography className={classes.mediasActionsTitle}>
          <FormattedMessage id={`ui.unstable_composer.media.${mediaObjectType.name}.edit`} defaultMessage={`ui.unstable_composer.media.${mediaObjectType.name}.edit`} />
        </Typography>
        <Typography className={classes.mediasActionsActions}>
          <Tooltip title={<FormattedMessage id="ui.unstable_composer.edit" defaultMessage="ui.unstable_composer.edit" />}>
            <IconButton color="inherit">
              <Icon>edit</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title={<FormattedMessage id="ui.unstable_composer.delete" defaultMessage="ui.unstable_composer.delete" />}>
            <IconButton onClick={handleDeleteMedia(null, mediaObjectType)} color="inherit">
              <Icon>delete</Icon>
            </IconButton>
          </Tooltip>
        </Typography>
      </Box>
    );
  };

  const renderMediaView = (mediaObjectType: SCMediaObjectType) => {
    return () => {
      return (
        <React.Fragment>
          <DialogTitle className={classes.title}>
            <Typography component="div">
              <span>
                <IconButton disabled={mediasRef.current.mediaChunks.length > 0}>
                  <Icon>arrow_back</Icon>
                </IconButton>
              </span>
            </Typography>
            <Box>
              <FormattedMessage
                id={`ui.unstable_composer.media.${mediaObjectType.name}.edit`}
                defaultMessage={`ui.unstable_composer.media.${mediaObjectType.name}.edit`}
              />
            </Box>
            <Box>
              <Tooltip title={<FormattedMessage id="ui.unstable_composer.done" defaultMessage="ui.unstable_composer.done" />}>
                <span>
                  <IconButton color="inherit" disabled={mediasRef.current.mediaChunks.length > 0}>
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

  if (!scUserContext.user && !(scUserContext.loading && open)) {
    return null;
  }

  return (
    <Root
      ref={dialogRef}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={handleClose}
      {...rest}
      className={classNames(classes.root, {[classes.ios]: isIOS})}
      scroll={fullScreen ? 'paper' : 'body'}
      fullScreen={fullScreen}>
      <form onSubmit={handleSubmit} method="post">
        <DialogTitle className={classes.title}>
          <IconButton onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
          <LoadingButton size="small" type="submit" color="secondary" variant="contained" disabled={!canSubmit} loading={isSubmitting}>
            <FormattedMessage id="ui.unstable_composer.submit" defaultMessage="ui.unstable_composer.submit" />
          </LoadingButton>
        </DialogTitle>
        <DialogContent className={classes.content}>
          {content}
        </DialogContent>
        {!canSubmit && <TypeSwitchButtonGroup className={classes.types} onChange={handleChangeType} size="small" value={type} />}
        <DialogActions className={classes.actions}>
          {mediaObjectTypes
            .filter((mediaObjectType: SCMediaObjectType) => mediaObjectType.editButton !== null)
            .map((mediaObjectType: SCMediaObjectType) => (
              <mediaObjectType.editButton
                key={mediaObjectType.name}
                disabled={isSubmitting || hasMediaShare}
                color={medias.filter(mediaObjectType.filter).length > 0 ? 'primary' : 'default'}
              />
            ))}
          <IconButton
            disabled={isSubmitting}
            onClick={handleAddCategoryLayer}>
            <Icon>category</Icon>
          </IconButton>
          <IconButton disabled={isSubmitting || !scPrefernces.features.includes(SCFeatureName.TAGGING)} onClick={handleAddAudienceLayer}>
            {addressing === null ? <Icon>public</Icon> : <Icon>label</Icon>}
          </IconButton>
          {preferences[SCPreferences.ADDONS_POST_GEOLOCATION_ENABLED] && (
            <IconButton disabled={isSubmitting} onClick={handleAddLocationLayer} color={location !== null ? 'primary' : 'default'}>
              <Icon>add_location_alt</Icon>
            </IconButton>
          )}
        </DialogActions>
      </form>
      {layer && <LayerTransitionRoot className={classes.layerTransitionRoot} in container={dialogRef.current} direction="left">
        <layer.Component {...layer.ComponentProps} />
      </LayerTransitionRoot>}
    </Root>
  );
}
