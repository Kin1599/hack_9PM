import React, { useState } from 'react'
import cl from './MapControls.module.scss'
import danger from '../../assets/danger.svg'
import layer from '../../assets/layer.svg'
import traffic from '../../assets/traffic.svg'

function MapControls({handleStageChange}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isTraffic, setIsTraffic] = useState(false);
    const [isProblem, setIsProblem] = useState(false);
  return (
    <div className={cl.mapControls}>
        <button 
            className={cl.controls__button} 
            onClick={() => setIsTraffic((prev) => !prev)}
        >
          <img src={traffic} alt="Показать нагруженность дорог" className={`${cl.button__img} ${isTraffic ? cl.traffic : ''}`}/>
        </button>
        <button 
            className={cl.controls__button} 
            onClick={() => setIsProblem((prev) => !prev)}
        >
          <img src={danger} alt="Показать проблемные зоны" className={`${cl.button__img} ${isProblem ? cl.problem : ''}`}/>
        </button>
        <button 
            className={cl.controls__button} 
            onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img src={layer} alt="Выберите этап застройки" className={cl.button__img}/>
        </button>
        {
          dropdownOpen && (
            <div className={cl.stage__dropdownMenu}>
              {['stage1', 'stage2', 'stage3'].map((stage, index) => (
                <button 
                    key={index} 
                    onClick={() => {
                        handleStageChange(stage);
                        setDropdownOpen(false);
                    }} 
                    className={cl.dropdownMenu__item}
                >
                  Этап {index + 1}
                </button>
              ))}
            </div>
          )
        }
    </div>
  )
}

export default MapControls