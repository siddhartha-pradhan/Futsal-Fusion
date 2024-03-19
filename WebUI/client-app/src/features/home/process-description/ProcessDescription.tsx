import React from 'react';
import { FaCalendarAlt, FaRunning, FaSearch } from 'react-icons/fa';
import { S } from './ProcessDescription.style';

const ProcessDescription = () => {
  return (
    <S.ProcessDescription>
      <S.Card>
        <FaSearch />
        <h2>Appointment</h2>
        <p>
        In today's fast-paced world, time is of the essence. Whether you're scheduling a routine check-up, a haircut, or a business meeting, the last thing you want is to waste precious minutes navigating through complicated booking systems. That's where our booking app comes in, revolutionizing the way you schedule appointments by making the process remarkably simple and efficient.
        </p>
      </S.Card>
      <S.Card>
        <FaCalendarAlt />
        <h2>Reservations</h2>
        <p>
        In today's fast-paced world, time is a precious commodity. Whether you're booking a spa treatment, a dental check-up, or a consultation with a financial advisor, the process should be seamless and stress-free. With our reservation system, we've made scheduling appointments a breeze, ensuring that you can secure your desired time slot with ease and convenience.
        </p>
      </S.Card>
      <S.Card>
        <FaRunning />
        <h2>Play</h2>
        <p>
        In the world of gaming, flexibility is key. Whether you're a casual player looking to unwind after a long day or a competitive gamer aiming for the top, having the freedom to play at your preferred time is essential. That's why we've designed our gaming platform to accommodate players of all types, allowing you to indulge in your favorite games whenever it suits you best.
        </p>
      </S.Card>
    </S.ProcessDescription>
  );
};

export default ProcessDescription;
