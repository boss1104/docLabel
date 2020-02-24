import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';
import { FieldData } from 'rc-field-form/lib/interface';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string) => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
};

/**
 * Used for official demo sites to turn off features that are not needed in real-world
 * development environments
 */

export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = (href?: string) => {
  let url = href;
  if (!url) {
    url = window.location.href;
  }
  return parse(url.split('?')[1]);
};

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const arrayToObject = <T>(array: T[], keyField: string) =>
  array.reduce((obj, item) => {
    const newObj = { ...obj };
    newObj[item[keyField]] = item;
    return newObj;
  }, {});

export const getFieldsFromErrorData: (
  err: {
    data: Record<string, Array<string>>;
  },
  values: {
    [name: string]: any;
  },
) => FieldData[] = ({ data }, values) => {
  const valueWithError: FieldData[] = [];
  Object.entries(data).forEach(([key, val]) => {
    valueWithError.push({
      name: key,
      value: values[key],
      errors: val,
    });
  });
  return valueWithError;
};
