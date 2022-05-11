/**
 * Axios client wrapper
 */
import http, {HttpResponse, HttpMethod} from './client';

/**
 * Endpoint component
 */
import Endpoints, {EndpointType} from './constants/Endpoints';

/**
 * Utils
 */
import {formatHttpError} from './utils/http';

/**
 * Services
 */
import PreferenceService, {PreferenceApiClient, PreferenceApiClientInterface} from './services/preference';
import UserService, {UserApiClient, UserApiClientInterface} from './services/user';
import FeatureService, {FeatureApiClient, FeatureApiClientInterface} from './services/feature';
import CategoryService, {CategoryApiClient, CategoryApiClientInterface} from './services/category';

/**
 * Export all
 */
export {
  http,
  HttpResponse,
  HttpMethod,
  formatHttpError,
  Endpoints,
  EndpointType,
  PreferenceService,
  PreferenceApiClient,
  PreferenceApiClientInterface,
  UserService,
  UserApiClient,
  UserApiClientInterface,
  FeatureService,
  FeatureApiClient,
  FeatureApiClientInterface,
  CategoryService,
  CategoryApiClient,
  CategoryApiClientInterface
};
