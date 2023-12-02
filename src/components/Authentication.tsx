'use client'
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";



const SERVER_API = "http://localhost:8000/auth/_/github";
const callback_url = "http://localhost:3001/api/auth/github/callback"

export const AuthRedirect = () => {
    const query = useSearchParams();

    const cid = query.get('cid');
    // const callback_url = `${authenticated_page_url}?cid=${cid}`


    useEffect(()=>{
        redirect(`${SERVER_API}?callback_url=${callback_url}&&callback_client=${cid}`)
    }, [])


    return null;
}

export const ParseAuthenticationString = () => {

    const query = useSearchParams();

    console.log(query.get('token'));


    return null;
}