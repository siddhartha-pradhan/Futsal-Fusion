import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { S } from './SideDrawer.style';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../stores/rootStore';
import LoginForm from '../../../../features/users/login/LoginForm';
import RegisterForm from '../../../../features/users/register/RegisterForm';
import {
  FaHandshake,
  FaHome,
  FaLandmark,
  FaSignInAlt,
  FaUserPlus,
} from 'react-icons/fa';

interface IProps {
  show: boolean;
  click: () => void;
}

const SideDrawer: React.FC<IProps> = ({ show, click }) => {
  const rootStore = useContext(RootStoreContext);
  const { openModal } = rootStore.modalStore;
  const { isLoggedIn, isClient, logout } = rootStore.userStore;
  const { mySportObject } = rootStore.sportObjectStore;

  const handleOpenLoginModal = (e: any) => {
    e.preventDefault();
    openModal('Welcome', <LoginForm />);
  };

  const handleOpenRegisterModal = (e: any) => {
    e.preventDefault();
    openModal('Welcome', <RegisterForm />);
  };

  return (
    <S.SideDrawer show={show}>
      <ul>
        <li onClick={click}>
          <FaHome />
          <NavLink to='/'>Home</NavLink>
        </li>
        <li onClick={click}>
          <FaLandmark />
          <NavLink to='/fields'>Fields</NavLink>
        </li>
        <li onClick={click}>
          <FaHandshake />
          <NavLink to='/partnership'>Partners</NavLink>
        </li>
        {!isLoggedIn && (
          <>
            <li onClick={click}>
              <FaSignInAlt />
              <button onClick={handleOpenLoginModal} type='button'>
                Login
              </button>
            </li>
            <li onClick={click}>
              <FaUserPlus />
              <button onClick={handleOpenRegisterModal} type='button'>
                Registration
              </button>
            </li>
          </>
        )}
        {isLoggedIn && <hr />}

        {isLoggedIn &&
          (isClient ? (
            <S.SubNavLinks>
              <li onClick={click}>
                <NavLink to={'/fields/' + mySportObject?.id}>My Fields</NavLink>
              </li>
              <li onClick={click}>
                <NavLink to='/reservations'>Reservations</NavLink>
              </li>
              <li onClick={click}>
                <NavLink to='/my-sport-object'>Sport Facilities</NavLink>
              </li>
              <li onClick={click}>
                <NavLink to='/working-hours'>Working Hours</NavLink>
              </li>
              <li onClick={click}>
                <NavLink to='/prices'>Prices</NavLink>
              </li>
              <li onClick={click}>
                <NavLink to='/images'>Images</NavLink>
              </li>
              <li onClick={click}>
                <button onClick={logout} type='button'>
                  Log Out
                </button>
              </li>
            </S.SubNavLinks>
          ) : (
            <S.SubNavLinks>
              <li onClick={click}>
                <NavLink to='/reservations'>Reservations</NavLink>
              </li>
              <li onClick={click}>
                <NavLink to='/favourites'>Favourites</NavLink>
              </li>
              <li onClick={click}>
                <NavLink to='/profile/edit'>Profil</NavLink>
              </li>
              <li onClick={click}>
                <button onClick={logout} type='button'>
                  Log Out
                </button>
              </li>
            </S.SubNavLinks>
          ))}
      </ul>
    </S.SideDrawer>
  );
};

export default observer(SideDrawer);
