import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetUserOrders } from "../../../store/orders";
import OrderDetailPage from "../OrderDetailPage";
import OpenModalButton from "../../Modals/OpenModalButton";
import CancelOrderButton from "../CancelOrderButton";
import ReorderComponent from "../ReorderComponent";
import { useNavigate } from "react-router-dom";

import "./UserOrderLists.css";

const UserOrderLists = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, sessionUser, isLoading, error} = useSelector((state) => ({
    orders: state.orders.orders.byId,
    sessionUser: state.session.user,
    isLoading: state.orders.isLoading,
    error: state.orders.error,
  }));

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [fetched, setFetched] = useState(false);

  console.log("🚀 ~ file: index.js:25 ~ useEffect ~ sessionUser.id:", sessionUser.id)
   useEffect(() => {
    if (sessionUser?.id && !Object.keys(orders).length && !error && !fetched) {
      dispatch(thunkGetUserOrders(sessionUser.id));
    }
  }, [dispatch, sessionUser, orders, error, fetched]);

  const userOrders = Object.values(orders).filter(order => order?.user_id === sessionUser?.id);


  const handleOrderClick = (orderId) => {
    // setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
    navigate(`/orders/${orderId}`);
  };

  if (isLoading) return <div>Loading orders...</div>;
  // if (error) return <div>Error loading order lists: {error}</div>;
  if (!sessionUser) return <div>Please log in to view your orders.</div>;
  if (!userOrders.length) {
    return <div className="no-order-found-div"><h1 className="no-order-found-h1">No orders found.</h1></div>;
  }

  return (
    <div className="orderList-main-container">
      {userOrders.map((order) => (
        <>
          <div key={order?.id} className="order-list-item" onClick={() => handleOrderClick(order?.id)}>
            <h2>Order #{order.id}</h2>
            {selectedOrderId === order?.id && <OrderDetailPage orderIdProp={order?.id} />}
              {/* <ReorderComponent orderId={order?.id} /> */}
          </div>

        </>
      ))}
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { thunkGetUserOrders } from "../../../store/orders";
// import OrderDetailPage from "../OrderDetailPage";
// import CancelOrderButton from "../CancelOrderButton";

// import "./UserOrderLists.css";


// const UserOrderLists = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { orders, sessionUser, isLoading, error } = useSelector((state) => ({
//     orders: state.orders.orders.byId,
//     sessionUser: state.session.user,
//     isLoading: state.orders.isLoading,
//     error: state.orders.error,
//   }));

//   const [selectedOrderId, setSelectedOrderId] = useState(null);
//   const [fetched, setFetched] = useState(false);

//    useEffect(() => {
//     if (sessionUser?.id && !Object.keys(orders).length && !error && !fetched) {
//       dispatch(thunkGetUserOrders(sessionUser.id));
//     }
//   }, [dispatch, sessionUser, orders, error, fetched]);

//   const userOrders = Object.values(orders).filter(order => order?.user_id === sessionUser?.id);


//   const handleOrderClick = (orderId) => {
//     // navigate(`/orders/${orderId}`);
//     setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
//   };

//   if (isLoading) return <div>Loading orders...</div>;
//   if (error) return <div>Error loading orders: {error}</div>;
//   if (!sessionUser) return <div>Please log in to view your orders.</div>;
//   if (!userOrders.length) {
//     return <div className="no-order-found-div"><h1 className="no-order-found-h1">No orders found.</h1></div>;
//   }

//   return (
//     <div className="orderList-main-container">
//       {userOrders.map((order) => (
//         <div key={order?.id} className="order-list-item" onClick={() => handleOrderClick(order?.id)}>
//           <h2>Order #{order.id}</h2>
//           {selectedOrderId === order?.id && <OrderDetailPage orderIdProp={order?.id} />}
//         </div>
//       ))}
//     </div>
//   );
// }



export default UserOrderLists;
