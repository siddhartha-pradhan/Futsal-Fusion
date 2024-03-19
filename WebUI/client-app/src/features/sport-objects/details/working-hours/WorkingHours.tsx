import { observer } from 'mobx-react-lite';
import React from 'react';
import { ISportObject } from '../../../../app/models/sportObject';
import { Style } from '../../../../style';
import { S } from './WorkingHours.style';

interface IProps {
  sportObject: ISportObject;
}

const WorkingHours: React.FC<IProps> = ({ sportObject }) => {
  return (
    <S.WorkingHours>
      <Style.SportObjectDetailsCard>
        <div className='header'>
          <h3>Working Hours</h3>
        </div>
        <div className='body'>
          {sportObject.workingHours.length > 0 ? (
            <S.Content>
              <S.Left>
                <div>Monday</div>
                <div>Tuesday</div>
                <div>Wednesday</div>
                <div>Thursday</div>
                <div>Friday</div>
                <div>Saturday</div>
                <div>Sunday</div>
              </S.Left>
              <S.Right>
                {sportObject.workingHours.map((wh) => (
                  <div key={wh.id}>
                    {wh.openTime.slice(0, -3)} - {wh.closeTime.slice(0, -3)}
                  </div>
                ))}
              </S.Right>
            </S.Content>
          ) : (
            <div>There is currently no information about opening hours</div>
          )}
        </div>
      </Style.SportObjectDetailsCard>
    </S.WorkingHours>
  );
};

export default observer(WorkingHours);
