import React from 'react'
import cl from './MainPage.module.scss'
import SendServer from '../../api/Service'
import MockServer from '../../api/MockService'
import MapComponent from '../../widgets/MapComponent/MapComponent'

function MainPage() {

    const server = process.env.REACT_APP_MODE === "prod" ? SendServer : MockServer;

  return (
    <div className={cl.mainPage}>
      <MapComponent fetchData={server.getHousesData}/>
    </div>
  )
}

export default MainPage