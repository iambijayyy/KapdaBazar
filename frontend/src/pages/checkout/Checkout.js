import React, { useState } from 'react'
import { Helmet } from 'react-helmet';
import { Input, Stack, Select, Image, Link } from "@chakra-ui/react"
import { RiShoppingCart2Line } from "react-icons/ri"
import './checkout.css'
import { saveAddressshipping, savepaymentmethod } from '../../actions/cartActions'
import { useDispatch, useSelector } from 'react-redux'

const Checkout = ({ history }) => {
    const cart = useSelector((state) => state.cart)

    const { shippingAddress } = cart



    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)
    const [Payment, setPayment] = useState('Card')

    const dispatch = useDispatch()
    const [carddetails, setcarddetails] = useState(true)
    const handleorder = (e) => {
        e.preventDefault()
        dispatch(saveAddressshipping({ address, city, postalCode, country }))
        dispatch(savepaymentmethod(Payment))
        history.push('/placeorder')

    }
    return (
        <div>
            <Helmet>
                <title>Checkout</title>
            </Helmet>

            <div className="limit-check">

                <div className="info-check">
                    <form onSubmit={handleorder}>
                        <div className="billing-check">
                            <h1>Billing Address</h1>
                            <label for="address" className="this-label">Address</label><br />
                            <Input variant="flushed" placeholder="Your Address" required value={address} id="address" onChange={(e) => setAddress(e.target.value)} /><br />
                            <label className="this-label">Country</label><br />
                            <Stack spacing={3}>

                                <Select variant="flushed" onChange={(e) => setCountry(e.target.value)} >
                                    <option value="Nepal">Nepal</option>
                                    <option value="USA">USA</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Spain">Spain</option>
                                </Select>

                            </Stack>
                            <div className="city-cp-check">
                                <div><label for="city" className="this-label">City</label>
                                    <Input variant="flushed" required placeholder="Your City" onChange={(e) => setCity(e.target.value)} id="city" /></div>
                                <div><label for="zip" className="this-label" >Zip</label>
                                    <Input variant="flushed" required placeholder="Your Zip" id="zip" onChange={(e) => setPostalCode(e.target.value)} /></div>
                            </div>
                        </div>

                        <div className="payment-check">
                            <h1>Payment Method</h1>

                            <input onChange={(e) => { setcarddetails(false); setPayment('Cash on Delivery') }} type="radio" name="payment" id="COD" /><label for="COD" className="this-label"> Cash On Delivery</label>
                            <Image src='https://i.imgur.com/HQNtmuL.jpg' alt="COD" width="100px" height="100px" />
                            <div class="confirm">
                                <input type="submit" className="confirm-check" value="Place to order" />
                            </div>
                        </div>
                    </form>
                    <div class="your-products">
                        {cart.cartItems.length === 0 ? <h1> <RiShoppingCart2Line size="29" />Cart(0)</h1> :
                            <>
                                <h1> <RiShoppingCart2Line size="29" />Cart({cart.cartItems.length})</h1>
                                <div className="cart-summ">
                                    {cart.cartItems.map((item, index) => (
                                        <p key={index}>{item.qty} X <Link to={`/product/${item.product}`}>{item.name}</Link> <b>${item.qty * item.price}</b></p>

                                    ))}
                                </div>
                            </>
                        }
                    </div>

                </div>



            </div>

        </div>
    )
}

export default Checkout
