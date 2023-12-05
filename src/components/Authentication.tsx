'use client'
import { callback_client_id } from "@/constants";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CLI_API, NOBOX_CORE_URL } from "../../env/client";



const nobox_server_github_auth_api = `${NOBOX_CORE_URL}/auth/_/github`;
const cli_client_callback_url = `${CLI_API}/api/auth/github/callback`;


export const AuthRedirect = () => {
    const query = useSearchParams();

    const callback_client = query.get(callback_client_id);

    useEffect(()=>{

        if (!callback_client) return

        const redirect_url = new URL(nobox_server_github_auth_api);

        redirect_url.searchParams.append('callback_url', cli_client_callback_url)
        redirect_url.searchParams.append('callback_client', callback_client)

        redirect(redirect_url.toString())
    }, [callback_client])


    return null;
}
