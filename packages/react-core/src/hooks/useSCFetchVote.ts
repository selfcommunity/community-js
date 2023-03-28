import {useEffect, useMemo, useState} from 'react';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {
  SCCommentType,
  SCContributionType,
  SCFeedDiscussionType,
  SCFeedObjectType,
  SCFeedPostType,
  SCFeedStatusType,
  SCReactionType,
  SCTagType,
} from '@selfcommunity/types';
import {getCommentObjectCacheKey, getFeedObjectCacheKey} from '../constants/Cache';
import {useSnackbar} from 'notistack';
import useSCFetchReactions from './useSCFetchReactions';
import {useIntl} from 'react-intl';
import {SCContextType, SCUserContextType} from '../types/context';
import {useSCContext} from '../components/provider/SCContextProvider';
import {useSCUser} from '../components/provider/SCUserProvider';
import {UserUtils} from '../index';

interface FetchVoteProps {
  /**
   * Id of the contribution object to vote
   * @default null
   */
  id: number;
  /**
   * Type of the contribution object to vote
   * @default null
   */
  contributionType: SCContributionType;
  /**
   * Contribution object to vote
   * @default null
   */
  contribution?: SCFeedObjectType | SCCommentType | null;

  /**
   * onVote callback
   * @default null
   */
  onVote?: (contribution: SCFeedObjectType | SCCommentType) => any;
  /**
   * Cache strategy
   * @default CACHE_FIRST
   * */
  cacheStrategy?: CacheStrategies;
}

/**
 :::info
 This custom hook is used to fetch a contribution vote.
 :::
 */
export default function useSCFetchVote({
  id,
  contribution = null,
  contributionType,
  onVote = null,
  cacheStrategy = CacheStrategies.CACHE_FIRST,
}: FetchVoteProps) {
  // MEMO
  const __contributionCacheKey = useMemo(
    () => (contributionType === SCContributionType.COMMENT ? getCommentObjectCacheKey(id) : getFeedObjectCacheKey(id, contributionType)),
    [id, contributionType]
  );
  const __endpoint = useMemo(
    () => (contributionType === SCContributionType.COMMENT ? Endpoints.Comment : Endpoints.FeedObject),
    [id, contributionType]
  );

  // STATE
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [obj, setObj] = useState<SCFeedDiscussionType | SCFeedPostType | SCFeedStatusType | SCCommentType>(
    cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(__contributionCacheKey, contribution) : contribution
  );
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);

  // HOOKS
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const {enqueueSnackbar} = useSnackbar();
  const reactions = useSCFetchReactions();
  const intl = useIntl();

  /**
   * Memoized fetchObject
   */
  const fetchObject = useMemo(
    () => () => {
      setIsLoading(true);
      return http
        .request({
          url: __endpoint.url({type: contributionType, id: id}),
          method: __endpoint.method,
        })
        .then((res: HttpResponse<any>) => {
          setIsLoading(false);
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [id, contributionType]
  );

  const performVote = useMemo(
    () => (reaction?: SCReactionType) => {
      const params = {};
      if (reaction && reactions.reactions) {
        params['reaction'] = reaction.id;
      }
      return http
        .request({
          url: Endpoints.Vote.url({type: obj.type, id: obj.id}),
          method: Endpoints.Vote.method,
          params,
        })
        .then((res: HttpResponse<SCTagType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj, scContext]
  );

  // EFFECTS

  useEffect(() => {
    if (cacheStrategy !== CacheStrategies.CACHE_FIRST || !obj || (scUserContext.user && !Object.prototype.hasOwnProperty.call(obj, 'voted'))) {
      fetchObject()
        .then((obj) => {
          setObj(obj);
          LRUCache.set(__contributionCacheKey, obj);
        })
        .catch((err) => {
          LRUCache.delete(__contributionCacheKey);
          setError(`FeedObject with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `FeedObject with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [id, contributionType, scUserContext.user]);

  // HANDLERS
  const handleVote = (reaction?: SCReactionType) => {
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
      return;
    }
    if (UserUtils.isBlocked(scUserContext.user)) {
      enqueueSnackbar(intl.formatMessage({id: 'ui.common.userBlocked', defaultMessage: 'ui.common.userBlocked'}), {
        variant: 'warning',
        autoHideDuration: 3000,
      });
    } else {
      if (obj && !isVoting) {
        setIsVoting(true);
        performVote(reaction)
          .then(() => {
            let _obj: any = {
              voted: !obj.voted,
              vote_count: obj.voted ? obj.vote_count - 1 : obj.vote_count + 1,
            };
            if (reaction && obj?.reaction?.id !== reaction.id) {
              // AGGUINTA / MODIFICA
              const add = !obj?.reaction;
              const addCount = obj.reactions_count.findIndex((count: any) => count.reaction.id === reaction.id) === -1;
              _obj = {
                voted: add ? true : obj.voted,
                vote_count: add ? obj.vote_count + 1 : obj.vote_count,
                reaction,
                reactions_count: [
                  ...obj.reactions_count.map((count: any) => {
                    if (count.reaction.id === obj?.reaction?.id && count.count - 1 === 0) {
                      return null;
                    } else if (count.reaction.id === obj?.reaction?.id && count.count - 1 > 0) {
                      return {count: count.count - 1, reaction: count.reaction};
                    } else if (count.reaction.id === reaction.id) {
                      return {count: count.count + 1, reaction: count.reaction};
                    }
                  }),
                  addCount ? {count: 1, reaction} : null,
                ].filter((count) => count !== null),
              };
            } else if (reaction && obj?.reaction && obj?.reaction?.id === reaction.id) {
              // RIMOZIONE
              _obj = Object.assign({}, _obj, {
                reaction: null,
                reactions_count: obj.reactions_count
                  .map((count: any) => {
                    if (count.reaction.id === obj?.reaction?.id && count.count - 1 === 0) {
                      return null;
                    } else if (count.reaction.id === obj?.reaction?.id && count.count - 1 > 0) {
                      return {count: count.count - 1, reaction: count.reaction};
                    }
                  })
                  .filter((count) => count !== null),
              });
            }
            const newObj = Object.assign({}, obj, _obj);
            setObj(newObj);
            onVote && onVote(newObj);
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_CORE, error);
          })
          .then(() => setIsVoting(false));
      }
    }
  };

  const data = useMemo(
    () => ({
      contributionVoted: obj ? obj.voted : false,
      contributionReaction: obj ? obj.reaction : null,
      contributionReactionsCount: obj ? obj.reactions_count : null,
    }),
    [obj]
  );

  return {...data, isLoading, isVoting, handleVote, reactions, error};
}
