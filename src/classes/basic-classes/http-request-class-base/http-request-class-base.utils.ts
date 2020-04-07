import { CONST_API_CONF_CURRENT_PROTOCOL_USED } from 'const/const-api-conf';
import { HTTP_REQUEST_URL_PROTOCOL_DELIIMETR_REGEXP } from './http-request-class-base.const';

export interface IParamsObject {
  [paramName: string]: string | number | object;
}
/**
 * transforms object to a stirng url encoded
 * where a param names will be the object's
 * keys and it's values will be the object's
 * values
 * @param obj
 * @param {string} obj[name]
 */
export const objectToUrlEncodedString = (obj: IParamsObject): string => {
  return Object.keys(obj).reduce((querystring, paramName) => {
    const paramValue = obj[paramName] || '';
    const paramValueType = typeof paramValue;
    let paramValueCasted;

    if (paramValueType === 'object') {
      paramValueCasted = JSON.stringify(paramValue);
    } else {
      paramValueCasted = String(paramValue);
    }
    return `${querystring}${querystring.length ? '&' : ''}${encodeURIComponent(
      paramName
    )}=${encodeURIComponent(paramValueCasted)}`;
  }, '');
};

export interface IParamsObjectFormData {
  [paramName: string]: string | File | Blob | object;
}

export const objectToFormData = (obj: IParamsObjectFormData): FormData => {
  let paramValueCasted;
  let thirdParam;

  return Object.keys(obj).reduce((formData: FormData, paramName) => {
    const paramValue = obj[paramName] || '';
    const paramValueType = typeof paramValue;

    paramValueCasted = undefined;
    thirdParam = undefined;
    if (paramValue instanceof File) {
      paramValueCasted = paramValue;
      thirdParam = paramValueCasted.name;
    } else if (paramValue instanceof Blob) {
      paramValueCasted = paramValue;
      thirdParam = 'file';
    } else if (paramValueType === 'object') {
      paramValueCasted = JSON.stringify(paramValue);
    } else if (paramValueType === 'string' || paramValueType === 'number') {
      paramValueCasted = String(paramValue);
    }
    if (paramValueCasted) {
      formData.append(paramName, paramValueCasted, paramValueType);
    } else {
      console.error(
        `Can't append the ${paramName} field as the form data value`
      );
    }
    return formData;
  }, new FormData());
};

export const prefixUrlWithHTTPProtocol = (urlString: string): string => {
  const urlTrimmed = urlString.trim().toLowerCase();

  if (urlTrimmed.startsWith('data:')) {
    return urlTrimmed;
  }
  return urlTrimmed.startsWith('http://') || urlTrimmed.startsWith('https://')
    ? urlTrimmed
    : `${CONST_API_CONF_CURRENT_PROTOCOL_USED}//${urlTrimmed.replace(
        HTTP_REQUEST_URL_PROTOCOL_DELIIMETR_REGEXP,
        ''
      )}`;
};
