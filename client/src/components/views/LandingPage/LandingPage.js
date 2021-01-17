import React, { useEffect } from 'react'
import axios from 'axios'

function LandingPage(props){

    useEffect(() => {
        axios.get("/api/hello").then((response) => {
          console.log(response);
        });
      }, []);

      const onClickHandler = () =>{
          axios.get('/api/users/logout')
          .then(response => {
              if(response.data.success){
                props.history.push("login")
              }
          })
      }

    return(
        <div style={{
            display: 'flex', flexDirection: 'column',justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>
            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default LandingPage