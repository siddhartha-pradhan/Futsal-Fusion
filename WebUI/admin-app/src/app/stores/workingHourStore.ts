import { RootStore } from './rootStore';
import { observable, action, runInAction } from 'mobx';
import { AxiosResponse } from 'axios';
import { IWorkingHoursFormValues } from '../models/workingHour';
import agent from '../api/agent';
import { toast } from 'react-toastify';

export default class WorkingHourStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable submitting = false;
  @observable error: AxiosResponse | null = null;

  @action createWorkingHours = async (
    workingHours: IWorkingHoursFormValues
  ) => {
    this.submitting = true;
    try {
      await agent.WorkingHours.create(workingHours);
      runInAction(() => {
        this.submitting = false;
        this.error = null;
      });
      toast.success('Working hours created');
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
        this.error = error;
      });
      console.log(error);
    }
  };

  @action editWorkingHours = async (workingHours: IWorkingHoursFormValues) => {
    this.submitting = true;
    try {
      await agent.WorkingHours.update(workingHours);
      runInAction(() => {
        this.submitting = false;
        this.error = null;
      });
      toast.success('Working hours updated');
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
        this.error = error;
      });
      console.log(error);
    }
  };
}
