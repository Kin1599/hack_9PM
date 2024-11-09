import React from 'react'
import cl from './Header.module.scss'
import logo from '../../shared/assets/logo.svg'
function Header() {
  return (
    <div className={cl.header}>
        <img src={logo} alt="logo" className={cl.header__logo}/>
        <div className={cl.header__menu}>
            <div className={cl.menu__item}>Карта</div>
            <div className={cl.menu__item}>Изменения</div>
        </div>
    </div>
  )
}

export default Header