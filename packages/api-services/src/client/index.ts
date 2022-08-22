import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';

/**
 * List of all Http methods
 */
export type HttpMethod =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK';

/**
 * AxiosResponseHeaders interface
 */
export type AxiosResponseHeaders = Record<string, string> & {
  'set-cookie'?: string[];
};

/**
 * General HttpResponse
 */
export interface HttpResponse<T = unknown, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders;
  config: AxiosRequestConfig<D>;
  request?: any;
}

/**
 * Interface for the ApiClient
 */
export interface ApiClientInterface {
  request<TRequest, TResponse>(config?: any): Promise<HttpResponse<TResponse>>;
  post<TRequest, TResponse>(path: string, object: TRequest, config?: any): Promise<HttpResponse<TResponse>>;
  patch<TRequest, TResponse>(path: string, object: TRequest): Promise<HttpResponse<TResponse>>;
  put<TRequest, TResponse>(path: string, object: TRequest): Promise<HttpResponse<TResponse>>;
  get<TResponse>(path: string): Promise<HttpResponse<TResponse>>;
}

/**
 * Create an abstraction wrapping of axios
 * Create a sort of interface between axios and the rest of application
 * This makes it easy for instance, to swap axios out for another package,
 * should we choose to do so in the future, without it breaking our app.
 */
export class ApiClient implements ApiClientInterface {
  static DEFAULT_TIMEOUT = 10 * 1000;
  protected readonly client: AxiosInstance;

  protected createClient(config?: any): AxiosInstance {
    return axios.create({
      ...(config && config.baseURL && {baseURL: config.baseURL}),
      responseType: 'json' as const,
      headers: {
        ...(config && config.accessToken && {Authorization: `Token ${config.accessToken}`})
      },
      timeout: ApiClient.DEFAULT_TIMEOUT
    });
  }

  constructor(config?: any) {
    this.client = this.createClient(config);
    this.setDefaultHeader({name: 'Content-Type', value: 'application/x-www-form-urlencoded', methods: ['post']});
  }

  /**
   * Get client instance
   */
  public getClientInstance() {
    return this.client;
  }

  /**
   * Change configuration
   * @param config
   */
  public config(config: any) {
    this.client(config);
  }

  /**
   * Set default header
   * @param name
   * @param value
   * @param methods
   */
  public setDefaultHeader = ({name, value, methods}: {name: string; value: string; methods?: string[]}) => {
    const headers = this.client.defaults.headers;
    if (Array.isArray(methods)) {
      methods.forEach((method) => {
        if (headers[method]) {
          headers[method][name] = value;
        }
      });
    } else {
      headers.common[name] = value;
    }
  };

  /**
   * Delete default header
   * @param name
   * @param methods
   */
  public deleteDefaultHeader = ({name, methods}: {name: string; methods?: string[]}) => {
    const headers = this.client.defaults.headers;
    if (Array.isArray(methods)) {
      methods.forEach((method) => {
        if (headers[method]) {
          delete headers[method][name];
        }
      });
    } else {
      delete headers.common[name];
    }
  };

  /**
   * setSupportWithCredentials
   * Disable/enable withCredentials
   * Bypass cookie if disabled
   * @param enable
   */
  public setSupportWithCredentials(enable: boolean): void {
    this.client.defaults.withCredentials = enable;
  }

  /**
   * setBasePortal
   * Set base path of all http requests
   * @param portal
   */
  public setBasePortal(baseUrl: string): void {
    this.client.defaults.baseURL = baseUrl;
  }

  /**
   * setAuthorizeToken
   * Set authorization header for all http requests
   * @param token
   */
  public setAuthorizeToken(token?: string): void {
    if (token) {
      this.setDefaultHeader({name: 'Authorization', value: `Bearer ${token}`});
    } else {
      this.deleteDefaultHeader({name: 'Authorization'});
    }
  }

  /**
   * request wrapper
   * @param config
   */
  request<TRequest, TResponse>(config: any): Promise<HttpResponse<TResponse>> {
    return this.client.request<TResponse>(config);
  }

  /**
   * get wrapper
   * @param path
   * @param config
   */
  get<TResponse>(path: string, config?: any): Promise<HttpResponse<TResponse>> {
    return this.client.get<TResponse>(path, config);
  }

  /**
   * post wrapper
   * @param path
   * @param payload
   * @param config
   */
  post<TRequest, TResponse>(path: string, payload: TRequest, config?: any): Promise<HttpResponse<TResponse>> {
    return config ? this.client.post<TResponse>(path, payload, config) : this.client.post<TResponse>(path, payload);
  }

  /**
   * patch wrapper
   * @param path
   * @param object
   */
  patch<TRequest, TResponse>(path: string, payload: TRequest): Promise<HttpResponse<TResponse>> {
    return this.client.patch<TResponse>(path, payload);
  }

  /**
   * put wrapper
   * @param path
   * @param payload
   */
  put<TRequest, TResponse>(path: string, payload: TRequest): Promise<HttpResponse<TResponse>> {
    return this.client.put<TResponse>(path, payload);
  }
}

const client = new ApiClient();
export default client;
