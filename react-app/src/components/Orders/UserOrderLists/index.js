import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetUserOrders } from "../../../store/orders";
import OrderDetailPage from "../OrderDetailPage";
import CancelOrderButton from "../CancelOrderButton";

import "./UserOrderLists.css";

const UserOrderLists = ({ userId }) => {
  const dispatch = useDispatch();
  const { orders, sessionUser, isLoading, error } = useSelector((state) => ({
    orders: state.orders.orders.byId,
    sessionUser: state.session.user,
    isLoading: state.orders.isLoading,
    error: state.orders.error,
  }));
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    if (sessionUser?.id === userId && !Object.keys(orders).length && !error) {
      dispatch(thunkGetUserOrders(userId));
    }
  }, [dispatch, userId, orders, error, sessionUser]);

  const userOrders = Object.values(orders).filter(order => order?.user_id === sessionUser?.id);

  const handleOrderClick = (orderId) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
  };

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error loading orders: {error}</div>;
  }

    // if (!Object.keys(orders).length) {
    //   return <div className="no-order-found-div"><h1 className="no-order-found-h1">No orders found.</h1></div>;
    // }
  return (
    <div className="orderList-main-container">
      {userOrders?.length > 0 ? (
        userOrders?.map((order) => (
          <div key={order?.id} className="order-list-item" onClick={() => handleOrderClick(order?.id)}>
            <h2>Order #{order?.id}</h2>
            {selectedOrderId === order?.id && (
              <>
                <OrderDetailPage orderIdProp={order?.id} />
                {/* <CancelOrderButton orderId={order.id} /> */}
              </>
            )}
          </div>
        ))
      ) : (
        <div className="no-order-found-div"><h1 className="no-order-found-h1">No orders found.</h1></div>
      )}
    </div>
  );
};

//   return (
//     <div className="orderList-main-container">
//       {Object.values(orders).map((order) => (
//         <div key={order.id} className="order-list-item" onClick={() => handleOrderClick(order.id)}>
//           <h2>Order #{order.id}</h2>
//           {selectedOrderId === order.id && (
//             <>
//               <OrderDetailPage orderIdProp={order.id} />
//               {/* <CancelOrderButton orderId={order.id} /> */}
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

export default UserOrderLists;
