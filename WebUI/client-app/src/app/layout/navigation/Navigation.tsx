import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import LoginForm from '../../../features/users/login/LoginForm';
import RegisterForm from '../../../features/users/register/RegisterForm';
import { RootStoreContext } from '../../stores/rootStore';
import { S } from './Navigation.style';

const Navigation = () => {
  const rootStore = useContext(RootStoreContext);
  const { openModal } = rootStore.modalStore;
  const { isLoggedIn, isClient, logout } = rootStore.userStore;
  const { mySportObject } = rootStore.sportObjectStore;

  const navRef = useRef<HTMLUListElement>(null);

  const handleNavToggle = (e: any) => {
    e.preventDefault();
    //e.currentTarget.previousElementSibling!.classList.toggle('nav-active');
    navRef.current?.classList.toggle('nav-active');
  };

  // const handleLinkOnClick = (
  //   e: React.MouseEvent<HTMLLIElement, MouseEvent>
  // ) => {
  //   e.preventDefault();
  //   e.currentTarget.parentElement!.classList.toggle('nav-active');
  // };

  const handleOpenLoginModal = (e: any) => {
    e.preventDefault();
    openModal('Welcome', <LoginForm />);
  };

  const handleOpenRegisterModal = (e: any) => {
    e.preventDefault();
    openModal('Welcome', <RegisterForm />);
  };

  return (
    <Fragment>
      <S.Nav>
        <S.Logo>
          <h4>Naziv</h4>
        </S.Logo>
        <S.NavLinks ref={navRef}>
          <li onClick={handleNavToggle}>
            <NavLink to='/'>Home</NavLink>
          </li>
          <li onClick={handleNavToggle}>
            <NavLink to='/fields'>Fields</NavLink>
          </li>
          <li onClick={handleNavToggle}>
            <NavLink to='/partnership'>Partners</NavLink>
          </li>
          {isLoggedIn ? (
            <li onClick={handleNavToggle}>
              <NavLink to='/profile'>Profile</NavLink>
            </li>
          ) : (
            <>
              <li onClick={handleNavToggle}>
                <button onClick={handleOpenLoginModal} type='button'>
                  Application
                </button>
              </li>
              <li onClick={handleNavToggle}>
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
                <li onClick={handleNavToggle}>
                  <NavLink to={'/fields/' + mySportObject?.id}>
                  My Field
                  </NavLink>
                </li>
                <li onClick={handleNavToggle}>
                  <NavLink to='/reservations'>Reservations</NavLink>
                </li>
                <li onClick={handleNavToggle}>
                  <NavLink to='/my-sport-object'>Sport Facilites</NavLink>
                </li>
                <li onClick={handleNavToggle}>
                  <NavLink to='/working-hours'>Working Hours</NavLink>
                </li>
                <li onClick={handleNavToggle}>
                  <NavLink to='/prices'>Prices</NavLink>
                </li>
                <li onClick={handleNavToggle}>
                  <NavLink to='/images'>Images</NavLink>
                </li>
                <li onClick={handleNavToggle}>
                  <button onClick={logout} type='button'>
                    Log Out
                  </button>
                </li>
              </S.SubNavLinks>
            ) : (
              <S.SubNavLinks>
                <li onClick={handleNavToggle}>
                  <NavLink to='/reservations'>Reservations</NavLink>
                </li>
                <li onClick={handleNavToggle}>
                  <NavLink to='/favourites'>Favourites</NavLink>
                </li>
                <li onClick={handleNavToggle}>
                  <button onClick={logout} type='button'>
                    Log Out
                  </button>
                </li>
              </S.SubNavLinks>
            ))}
        </S.NavLinks>
        <S.Burger onClick={handleNavToggle}>
          <div className='line1'></div>
          <div className='line2'></div>
          <div className='line3'></div>
        </S.Burger>
      </S.Nav>
    </Fragment>
  );
};

export default observer(Navigation);
