export interface cartInterface {
    customer_id : string,
    product_id : string,
    customer_name : string,
    customer_address : string,
    product_name : string,
    size : string,
    product_price : number,
    total_price : number,
    quantity : number,
    status : string,
    date : string,
    modeOfPayment : string,
    color : string,
    grouped_id : string,
    shippingFee : number,
    img : string
}

export interface getCartInterface {
    _id : string,
    customer_id : string,
    product_id : string,
    customer_name : string,
    customer_address : string,
    product_name : string,
    size : string,
    product_price : number,
    total_price : number,
    quantity : number,
    status : string,
    date : string,
    modeOfPayment : string,
    color : string,
    grouped_id : string,
    shippingFee : number,
    img : string
}