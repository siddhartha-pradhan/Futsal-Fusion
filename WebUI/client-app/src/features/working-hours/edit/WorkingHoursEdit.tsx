import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Field, Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import {
  closeHours,
  getDayOfWeek,
  openHours,
} from '../../../app/common/util/util';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { required } from '../../../validation';
import { IWorkingHoursFormValues } from '../../../app/models/workingHour';
import InputSelect from '../../../app/common/form/select/InputSelect';
import Button from '../../../app/common/button/Button';
import { S } from './WorkingHoursEdit.style';
import LoadingSpinner from '../../../app/layout/spinner/LoadingSpinner';

const WorkingHoursEdit = () => {
  const rootStore = useContext(RootStoreContext);
  const { editWorkingHours, submitting } = rootStore.workingHourStore;
  const { mySportObject, loadingMySportObject } = rootStore.sportObjectStore;

  const initial = {
    workingHours: mySportObject?.workingHours,
  };

  if (loadingMySportObject) return <LoadingSpinner />;

  return (
    <S.WorkingHoursEdit>
      <h2>Update working hours</h2>
      <Form
        mutators={{
          ...arrayMutators,
        }}
        onSubmit={(values: IWorkingHoursFormValues) => {
          values.sportObjectId = mySportObject!.id!;
          editWorkingHours(values);
        }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <S.Content>
              <S.Day className='first-day'>Dan</S.Day>
              <S.ContentItem>Otvaranje</S.ContentItem>
              <S.ContentItem>Zatvaranje</S.ContentItem>
            </S.Content>
            <FieldArray name='workingHours'>
              {() =>
                initial.workingHours?.map((wh, index) => (
                  <S.Content key={index}>
                    <Field
                      name={`workingHours[${index}].day`}
                      component='input'
                      type='text'
                      initialValue={wh.day}
                      hidden
                    />
                    <S.Day>{getDayOfWeek(wh.day)}</S.Day>
                    <S.ContentItem>
                      <Field
                        name={`workingHours[${index}].openTime`}
                        block
                        validate={required}
                        initialValue={wh.openTime}
                        component={InputSelect}
                      >
                        {openHours.map((hour) => (
                          <option key={hour} value={hour}>
                            {hour.slice(0, -3)}
                          </option>
                        ))}
                      </Field>
                    </S.ContentItem>
                    <S.ContentItem>
                      <Field
                        name={`workingHours[${index}].closeTime`}
                        block
                        validate={required}
                        initialValue={wh.closeTime}
                        component={InputSelect}
                      >
                        {closeHours.map((hour) => (
                          <option key={hour} value={hour}>
                            {hour.slice(0, -3)}
                          </option>
                        ))}
                      </Field>
                    </S.ContentItem>
                  </S.Content>
                ))
              }
            </FieldArray>
            <div className='warn'>
              When you update the working hours, all prices will be deleted and you will have to create them again!!!
            </div>
            <Button
              disabled={submitting}
              loading={submitting}
              type='submit'
              color='primary'
              block
            >
              Ažuriraj
            </Button>
          </form>
        )}
      ></Form>
    </S.WorkingHoursEdit>
  );
};

export default observer(WorkingHoursEdit);
