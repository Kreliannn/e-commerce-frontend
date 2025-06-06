export interface orderInterface {
    customer_id : string,
    customer_name : string,
    customer_address : string,
    product_name : string,
    size : string,
    product_price : string,
    total_price : number,
    quantity : number,
    status : string,
    date : string,
    modeOfPayment : string,
    product_id : string,
    color : string,
    grouped_id : string,
    shippingFee : number,
    img : string
}

export interface getOrderInterface {
    _id : string,
    customer_id : string,
    customer_name : string,
    customer_address : string,
    product_name : string,
    size : string,
    product_price : string,
    total_price : number,
    quantity : number,
    status : string,
    date : string,
    modeOfPayment : string,
    product_id : string,
    color : string,
    grouped_id : string,
    shippingFee : number,
    img : string
}