import { getOrderInterface } from "../types/order.types";


export const addFeeBasedOnSize = ( price : number, size : string ) => {
    let currentPrice = price
    switch(size)
    {
        case "l": 
            currentPrice += 10 
        break;

        case "xl": 
            currentPrice += 20 
        break;

        case "xxl": 
            currentPrice += 30 
        break;

        case "xxl": 
            currentPrice += 40 
        break;
    }
    return currentPrice
}


export const getShippingFee = ( quantity : number  ) => {
    let fee = 0
    if(quantity == 0) fee = 0
    else if(quantity >= 50) fee = 200
    else if(quantity >= 33) fee = 160
    else if(quantity >= 20) fee = 120
    else fee = 70
    
    return fee
}

export const checkIFOutOFStock = ( stocks : number[] ) => {
    let stockNum = 0
    stocks.forEach((item) => {
        if(item == 0) stockNum++
    })
    if(stockNum == 7) return "Out Of Stock"
    else return "Available Size"
}







export function getMonthName(monthNumber: string): string | undefined {
    const months: { [key: string]: string } = {
      "01": "January",
      "02": "February",
      "03": "March",
      "04": "April",
      "05": "May",
      "06": "June",
      "07": "July",
      "08": "August",
      "09": "September",
      "10": "October",
      "11": "November",
      "12": "December",
      "all": "January - December",
    };
  
    return months[monthNumber];
  }
  
  export const getTotalSales = (orders : getOrderInterface[]) => {
    let totalSales = 0
    orders.forEach((item) => {
      totalSales += item.total_price
    })
    return totalSales
  }
  