'use client'
import { CLI_API, NOBOX_CORE_URL } from "@/utils/env";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";



const nobox_server_github_auth_api = `${NOBOX_CORE_URL}/auth/_/github`;
const cli_client_callback_url = `${CLI_API}/api/auth/github/callback`;

// console.log(process.env.NEXT_PUBLIC_NOBOX_CORE_URL)

export const AuthRedirect = () => {
    const query = useSearchParams();

    const callback_client = query.get('cid');

    useEffect(()=>{

        if (!callback_client) return

        const redirect_url = new URL(nobox_server_github_auth_api);

        redirect_url.searchParams.append('callback_url', cli_client_callback_url)
        redirect_url.searchParams.append('callback_client', callback_client)

        redirect(redirect_url.toString())
    }, [callback_client])


    return null;
}
