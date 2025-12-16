export type ColorSideType = {
   neutral: string,
    up:string,
    down:string
} 

export type IconSideType = {
    neutral: React.ReactNode,
    up:React.ReactNode,
    down:React.ReactNode
}

export type AssetElementType = {
    
    id: string,
    class: string,
    exchange: string,
    symbol: string,
    name: string,
    status: string,
    tradable: boolean,
    marginable: boolean,
    maintenance_margin_requirement: number,
    margin_requirement_long: string,
    margin_requirement_short: string,
    shortable: boolean,
    easy_to_borrow: boolean,
    fractionable: boolean,
    attributes: []

}

export type DataType = {
  key: string;
  symbol: string;
  closePrice:number;
  openPrice:number;
  updatedAt: string;
}

export type EditDataObj = {
    formTypeEdit: boolean;
    oldSymbol: string;
}

export type ResponseObj = {
    msg: string;
    data: DataType[];
    code?:string;
}

export type ResponseGetLatestBarsObj = {
     msg:string,
     error: string,
     data: DataType
}