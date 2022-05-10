import axios, {AxiosInstance, AxiosResponse} from 'axios';

export interface ApiClientInterface {
  request<TRequest, TResponse>(config?: any): Promise<AxiosResponse<TResponse>>;
  post<TRequest, TResponse>(path: string, object: TRequest, config?: any): Promise<AxiosResponse<TResponse>>;
  patch<TRequest, TResponse>(path: string, object: TRequest): Promise<AxiosResponse<TResponse>>;
  put<TRequest, TResponse>(path: string, object: TRequest): Promise<AxiosResponse<TResponse>>;
  get<TResponse>(path: string): Promise<AxiosResponse<TResponse>>;
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
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(config && config.accessToken && {Authorization: `Token ${config.accessToken}`})
      },
      timeout: ApiClient.DEFAULT_TIMEOUT
    });
  }

  constructor(config?: any) {
    this.client = this.createClient(config);
  }

  /**
   * Get client instance
   */
  public getInstance() {
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
  public setAuthorizeToken(token: string): void {
    if (token) {
      this.setDefaultHeader({name: 'Authorization', value: `Bearer ${token}`});
    }
  }

  /**
   * request wrapper
   * @param config
   */
  request<TRequest, TResponse>(config: any): Promise<AxiosResponse<TResponse>> {
    return this.client.request<TResponse>(config);
  }

  /**
   * get wrapper
   * @param path
   */
  get<TResponse>(path: string): Promise<AxiosResponse<TResponse>> {
    return this.client.get<TResponse>(path);
  }

  /**
   * post wrapper
   * @param path
   * @param payload
   * @param config
   */
  post<TRequest, TResponse>(path: string, payload: TRequest, config?: any): Promise<AxiosResponse<TResponse>> {
    return config ? this.client.post<TResponse>(path, payload, config) : this.client.post<TResponse>(path, payload);
  }

  /**
   * patch wrapper
   * @param path
   * @param object
   */
  patch<TRequest, TResponse>(path: string, payload: TRequest): Promise<AxiosResponse<TResponse>> {
    return this.client.patch<TResponse>(path, payload);
  }

  /**
   * put wrapper
   * @param path
   * @param payload
   */
  put<TRequest, TResponse>(path: string, payload: TRequest): Promise<AxiosResponse<TResponse>> {
    return this.client.put<TResponse>(path, payload);
  }
}

const client = new ApiClient();
export default client;
