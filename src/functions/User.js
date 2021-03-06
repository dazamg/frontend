import axios from 'axios'

export const userCart = async(cart, authToken) => 
    await axios.post(`${process.env.REACT_APP_API}/user/cart`, {cart},
    {
        headers: {
            authToken,
        },
    });
    
export const getUserCart = async(authToken) => 
    await axios.get(`${process.env.REACT_APP_API}/user/cart`,
    {
        headers: {
            authToken,
        },
    });

export const emptyUserCart = async(authToken) => 
    await axios.delete(`${process.env.REACT_APP_API}/user/cart`,
    {
        headers: {
            authToken,
        },
    });

export const saveAddressInCart = async(authToken, address) => 
    await axios.post(`${process.env.REACT_APP_API}/user/address`, {address},
    {
        headers: {
            authToken,
        },
    });