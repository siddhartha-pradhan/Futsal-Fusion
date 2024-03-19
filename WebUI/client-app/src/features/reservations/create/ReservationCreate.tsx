import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Field, Form } from 'react-final-form';
import Button from '../../../app/common/button/Button';
import { IReservation } from '../../../app/models/reservation';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { S } from './ReservationCreate.style';
import ErrorMessage from '../../../app/common/form/error/ErrorMessage';

interface IProps {
  date: string;
  startTime: string;
  price: number;
  termDate: Date;
}

const ReservationCreate: React.FC<IProps> = ({
  date,
  startTime,
  price,
  termDate,
}) => {
  const rootStore = useContext(RootStoreContext);
  const { sportObject } = rootStore.sportObjectStore;
  const { createReservation, submitting } = rootStore.reservationStore;
  const { isLoggedIn } = rootStore.userStore;

  const [error, setError] = useState<string | null>(null);

  const handleCreateReservation = (values: IReservation) => {
    if (isLoggedIn) {
      createReservation(values, termDate);
    } else {
      setError('You must log in to book an appointment.');
    }
  };

  return (
    <S.ReservationCreate>
      <div>
        <span>Sports Facility: </span>
        {sportObject!.name}
      </div>
      <div>
        <span>Address: </span>
        {sportObject!.address}
      </div>
      <div>
        <span>Sport: </span>
        {sportObject?.sport.name}
      </div>
      <hr />
      <div>
        <span>Date: </span>
        {date}
      </div>
      <div>
        <span>Time: </span>
        {startTime}
      </div>
      <div>
        <span>Price: </span>
        {price} RSD
      </div>

      <Form
        onSubmit={(values: IReservation) => handleCreateReservation(values)}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name='sportObjectId'
              component='input'
              type='text'
              initialValue={sportObject?.id}
              hidden
            />
            <Field
              name='date'
              component='input'
              type='text'
              initialValue={date}
              hidden
            />
            <Field
              name='startTime'
              component='input'
              type='text'
              initialValue={startTime}
              hidden
            />
            <ErrorMessage text={error} />

            <Button
              disabled={submitting}
              loading={submitting}
              type='submit'
              color='primary'
              block
            >
              Rezervisi
            </Button>
          </form>
        )}
      ></Form>
    </S.ReservationCreate>
  );
};

export default observer(ReservationCreate);
