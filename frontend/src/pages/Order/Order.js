import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdDoneAll } from 'react-icons/io';
import HashLoader from "react-spinners/HashLoader";
import { getOrderDetails, deliverOrder } from "../../actions/orderActions";
import './Order.css';
import { Button } from '@chakra-ui/button';

const Order = ({ match, history }) => {
  const [loadingDeliver, setLoadingDeliver] = useState(false);

  const orderId = match.params.id;
  const dispatch = useDispatch();
  const orderDetails = useSelector(state => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }

    if (!order || order._id !== orderId) {
      dispatch(getOrderDetails(orderId));
    }

  }, [dispatch, orderId, userInfo, history]);

  const deliverHandler = () => {
    alert("Item Delivered")
    setLoadingDeliver(true);
    dispatch(deliverOrder(order));
    setLoadingDeliver(false);
  };

  return loading || loadingDeliver ? (
    <div className='loading-product'>
      <HashLoader color={"#1e1e2c"} loading={loading || loadingDeliver} size={50} />
    </div>
  ) : error ? (
    <h1>{error}</h1>
  ) : (
    <div className="placeorder">
      <Helmet>
        <title>ORDER</title>
      </Helmet>
      <div className="informations-placeorder">
        <div className="shipping-placeorder">
          <h2>Shipping</h2>
          <p>
            <strong>Name: </strong>
            {order.user.name}
          </p>
          <p>
            <strong> Email: </strong>
            <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
          </p>
          <p>
            <strong>Address: </strong>
            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            {order.isDelivered ? <div className='paid'>Delivered at {order.deliveredAt}</div> : <div className='notpaid'>NOT Delivered YET</div>}
          </p>
        </div>
        <hr className='hr' />
        <div>
          <h2>Order Items: </h2>
          {order.orderItems.length === 0 ? <p>Your order is empty</p> :
            <div className="orders-placeorder">
              {order.orderItems.map((item, index) => (
                <p key={index}><span className="color-name"><Link to={`/product/${item.product}`}>{item.name}</Link></span> <b>{item.qty} x ${item.price} = ${item.qty * item.price}</b><hr className='hr' /></p>
              ))}
            </div>
          }
        </div>
      </div>
      <div className="your-products">
        <div className="cart-summ">
          <h1>Order Summary</h1>
          <div className="calculs-placeorder">
            <h3>Items: </h3><p>${order.itemsPrice}</p>
            <h3>Shipping: </h3><p>${order.shippingPrice}</p>
            <h3>Tax: </h3><p>${order.taxPrice}</p>
            <h3>Total: </h3><p>${order.totalPrice}</p>
          </div>
        </div>
        <div className='bottominfos'>
          <h1 className='orderid'>Order : {order._id}</h1>
          {!order.isPaid && (
            <>
              {!userInfo.isAdmin ? (
                <p>Item Ordered Successfully, Your Item will be Delivered Soon</p>
              ) : (
                <Button
                  height="40px"
                  width="200px"
                  size="lg"
                  onClick={deliverHandler}
                  leftIcon={<IoMdDoneAll size='16' />}
                  colorScheme='blue'
                >
                  DELIVERED
                </Button>
              )}
            </>
          )}
          {order.isDelivered ? (
            <div className='paid'>
              <IoMdDoneAll size='16' />
              <p>ORDER DELIVERED</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Order;
