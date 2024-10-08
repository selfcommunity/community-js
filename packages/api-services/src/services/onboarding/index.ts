import Endpoints from '../../constants/Endpoints';
import {apiRequest} from '../../utils/apiRequest';
import {AxiosRequestConfig} from 'axios';
import {BaseSearchParams, OnBoardingStep, SCPaginatedResponse} from '../../types';
import {SCStepType} from '@selfcommunity/types';
import {StartStepParams} from '../../types/onBoarding';

export interface OnBoardingApiClientInterface {
  getAllSteps(params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCStepType>>;
  getAStep(step: OnBoardingStep, config?: AxiosRequestConfig): Promise<any>;
  startAStep(step: OnBoardingStep, params?: StartStepParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCStepType>>;
  completeAStep(step: OnBoardingStep, config?: AxiosRequestConfig): Promise<any>;
}

/**
 * Contains all the endpoints needed to manage OnBoarding content.
 */
export class OnBoardingApiClient {
  /**
   * This endpoint retrieves all onboarding steps.
   * @param params
   * @param config
   */
  static getAllSteps(params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCStepType>> {
    return apiRequest({...config, params, url: Endpoints.GetAllSteps.url({}), method: Endpoints.GetAllSteps.method});
  }
  /**
   * This endpoint retrieves a specific step identified by the step id.
   * @param step
   * @param config
   */
  static getAStep(step: OnBoardingStep, config?: AxiosRequestConfig): Promise<SCStepType> {
    return apiRequest({...config, url: Endpoints.GetAStep.url({step}), method: Endpoints.GetAStep.method});
  }
  /**
   * This endpoint performs step content generation.
   * @param step
   * @param params
   * @param config
   */
  static startAStep(step: OnBoardingStep, params?: StartStepParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCStepType>> {
    return apiRequest({...config, params, url: Endpoints.StartAStep.url({step}), method: Endpoints.StartAStep.method});
  }
  /**
   * This endpoint marks a step complete.
   * @param step
   * @param config
   */
  static completeAStep(step: OnBoardingStep, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.CompleteAStep.url({step}), method: Endpoints.CompleteAStep.method});
  }
}

/**
 *
 :::tip  OnBoarding service can be used in the following way:
 ```jsx
 1. Import the service from our library:

 import {OnBoardingService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAStep` will return the paginated list of categories.

 async getAStep() {
   return await OnBoardingService.getAStep();
 }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async create(data) {
  return await OnBoardingService.getAStep(step);
 }
 ```
 ```jsx
 If you need to customize the request, you can add optional config params (`AxiosRequestConfig` type).

 1. Declare it(or declare them, it is possible to add multiple params)

 const headers = headers: {Authorization: `Bearer ${yourToken}`}

 2. Add it inside the brackets and pass it to the function, as shown in the previous example!
 ```
 :::
 */
export default class OnBoardingService {
  static async getAllSteps(params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCStepType>> {
    return OnBoardingApiClient.getAllSteps(params, config);
  }

  static async getAStep(step: OnBoardingStep, config?: AxiosRequestConfig): Promise<SCStepType> {
    return OnBoardingApiClient.getAStep(step, config);
  }

  static async startAStep(step: OnBoardingStep, params?: StartStepParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCStepType>> {
    return OnBoardingApiClient.startAStep(step, params, config);
  }

  static async completeAStep(step: OnBoardingStep, config?: AxiosRequestConfig): Promise<any> {
    return OnBoardingApiClient.completeAStep(step, config);
  }
}
