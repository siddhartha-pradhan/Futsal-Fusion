import axios, { AxiosResponse } from 'axios';
import { ISportObject, ISportObjectsVm } from '../models/sportObject';
import { history } from '../..';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/user';
import { ICitiesVm, ICity } from '../models/city';
import { ISportsVm, ISport } from '../models/sport';
import { ICountriesVm, ICountry } from '../models/country';
import { IReviewsVm } from '../models/review';
import { IRolesVm, IRole } from '../models/role';
import { IWorkingHoursFormValues } from '../models/workingHour';
import { IPrice } from '../models/price';
import { IReservation, IReservationsListVm } from '../models/reservation';
import { IFreeTermsVm } from '../models/freeTerm';

axios.defaults.baseURL = 'https://localhost:44392/api';

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, (error) => {
  // if (error.message === 'Network Error' && !error.response) {
  //   toast.error('Network error - make sure API is running!');
  // }
  const { status, data, config, headers } = error.response;
  if (status === 404) {
    history.push('/notfound');
  }
  if (
    status === 401 &&
    headers['www-authenticate'].includes('Bearer error="invalid_token"')
  ) {
    window.localStorage.removeItem('jwt');
    history.push('/');
    toast.info('Your session has expired, please login again');
  }
  if (
    status === 400 &&
    config.method === 'get' &&
    data.errors.hasOwnProperty('id')
  ) {
    history.push('/notfound');
  }
  if (status === 500) {
    toast.error('Server error - check the terminal for more info!');
  }
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

// ! use this just in production?
// da se uspori komunikacija sa API, ne koristi se za production, samo u development
const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(1000)).then(responseBody),
  del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
};

const Users = {
  current: (): Promise<IUser> => requests.get('/users/current'),
  login: (user: IUserFormValues): Promise<IUser> =>
    requests.post(`/users/login-admin`, user),
};

const Roles = {
  list: (): Promise<IRolesVm> => requests.get('/roles'),
  details: (id: string) => requests.get(`/roles/${id}`),
  create: (role: IRole) => requests.post(`/roles`, role),
  update: (role: IRole) => requests.put(`/roles/${role.id}`, role),
  delete: (id: string) => requests.del(`/roles/${id}`),
};

const SportObjects = {
  list: (): Promise<ISportObjectsVm> => requests.get('/sport-objects'),
  details: (id: number) => requests.get(`/sport-objects/${id}`),
  create: (sportObject: ISportObject) =>
    requests.post('/sport-objects', sportObject),
  update: (sportObject: ISportObject) =>
    requests.put(`/sport-objects/${sportObject.id}`, sportObject),
  delete: (id: number) => requests.del(`/sport-objects/${id}`),
};

const WorkingHours = {
  create: (workingHours: IWorkingHoursFormValues) =>
    requests.post(
      `/sportObjects/${workingHours.sportObjectId}/workingHours`,
      workingHours
    ),
  update: (workingHours: IWorkingHoursFormValues) =>
    requests.put(
      `/sportObjects/${workingHours.sportObjectId}/workingHours`,
      workingHours
    ),
};

const Prices = {
  create: (price: IPrice) => requests.post('/prices', price),
  update: (price: IPrice) => requests.put(`/prices/${price.id}`, price),
  delete: (id: number) => requests.del(`/prices/${id}`),
};

const Reviews = {
  list: (): Promise<IReviewsVm> => requests.get('/reviews'),
};

const Reservations = {
  list: (): Promise<IReservationsListVm> => requests.get('/reservations'),
  create: (reservation: IReservation) =>
    requests.post('/reservations', reservation),
  approve: (reservation: IReservation) =>
    requests.put(`/reservations/${reservation.id}`, reservation),
  delete: (id: number) => requests.del(`/reservations/${id}`),
  getFreeTerms: (id: number): Promise<IFreeTermsVm> =>
    requests.get(`/sportobjects/${id}/freeterms`),
};

const Countries = {
  list: (): Promise<ICountriesVm> => requests.get('/countries'),
  details: (id: number) => requests.get(`/countries/${id}`),
  create: (country: ICountry): Promise<number> =>
    requests.post('/countries', country),
  update: (country: ICountry) =>
    requests.put(`/countries/${country.id}`, country),
  delete: (id: number) => requests.del(`/countries/${id}`),
};

const Cities = {
  list: (): Promise<ICitiesVm> => requests.get('/cities'),
  details: (id: number) => requests.get(`/cities/${id}`),
  create: (city: ICity): Promise<number> => requests.post('/cities', city),
  update: (city: ICity) => requests.put(`/cities/${city.id}`, city),
  delete: (id: number) => requests.del(`/cities/${id}`),
};

const Sports = {
  list: (): Promise<ISportsVm> => requests.get('/sports'),
  details: (id: number) => requests.get(`/sports/${id}`),
  create: (sport: ISport): Promise<number> => requests.post('/sports', sport),
  update: (sport: ISport) => requests.put(`/sports/${sport.id}`, sport),
  delete: (id: number) => requests.del(`/sports/${id}`),
};

export default {
  SportObjects,
  Reviews,
  Users,
  Countries,
  Cities,
  Sports,
  Roles,
  WorkingHours,
  Prices,
  Reservations,
};
