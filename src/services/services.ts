
export const getAssetsByIdOrSymbol = async (symbol: string) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'APCA-API-KEY-ID': 'PKY4SBTIAHLSZE4JF67M6JI6R3',
            'APCA-API-SECRET-KEY': '4edMoYBwhV4wPrZZptXzGhDCPJGZTPqy2GVMX8auao4C'
        }
    };

    const res = await fetch(`https://paper-api.alpaca.markets/v2/assets/${symbol}`, options)
    return res.json()
}

export const getLatestBarsBySymbol = async (symbol: string) => {
    const options = {
        method: 'GET', headers: {
            accept: 'application/json',
            'APCA-API-KEY-ID': 'PKY4SBTIAHLSZE4JF67M6JI6R3',
            'APCA-API-SECRET-KEY': '4edMoYBwhV4wPrZZptXzGhDCPJGZTPqy2GVMX8auao4C'

        }
    };
    const res = await fetch(`https://data.alpaca.markets/v2/stocks/bars/latest?symbols=${symbol}`, options)
    return res.json()
}