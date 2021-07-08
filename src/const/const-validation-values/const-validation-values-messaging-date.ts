import { CONST_VALUES_RESTRICTIONS_COMMON_CURRENT_DATE_MAX_ERROR_SECONDS } from 'const/const-values-restrictions-common';
import { getSecondsByMilliseconds } from 'classes/pseudo-ntp-class/pseudo-ntp-class.utils';

export const CONST_VALIDATION_VALUES_MESSAGING_MAX_ERROR_SECONDS =
  CONST_VALUES_RESTRICTIONS_COMMON_CURRENT_DATE_MAX_ERROR_SECONDS;

export const CONST_VALIDATION_VALUES_MESSAGING_DATE_MIN_YEAR = '2019';

export const CONST_VALIDATION_VALUES_MESSAGING_DATE_MIN_YEAR_MONTH = '01';

export const CONST_VALIDATION_VALUES_MESSAGING_DATE_MIN_YEAR_MONTH_DAY = '01';

export const CONST_VALIDATION_VALUES_MESSAGING_DATE_MIN_STRING_IN_UTC = `${CONST_VALIDATION_VALUES_MESSAGING_DATE_MIN_YEAR}-${CONST_VALIDATION_VALUES_MESSAGING_DATE_MIN_YEAR_MONTH}-${CONST_VALIDATION_VALUES_MESSAGING_DATE_MIN_YEAR_MONTH_DAY}T00:00:00.00Z`;

export const CONST_VALIDATION_VALUES_MESSAGING_DATE_MIN = new Date(CONST_VALIDATION_VALUES_MESSAGING_DATE_MIN_STRING_IN_UTC);

export const CONST_VALIDATION_VALUES_TIMESTAMP_UNIX_MIN_S = getSecondsByMilliseconds(
  Date.UTC(
    Number(CONST_VALIDATION_VALUES_MESSAGING_DATE_MIN_YEAR),
    Number(CONST_VALIDATION_VALUES_MESSAGING_DATE_MIN_YEAR_MONTH),
    Number(CONST_VALIDATION_VALUES_MESSAGING_DATE_MIN_YEAR_MONTH_DAY)
  )
);
