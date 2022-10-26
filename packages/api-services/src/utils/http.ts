import {camelCase} from '@selfcommunity/utils';
import axios, { CancelTokenSource } from "axios";

export function defaultError(error: {request?: any; message?: any}): void {
  if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
}

const formatError = (error) => {
  const errors: any = {};
  if (Array.isArray(error)) {
    for (let i = 0; i < error.length; i++) {
      const err = error[i];
      if (err.field) {
        errors[`${camelCase(err.field)}Error`] = Array.isArray(err.messages) ? formatError(err.messages) : err.messages;
      } else {
        errors.error = err.message;
      }
    }
  } else {
    errors.error = error.errors;
  }
  return errors;
};

export function formatHttpError(error) {
  let errors: any = {};
  if (error.response && error.response.data && typeof error.response.data === 'object' && error.response.data.errors) {
    errors = {...formatError(error.response.data.errors)};
  } else {
    defaultError(error);
  }
  return errors;
}

export function getCancelTokenSourceRequest() {
  return axios.CancelToken.source();
}
