import React,{ useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function(SpecificComponent, option, adminRoute = null){
    function AuthenticationCheck(props){
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
                // console.log(response)

                //로그인 하지 않은 상태
                if(!response.payload.isAuth){
                    if(option){
                        props.history.push('/login')
                    }
                }else{
                    //로그인
                    //관리자 권한 체크
                    if(adminRoute && !response.payload.isAdmin){
                        props.history.push('/')
                    }else{
                        //로그인 유저가 접근 불가능한 페이지
                        if(option === false){
                            props.history.push('/')
                        }
                    }
                }
            })

        }, [])

        return(
            <SpecificComponent />
        )
    }

    return AuthenticationCheck
}