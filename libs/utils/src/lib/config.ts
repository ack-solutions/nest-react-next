export const config = {
  apiUrl: process.env['NX_REACT_APP_API_URL'] || 'http://localhost:3333',
  frontUrl: process.env['NX_REACT_APP_FRONT_URL'],
  adminUrl: process.env['NX_REACT_APP_ADMIN_URL'],

}

console.log(config, 'config')