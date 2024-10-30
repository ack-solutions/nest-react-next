
import { PATH_DASHBOARD } from '../routes/paths';
export const HOST_API = process.env.REACT_APP_HOST_API_KEY || '';
export const MAPBOX_API = process.env.REACT_APP_MAPBOX_API;
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.root; // as '/dashboard/app'


export const HEADER = {
  H_MOBILE: 64,
  H_DESKTOP: 80,
  H_DESKTOP_OFFSET: 80 - 16
};

export const NAV = {
  W_VERTICAL: 280,
  W_MINI: 88
};
