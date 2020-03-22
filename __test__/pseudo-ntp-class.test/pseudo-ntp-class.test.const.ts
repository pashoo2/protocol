import { IPseudoNTPClassServerConnection } from 'classes/pseudo-ntp-class/pseudo-ntp-class.types';

export const PSEUDO_NTP_CLASS_SERVER_1_DESC: IPseudoNTPClassServerConnection = {
  server: 'http://worldclockapi.com/api/json/utc/now',
  fieldName: 'currentDateTime',
};

export const PSEUDO_NTP_CLASS_SERVER_2_DESC: IPseudoNTPClassServerConnection = {
  server: 'http://worldtimeapi.org/api/ip',
  fieldName: 'utc_datetime',
};

export const PSEUDO_NTP_CLASS_SERVERS_POOL = [
  PSEUDO_NTP_CLASS_SERVER_1_DESC,
  PSEUDO_NTP_CLASS_SERVER_2_DESC,
];
