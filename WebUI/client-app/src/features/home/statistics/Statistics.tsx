import React from 'react';
import { S } from './Statistics.style';

const Statistics = () => {
  return (
    <S.Statistics>
      <S.Counter>
        <h5>50</h5>
        <div>Football Fields</div>
      </S.Counter>
      <S.Counter>
        <h5>24</h5>
        <div>Indoor Courts</div>
      </S.Counter>
      <S.Counter>
        <h5>19</h5>
        <div>Outdoor Courts</div>
      </S.Counter>
    </S.Statistics>
  );
};

export default Statistics;
