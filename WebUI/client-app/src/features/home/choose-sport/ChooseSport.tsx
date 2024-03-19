import React, { useContext } from 'react';
import { S } from './ChooseSport.style';
import { GiSoccerBall, GiBasketballBall, GiTennisBall } from 'react-icons/gi';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';

const ChooseSport = () => {
  const rootStore = useContext(RootStoreContext);
  const { setPredicate } = rootStore.sportObjectStore;
  return (
    <S.ChooseSport>
      <S.Sport onClick={() => setPredicate('sportId', '5')}>
        <span>
          <GiSoccerBall />
        </span>
        <h5>Football</h5>
        <div>Field Number: 24</div>
      </S.Sport>
      <S.Sport onClick={() => setPredicate('sportId', '4')}>
        <span>
          <GiBasketballBall />
        </span>
        <h5>Indoor Courts</h5>
        <div>Field Number: 31</div>
      </S.Sport>
      <S.Sport onClick={() => setPredicate('sportId', '3')}>
        <span>
          <GiTennisBall />
        </span>
        <h5>Outdoor Courts</h5>
        <div>Field Number: 45</div>
      </S.Sport>
    </S.ChooseSport>
  );
};

export default observer(ChooseSport);
