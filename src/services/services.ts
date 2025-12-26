
const headers = {
    accept: 'application/json',
    'APCA-API-KEY-ID': import.meta.env.VITE_APCA_API_KEY ?? "",
    'APCA-API-SECRET-KEY': import.meta.env.VITE_APCA_SECRET_KEY ?? ""
}

export const getAssetsByIdOrSymbol = async (symbol: string) => {
    const options = {
        method: 'GET',
        headers: headers
    };

    const res = await fetch(`${import.meta.env.VITE_APCA_PAPER_API_DOMAIN}/v2/assets/${symbol}`, options)
    return res.json()
}

export const getLatestBarsBySymbol = async (symbol: string) => {
    const options = {
        method: 'GET', 
        headers: headers
    };
    const res = await fetch(`${import.meta.env.VITE_APCA_DATA_API_DOMAIN}/v1beta3/crypto/us/latest/bars?symbols=${symbol}`, options)
    return res.json()
}