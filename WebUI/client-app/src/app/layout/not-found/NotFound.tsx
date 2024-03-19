import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../common/button/Button';
import { S } from './NotFound.styled';

const NotFound = () => {
  return (
    <S.NotFound>
      <div className='code'>404</div>
      <div className='message'>Page Not Found</div>
      <div className='desc'>
      Oops! We cannot find the page you are looking for.
      </div>
      <Link to='/'>
        <Button type='button' color='primary'>
          Go back to the beginning
        </Button>
      </Link>
    </S.NotFound>
  );
};

export default NotFound;
