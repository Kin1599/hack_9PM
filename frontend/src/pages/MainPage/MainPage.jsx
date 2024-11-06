import React, { useEffect, useState } from 'react'
import cl from './MainPage.module.scss'
import SendServer from '../../api/Service'

function MainPage() {

    const [pingResponse, setPingResponse] = useState(''); 

    const ping = async () => {
        const response = await SendServer.getPing();
        setPingResponse(response);
    }

    useEffect(() => {
        ping();
    }, [])

  return (
    <div className={cl.mainPage}>
        Тестовая страничка
        <div>{pingResponse}</div>
    </div>
  )
}

export default MainPage