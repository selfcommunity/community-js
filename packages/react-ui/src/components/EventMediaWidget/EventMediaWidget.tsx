import { LoadingButton } from '@mui/lab';
import { Button, CardActions, CardContent, CardHeader, Divider, Icon, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box, useThemeProps } from '@mui/system';
import { Endpoints, EventService, http, SCPaginatedResponse } from '@selfcommunity/api-services';
import { SCCache, SCUserContextType, useSCFetchEvent, useSCUser } from '@selfcommunity/react-core';
import { SCEventType, SCMediaType } from '@selfcommunity/types';
import { CacheStrategies, Logger } from '@selfcommunity/utils';
import { AxiosResponse } from 'axios';
import { ChangeEvent, Fragment, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { SCOPE_SC_UI } from '../../constants/Errors';
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from '../../constants/Pagination';
import BaseDialog, { BaseDialogProps } from '../../shared/BaseDialog';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Lightbox from '../../shared/Media/File/Lightbox';
import { actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer } from '../../utils/widget';
import Widget, { WidgetProps } from '../Widget';
import { PREFIX } from './constants';
import SkeletonComponent from './Skeleton';
import TriggerButton from './TriggerButton';

const messages = defineMessages({
  title: {
    id: 'ui.eventMediaWidget.title',
    defaultMessage: 'ui.eventMediaWidget.title'
  }
});

const NUMBER_OF_MEDIAS = 9;

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  input: `${PREFIX}-input`,
  grid: `${PREFIX}-grid`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`,
  dialogRoot: `${PREFIX}-dialog-root`,
  infiniteScroll: `${PREFIX}-infinite-scroll`,
  mediaWrapper: `${PREFIX}-media-wrapper`,
  buttonWrapper: `${PREFIX}-button-wrapper`,
  loadingButton: `${PREFIX}-loading-button`,
  endMessage: `${PREFIX}-end-message`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root,
  shouldForwardProp: (prop) => prop !== 'showPadding'
})(() => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot',
  overridesResolver: (_props, styles) => styles.dialogRoot,
  shouldForwardProp: (prop) => prop !== 'loading'
})(() => ({}));

export interface EventMediaWidgetProps extends WidgetProps {
  /**
   * Event Object
   * @default null
   */
  event?: SCEventType;

  /**
   * Id of event object
   * @default null
   */
  eventId?: number;

  /**
   * Feed API Query Params
   * @default [{'limit': 20, 'offset': 0}]
   */
  endpointQueryParams?: Record<string, string | number>;

  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Props to spread to users suggestion dialog
   * @default {}
   */
  dialogProps?: BaseDialogProps;

  limit?: number;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function EventMediaWidget(inProps: EventMediaWidgetProps) {
  // PROPS
  const props: EventMediaWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  // CONST
  const {
    event,
    eventId,
    limit = DEFAULT_PAGINATION_LIMIT,
    endpointQueryParams = {
      limit,
      offset: DEFAULT_PAGINATION_OFFSET
    },
    cacheStrategy,
    dialogProps,
    ...rest
  } = props;

  // STATE
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.EVENT_MEDIA_STATE_CACHE_PREFIX_KEY),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [medias, setMedias] = useState<SCMediaType[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [mediaId, setMediaId] = useState<number | null>(null);
  const [preview, setPreview] = useState<number>(-1);

  // REFS
  const input = useRef<HTMLInputElement | null>(null);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const { scEvent } = useSCFetchEvent({ id: eventId, event });
  const intl = useIntl();

  // CONSTS
  const hasAllow = useMemo(() => scUserContext.user?.id === scEvent?.managed_by.id, [scUserContext, scEvent]);

  /**
   * Initialize component
   * Fetch data only if the component is not initialized and it is not loading data
   */
  const _initComponent = useCallback(() => {
    if (!state.initialized && !state.isLoadingNext) {
      dispatch({ type: actionWidgetTypes.LOADING_NEXT });
      EventService.getEventPhotoGallery(scEvent.id, { ...endpointQueryParams })
        .then((payload: SCPaginatedResponse<SCMediaType>) => {
          dispatch({ type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: { ...payload, initialized: true } });
          setMedias(payload.results);
        })
        .catch((error) => {
          dispatch({ type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: { errorLoadNext: error } });
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [state.isLoadingNext, state.initialized, scEvent]);

  const _fetchNext = useCallback(
    (index: number) => {
      if (state.count > medias.length && index >= 6 && !state.isLoadingNext && state.next) {
        setPreview(index);
        dispatch({ type: actionWidgetTypes.LOADING_NEXT });

        http
          .request({
            url: state.next,
            method: Endpoints.GetEventPhotoGallery.method
          })
          .then((res: AxiosResponse<SCPaginatedResponse<SCMediaType>>) => {
            dispatch({ type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data });
            setMedias((prev) => [...prev, ...res.data.results]);
          })
          .catch((error) => {
            dispatch({ type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: { errorLoadNext: error } });
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [state.next, state.isLoadingNext, medias.length]
  );

  const handleOpenLightbox = useCallback((index: number) => {
    setPreview(index);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setPreview(-1);
  }, []);

  const handleToggleDialogOpen = useCallback(() => {
    setOpenDialog((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    dispatch({ type: actionWidgetTypes.LOADING_NEXT });

    http
      .request({
        url: state.next,
        method: Endpoints.GetEventPhotoGallery.method
      })
      .then((res: AxiosResponse<SCPaginatedResponse<SCMediaType>>) => {
        dispatch({ type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data });
        setMedias((prev) => [...prev, ...res.data.results]);
      })
      .catch((error) => {
        dispatch({ type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: { errorLoadNext: error } });
        Logger.error(SCOPE_SC_UI, error);
      });
  }, [state.next, state.isLoadingNext, state.initialized]);

  const handleDelete = (id: number) => {
    setMediaId(id);

    http
      .request({
        url: Endpoints.RemoveMediasFromEventPhotoGallery.url({ id: scEvent.id }),
        method: Endpoints.RemoveMediasFromEventPhotoGallery.method,
        data: { medias: [id] }
      })
      .then(() => {
        setMedias((prev) => prev.filter((media) => media.id !== id));
        setMediaId(null);
      })
      .catch((error) => {
        dispatch({ type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: { errorLoadNext: error } });
        Logger.error(SCOPE_SC_UI, error);
      });
  };

  const handleAddMedia = useCallback(() => {
    input.current.click();
  }, [input]);

  const handleInputChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    // MediaService.chunkUploadMedia();
    console.log('*** evt ***', evt.target.files[0]);
  }, []);

  // EFFECTS
  useEffect(() => {
    let _t: NodeJS.Timeout;

    if (scUserContext.user && scEvent) {
      _t = setTimeout(_initComponent);

      return () => {
        clearTimeout(_t);
      };
    }
  }, [scUserContext.user, scEvent]);

  // RENDER
  if (!scEvent || (state.initialized && state.count === 0)) {
    return <HiddenPlaceholder />;
  }

  if (!state.initialized || (state.isLoadingNext && state.count === 0)) {
    return <SkeletonComponent />;
  }

  return (
    <Root className={classes.root} {...rest} showPadding={hasAllow}>
      <CardHeader
        title={
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">
              <FormattedMessage id="ui.eventMediaWidget.title" defaultMessage="ui.eventMediaWidget.title" />
            </Typography>

            {hasAllow && (
              <>
                <TriggerButton size="small" />
                {/* <input ref={input} className={classes.input} type="file" accept="image/*" onChange={handleInputChange} />
                <Button size="small" endIcon={<Icon fontSize="inherit">add</Icon>} onClick={handleAddMedia}>
                  <Typography variant="caption">
                    <FormattedMessage id="ui.eventMediaWidget.add" defaultMessage="ui.eventMediaWidget.add" />
                  </Typography>
                </Button> */}
              </>
            )}
          </Stack>
        }
        className={classes.header}
      />

      <Divider />

      <CardContent className={classes.content}>
        <Box className={classes.grid}>
          {medias.slice(0, NUMBER_OF_MEDIAS).map((media: SCMediaType, i: number, array: SCMediaType[]) => (
            <Box
              key={media.id}
              onClick={() => handleOpenLightbox(i)}
              sx={{
                background: `url(${media.image}) no-repeat center`
              }}>
              {medias.length > array.length && i === array.length - 1 && (
                <Fragment>
                  <Box />
                  <Box>
                    <Typography>+{state.count - NUMBER_OF_MEDIAS}</Typography>
                  </Box>
                </Fragment>
              )}
            </Box>
          ))}
        </Box>

        {preview !== -1 && <Lightbox onClose={handleCloseLightbox} index={preview} medias={medias} onIndexChange={_fetchNext} />}
      </CardContent>

      <CardActions className={classes.actions}>
        <Button onClick={handleToggleDialogOpen}>
          <Typography variant="caption">
            <FormattedMessage id="ui.eventMediaWidget.showAll" defaultMessage="ui.eventMediaWidget.showAll" />
          </Typography>
        </Button>
      </CardActions>

      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={intl.formatMessage(messages.title, { user: scEvent.managed_by.username })}
          onClose={handleToggleDialogOpen}
          open={openDialog}
          {...dialogProps}>
          <InfiniteScroll
            dataLength={medias.length}
            height="515px"
            next={handleNext}
            hasMoreNext={Boolean(state.next)}
            loaderNext={<>Skeleton</>}
            className={classes.infiniteScroll}
            endMessage={
              <Typography className={classes.endMessage}>
                <FormattedMessage id="ui.eventMediaWidget.noMoreResults" defaultMessage="ui.eventMediaWidget.noMoreResults" />
              </Typography>
            }>
            <Box className={classes.grid}>
              {medias.map((media: SCMediaType) => (
                <Box
                  key={media.id}
                  sx={{
                    background: `url(${media.image}) no-repeat center`
                  }}
                  className={classes.mediaWrapper}>
                  <Stack className={classes.buttonWrapper}>
                    <LoadingButton
                      className={classes.loadingButton}
                      loading={mediaId === media.id}
                      size="large"
                      onClick={() => handleDelete(media.id)}
                      sx={{
                        color: (theme) => (mediaId === media.id ? 'transparent' : theme.palette.common.white)
                      }}>
                      <Icon fontSize="inherit">delete</Icon>
                    </LoadingButton>
                  </Stack>
                </Box>
              ))}
            </Box>
          </InfiniteScroll>
        </DialogRoot>
      )}
    </Root>
  );
}
