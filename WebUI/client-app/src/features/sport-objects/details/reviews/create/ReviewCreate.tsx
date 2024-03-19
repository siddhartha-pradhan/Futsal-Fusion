import React, { useContext } from 'react';
import StarRating from '../../../../../app/common/star-rating/StarRating';
import { IReview } from '../../../../../app/models/review';
import { Form, Field } from 'react-final-form';
import { observer } from 'mobx-react-lite';
import Button from '../../../../../app/common/button/Button';
import InputTextArea from '../../../../../app/common/form/text-area/InputTextArea';
import { RootStoreContext } from '../../../../../app/stores/rootStore';
import ErrorMessage from '../../../../../app/common/form/error/ErrorMessage';

const ReviewCreate = () => {
  const rootStore = useContext(RootStoreContext);
  const { createReview, error } = rootStore.reviewStore;
  const { sportObject } = rootStore.sportObjectStore;

  return (
    <div>
      <h3>Leave a Review</h3>
      <Form
        onSubmit={(values: IReview) => createReview(sportObject?.id!, values)}
        render={({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit}>
            <StarRating />
            <Field
              name='comment'
              label='Comments'
              block
              component={InputTextArea}
            />
            {error && <ErrorMessage error={error} />}

            <Button
              disabled={submitting}
              loading={submitting}
              type='submit'
              color='primary'
              block
            >
              Submit
            </Button>
          </form>
        )}
      ></Form>
    </div>
  );
};

export default observer(ReviewCreate);
