import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { RootStoreContext } from '../../../stores/rootStore';
import { S } from './NavDropdown.style';

const NavDropdown = () => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, isClient, logout } = rootStore.userStore;

  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  return (
    <S.NavDropdown
      onClick={handleClick}
      className={click ? 'dropdown-menu clicked' : 'dropdown-menu'}
    >
      {isLoggedIn &&
        (isClient ? (
          <>
            <li onClick={() => setClick(false)}>
              <NavLink to='/reservations'>Reservations</NavLink>
            </li>
            <li onClick={() => setClick(false)}>
              <NavLink to='/my-sport-object'>Sport Facility</NavLink>
            </li>
            <li onClick={() => setClick(false)}>
              <NavLink to='/working-hours'>Working Hours</NavLink>
            </li>
            <li onClick={() => setClick(false)}>
              <NavLink to='/prices'>Prices</NavLink>
            </li>
            <li onClick={() => setClick(false)}>
              <NavLink to='/images'>Images</NavLink>
            </li>
            <li onClick={() => setClick(false)}>
              <button onClick={logout} type='button'>
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li onClick={() => setClick(false)}>
              <NavLink to='/reservations'>Reservations</NavLink>
            </li>
            <li onClick={() => setClick(false)}>
              <NavLink to='/favourites'>Favourites</NavLink>
            </li>
            <li onClick={() => setClick(false)}>
              <NavLink to='/profile/edit'>Profile</NavLink>
            </li>
            <li onClick={() => setClick(false)}>
              <button onClick={logout} type='button'>
                Log Out
              </button>
            </li>
          </>
        ))}
    </S.NavDropdown>
  );
};

export default NavDropdown;
