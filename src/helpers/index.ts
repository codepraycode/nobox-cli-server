export interface AuthResponseDTO {
    link: string | null,
    processing: boolean,
    token: string | null,
    error?: string
}


export const AuthResponseTemplate:AuthResponseDTO = {
    link: null,
    processing: false,
    token: null,
}