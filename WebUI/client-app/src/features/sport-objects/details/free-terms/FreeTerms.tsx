import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { Field, Form } from 'react-final-form';
import {
  getDate,
  getDateAndMonth,
  getDayOfWeek,
} from '../../../../app/common/util/util';
import LoadingSpinner from '../../../../app/layout/spinner/LoadingSpinner';
import { ITerm, ITermByDate } from '../../../../app/models/reservation';
import { RootStoreContext } from '../../../../app/stores/rootStore';
import ReservationCreate from '../../../reservations/create/ReservationCreate';
import { S } from './FreeTerms.style';
import { ISportObject } from '../../../../app/models/sportObject';
import FreeTerm from './free-term/FreeTerm';

interface IProps {
  sportObject: ISportObject;
}

const FreeTerms: React.FC<IProps> = ({ sportObject }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadTerms,
    loadingTerms,
    termsByDate,
    created,
  } = rootStore.reservationStore;
  const { openModal } = rootStore.modalStore;
  const { workingHours } = rootStore.sportObjectStore;

  useEffect(() => {
    if (sportObject.workingHours.length > 0) {
      loadTerms(sportObject.id!);
    }
  }, [loadTerms, sportObject.id, sportObject.workingHours]);

  useEffect(() => {}, [created]);

  const handleTermClick = (values: any) => {
    const { date, startTime, price, termDate } = values;
    openModal(
      'Potvrda rezervacije',
      <ReservationCreate
        date={date}
        startTime={startTime}
        price={price}
        termDate={termDate}
      />
    );
  };

  return (
    <>
      {sportObject.workingHours.length > 0 && sportObject.prices.length > 0 && (
        <S.FreeTerms>
          <h3>Find an Appointment</h3>
          <S.Legend>
            <S.Item color='green'>
              <div className='legend'></div>
              <div>Slobodan</div>
            </S.Item>
            <S.Item color='yellow'>
              <div className='legend'></div>
              <div>On hold</div>
            </S.Item>
            <S.Item color='red'>
              <div className='legend'></div>
              <div>Busy</div>
            </S.Item>
          </S.Legend>
          {loadingTerms ? (
            <LoadingSpinner />
          ) : (
            <S.Content>
              <S.Dates>
                {termsByDate.map((termByDate: ITermByDate, index) => (
                  <S.Date key={index}>
                    <div>{getDayOfWeek(termByDate.date.getDay())}</div>
                    <div>{getDateAndMonth(termByDate.date)}</div>
                  </S.Date>
                ))}
              </S.Dates>
              <S.Terms>
                {termsByDate.map((termByDate: ITermByDate, index) => (
                  <S.TermRow key={index}>
                    {workingHours.map((hour, i) => {
                      var term: ITerm | undefined;
                      term = termByDate.terms.find(
                        (x) => Number(x.startTime.substring(0, 2)) === hour
                      );
                      if (term === undefined) {
                        return (
                          <S.Term
                            key={i}
                            type='submit'
                            status='empty'
                            disabled
                          ></S.Term>
                        );
                      }
                      return (
                        <Form
                          key={i}
                          onSubmit={handleTermClick}
                          render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                              <Field
                                name='date'
                                component='input'
                                type='text'
                                initialValue={getDate(termByDate.date)}
                                hidden
                              />
                              <Field
                                name='termDate'
                                component='input'
                                type='text'
                                initialValue={termByDate.date}
                                hidden
                              />
                              <Field
                                name='startTime'
                                component='input'
                                type='text'
                                initialValue={term!.startTime}
                                hidden
                              />
                              <Field
                                name='price'
                                component='input'
                                type='number'
                                initialValue={term!.price}
                                hidden
                              />

                              <FreeTerm term={term!} />
                            </form>
                          )}
                        ></Form>
                      );
                    })}
                  </S.TermRow>
                ))}
              </S.Terms>
            </S.Content>
          )}
        </S.FreeTerms>
      )}
    </>
  );
};

export default observer(FreeTerms);
