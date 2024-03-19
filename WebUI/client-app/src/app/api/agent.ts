import axios, { AxiosResponse } from 'axios';
import { history } from '../..';
import { ICitiesVm } from '../models/city';
import { ICountriesVm } from '../models/country';
import { IFavouritesVm } from '../models/favourites';
import {
  IReservationsVm,
  IFreeTermsVm,
  IReservation,
  ITermsVm,
} from '../models/reservation';
import { IReviewsVm, IReview } from '../models/review';
import { ISportObjectsVm, ISportObject } from '../models/sportObject';
import { ISportsVm } from '../models/sport';
import { ICurrentUser, IUserFormValues, IUsersVm, IUser } from '../models/user';
import { IContact } from '../models/contact';
import { IPrice } from '../models/price';
import { IWorkingHoursFormValues } from '../models/workingHour';
import { toast } from 'react-toastify';
import { IImage } from '../models/image';

//axios.defaults.baseURL = 'http://localhost:5000/api';
//axios.defaults.baseURL = 'http://192.168.0.16:45455/api';
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
  if (error.message === 'Network Error' && !error.response) {
    toast.error('Network error - make sure API is running!');
  }
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
    //toast.error('Server error - check the terminal for more info!');
  }
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

// ! use this?
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
  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append('File', file);
    return axios
      .post(url, formData, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
      .then(sleep(1000))
      .then(responseBody);
  },
};

const Cities = {
  list: (): Promise<ICitiesVm> => requests.get('/cities'),
};

const Contacts = {
  create: (contact: IContact): Promise<number> =>
    requests.post('/contacts', contact),
};

const Countries = {
  list: (): Promise<ICountriesVm> => requests.get('/countries'),
};

const Favourites = {
  list: (): Promise<IFavouritesVm> => requests.get('/favourites'),
  add: (id: number): Promise<number> =>
    requests.post(`/sport-objects/${id}/favourites`, id),
  remove: (id: number) => requests.del(`/sport-objects/${id}/favourites`),
};

const Images = {
  upload: (id: number, image: Blob): Promise<IImage> =>
    requests.postForm(`/sport-objects/${id}/images`, image),
  setMain: (sportObjectId: number, imageId: string) =>
    requests.post(
      `/sport-objects/${sportObjectId}/images/${imageId}/set-main`,
      {}
    ),
  delete: (sportObjectId: number, imageId: string) =>
    requests.del(`/sport-objects/${sportObjectId}/images/${imageId}`),
};

const Prices = {
  create: (sportObjectId: number, price: IPrice): Promise<number> =>
    requests.post(`sport-objects/${sportObjectId}/prices`, price),
  update: (sportObjectId: number, price: IPrice) =>
    requests.put(`sport-objects/${sportObjectId}/prices/${price.id}`, price),
  delete: (sportObjectId: number, priceId: number) =>
    requests.del(`sport-objects/${sportObjectId}/prices/${priceId}`),
};

const Reservations = {
  // list: (status?: string): Promise<IReservationsVm> =>
  //   requests.get(`/reservations?status=${status}`),
  list: (params: URLSearchParams): Promise<IReservationsVm> =>
    axios.get(`/reservations`, { params: params }).then(responseBody),
  freeTerms: (id: number): Promise<IFreeTermsVm> =>
    requests.get(`/sport-objects/${id}/free-terms`),
  terms: (id: number): Promise<ITermsVm> =>
    requests.get(`/sport-objects/${id}/terms`),
  create: (reservation: IReservation) =>
    requests.post('/reservations', reservation),
  approve: (reservation: IReservation) =>
    requests.put(`/reservations/${reservation.id}`, reservation),
  delete: (id: number) => requests.del(`/reservations/${id}`),
};

const Reviews = {
  list: (id: number): Promise<IReviewsVm> =>
    requests.get(`/sport-objects/${id}/reviews`),
  create: (sportObjectId: number, review: IReview) =>
    requests.post(`/sport-objects/${sportObjectId}/reviews`, review),
  update: (sportObjectId: number, review: IReview) =>
    requests.put(`/sport-objects/${sportObjectId}/reviews`, review),
  delete: (sportObjectId: number, userId: string) =>
    requests.del(`/sport-objects/${sportObjectId}/reviews/${userId}`),
};

const Sports = {
  list: (): Promise<ISportsVm> => requests.get('/sports'),
};

const SportObjects = {
  // list: (
  //   cityId?: number,
  //   sportId?: number,
  //   date?: string,
  //   time?: string,
  //   isPremium?: boolean
  // ): Promise<ISportObjectsVm> =>
  //   requests.get(
  //     `/sport-objects?cityid=${cityId}&sportid=${sportId}&date=${date}&time=${time}&ispremium=${isPremium}`
  //   ),
  list: (params: URLSearchParams): Promise<ISportObjectsVm> =>
    axios
      .get(`/sport-objects`, { params: params })
      .then(sleep(1000))
      .then(responseBody),
  featuredList: (): Promise<ISportObjectsVm> =>
    requests.get('/sport-objects/featured'),
  details: (id: number) => requests.get(`/sport-objects/${id}`),
  myDetails: () => requests.get(`/sport-objects/owner`),
  update: (sportObject: ISportObject) =>
    requests.put(`/sport-objects/${sportObject.id}`, sportObject),
};

const Users = {
  current: (): Promise<ICurrentUser> => requests.get('/users/current'),
  login: (user: IUserFormValues): Promise<ICurrentUser> =>
    requests.post(`/users/login`, user),
  register: (user: IUserFormValues): Promise<ICurrentUser> =>
    requests.post(`/users/register`, user),
  list: (): Promise<IUsersVm> => requests.get('/users'),
  details: (id: string): Promise<IUser> => requests.get(`/users/${id}`),
  update: (user: IUser) => requests.put(`/users/${user.id}`, user),
};

const WorkingHours = {
  create: (workingHours: IWorkingHoursFormValues) =>
    requests.post(
      `/sport-objects/${workingHours.sportObjectId}/working-hours`,
      workingHours
    ),
  update: (workingHours: IWorkingHoursFormValues) =>
    requests.put(
      `/sport-objects/${workingHours.sportObjectId}/working-hours`,
      workingHours
    ),
};

export default {
  Cities,
  Contacts,
  Countries,
  Favourites,
  Images,
  Prices,
  Reservations,
  Reviews,
  Sports,
  SportObjects,
  Users,
  WorkingHours,
};
