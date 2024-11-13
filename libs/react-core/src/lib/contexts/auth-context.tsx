import React, { useState } from 'react';
import {
  createContext, useReducer, useEffect, useContext, useCallback,
} from 'react';
import axios from 'axios';
import { chain, map } from 'lodash';
import useAccess from './react-access-control/use-access';
import { instanceApi } from '@libs/utils';
import { UserService } from '../services/user.service';

interface IUser {
  name?:string
}

export interface AuthState {
  isAuthenticated: boolean,
  isInitialized: boolean,
  user: IUser | null,
  token?: string,
  login: (token: string, user?: IUser) => Promise<any>,
  logout: () => void,
  setUser: (user?: IUser) => void;
  addLogoutListener?: (value?: any) => void;
  addLoginListener?: (value?: any) => void;
  removeLoginListener?: (value?: any) => void;
  removeLogoutListener?: (value?: any) => void;
}

const initialState: Partial<AuthState> = Object.freeze({
  isAuthenticated: false,
  user: null,
  token: '',
  isInitialized: false,
});

const defaultValue: any = {
  login: () => Promise.resolve(),
  logout: () => { 
    //
  },
}

export const AuthContext = createContext<AuthState>(defaultValue);

const userService = UserService.getInstance<UserService>();

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'INITIALIZE': {
      return {
        ...state,
        ...action.payload,
        isInitialized: true
      };
    }
    case 'UPDATE': {
      return {
        ...state,
        ...action.payload,
      };
    }
    case 'SIGN_IN': {
      return {
        ...state,
        isAuthenticated: true,
        ...action.payload
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    }
    default:
      return initialState;
  }
};

const setSession = async (accessToken?: string | null): Promise<void> => {
  if (accessToken) {
    await localStorage.setItem('token', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    instanceApi.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    await localStorage.removeItem('token');
    delete axios.defaults.headers.common.Authorization;
    delete instanceApi.defaults.headers.common.Authorization;
  }
};



const AuthProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { define } = useAccess();
  const [loginListeners, setLoginListeners] = useState<any>([]);
  const [logoutListeners, setLogoutListeners] = useState<any>([]);

  const logout = useCallback(
    async () => {
      logoutListeners.forEach((listener:any) => listener());
      setSession(null);
      dispatch({ type: 'LOGOUT' });
    },
    [logoutListeners],
  );


  const initPermissions = useCallback(
    (user:any) => {
      const roles = map(user?.roles, 'name');
      const permissions = chain(user?.roles).map((role) => map(role.permissions, 'name')).flatten().value();
      define({
        roles: roles,
        permissions: permissions
      })
    },
    [define],
  )

  // const setCurrentBusiness = useCallback(
  //   (business: IBusiness) => {
  //     dispatch({
  //       type: 'UPDATE',
  //       payload: {
  //         currentBusiness: business,
  //       }
  //     });
  //     setBusinessInSession(business?.id)
  //   },
  //   [],
  // )


  // const initCurrentBusiness = useCallback(
  //   async (user) => {
  //     try {
  //       const localStorageCurrentBusinessId = localStorage.getItem('currentBusinessId') || null;
  //       if (localStorageCurrentBusinessId) {
  //         const business = await businessService.get(localStorageCurrentBusinessId);
  //         if (business.data) {
  //           setCurrentBusiness(business.data);
  //         }
  //       } else {
  //         const localStorageCurrentBusinessId =
  //           localStorage.getItem('currentBusinessId');

  //         if (localStorageCurrentBusinessId) {
  //           const business = await businessService.get(
  //             localStorageCurrentBusinessId
  //           );
  //           if (business.data) {
  //             setCurrentBusiness(business.data);
  //           }

  //         } else {
  //           const businessResponse = await businessService.get(
  //             user?.businesses[0]?.id
  //           );
  //           const defaultBusiness = businessResponse.data;

  //           if (
  //             user?.roles.some((item) => item.name === RoleNameEnum.SUPER_ADMIN)
  //           ) {
  //             const superAdminBusinessResponse = await businessService.getAll();
  //             setCurrentBusiness(superAdminBusinessResponse.items[0]);
  //           } else {
  //             setCurrentBusiness(defaultBusiness);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  //   [setCurrentBusiness],
  // )

  const setUser = useCallback(
    async (user?: IUser | null) => {
      if (!user) {
        try {
          await userService.getMe().then(async ({ data }) => {
            user = data
            if (!user) {
              await logout()
              return
            }
          });
        } catch (error) {
          await logout()
          return
        }
      }
      //await initCurrentBusiness(user);
      // setOrganizationInSession(user.organizationId);

      initPermissions(user);
      dispatch({
        type: 'UPDATE',
        payload: {
          user,
        }
      });
    },
    [initPermissions, logout],
  );


  const login = useCallback(
    async (token?:string, user?: any) => {
      await setSession(token);
      if (user) {
        await setUser(user)
      }
      else {
        await setUser(null)
      }
      dispatch({
        type: 'SIGN_IN',
        payload: {
          token,
        }
      });
      loginListeners.forEach((listener:any) => listener(user));
    },
    [setUser, loginListeners],
  );

  const addLoginListener = (listener:any) => {
    setLoginListeners((prevListeners:any) => [...prevListeners, listener]);
  };

  const addLogoutListener = (listener:any) => {
    setLogoutListeners((prevListeners:any) => [...prevListeners, listener]);
  };

  const removeLoginListener = (listener:any) => {
    setLoginListeners((prevListeners:any) => prevListeners.filter((l:any) => l != listener));
  };

  const removeLogoutListener = (listener:any) => {
    setLogoutListeners((prevListeners:any) => prevListeners.filter((l:any) => l != listener));
  };

  useEffect(() => {
    const initialize = async () => {
      const token = await localStorage.getItem('token');
      if (token) {
        await login(token);
      } else {
        await logout()
      }

      dispatch({ type: 'INITIALIZE' });
    }
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{
      login,
      logout,
      setUser,
      addLoginListener,
      addLogoutListener,
      removeLoginListener,
      removeLogoutListener,
      ...state,
    }}>
      {children}
    </AuthContext.Provider>
  );
};


export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
