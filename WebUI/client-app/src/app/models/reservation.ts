export interface IReservationsVm {
  reservations: IReservation[];
  reservationsCount: number;
}

export interface IReservation {
  id: number;
  startTime: string;
  endTime: string;
  date: Date;
  createdAt: Date;
  price: number;
  sportObjectId: number;
  sportObject: ISportObject;
  userId: string;
  user: IUser;
  statusId: number;
  status: IReservationStatus;
}

interface ISportObject {
  id: number;
  name: string;
}

interface IUser {
  id: string;
  username: string;
}

interface IReservationStatus {
  id: number;
  status: string;
}

export interface IFreeTermsVm {
  sportObjectId: number;
  freeTerms: IFreeTerm[];
  freeTermsCount: number;
}

export interface IFreeTerm {
  date: Date;
  startTime: string;
  price: number;
}

export interface ITermsVm {
  sportObjectId: number;
  termsByDate: ITermByDate[];
  termsCount: number;
}

export interface ITermByDate {
  date: Date;
  terms: ITerm[];
}

export interface ITerm {
  startTime: string;
  price: number;
  status: string;
  isExpired: boolean;
}
