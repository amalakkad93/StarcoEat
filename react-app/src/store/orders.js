import { csrfFetch } from "./csrf";

// Action types
const ADD_ORDER = "orders/ADD_ORDER";
const SET_CREATED_ORDER = 'order/SET_CREATED_ORDER';
const SET_ORDERS = "orders/SET_ORDERS";
const REMOVE_ORDER = "orders/REMOVE_ORDER";
const UPDATE_ORDER = "orders/UPDATE_ORDER";
const SET_USER_ORDERS = "orders/SET_USER_ORDERS";
const SET_ORDER_DETAILS = "orders/SET_ORDER_DETAILS";
const REORDER_PAST_ORDER = "orders/REORDER_PAST_ORDER";
const SET_ORDER_ITEMS = "orders/SET_ORDER_ITEMS";
const CANCEL_ORDER = "orders/CANCEL_ORDER";

// Action creators
const actionAddOrder = (order) => ({
  type: ADD_ORDER,
  order,
});

// Action creator for setting the created order in the store
const setCreatedOrder = (order) => ({
  type: SET_CREATED_ORDER,
  payload: order,
});

const actionSetOrders = (orders) => ({
  type: SET_ORDERS,
  orders,
});

const actionRemoveOrder = (orderId) => ({
  type: REMOVE_ORDER,
  orderId,
});

const actionUpdateOrder = (orderId, status) => ({
  type: UPDATE_ORDER,
  orderId,
  status,
});

const actionSetUserOrders = (orders) => ({
  type: SET_USER_ORDERS,
  orders,
});

const actionSetOrderDetails = (orderDetails) => ({
  type: SET_ORDER_DETAILS,
  orderDetails,
});

const actionReorderPastOrder = (order) => ({
  type: REORDER_PAST_ORDER,
  order,
});

const actionSetOrderItems = (orderItems) => ({
  type: SET_ORDER_ITEMS,
  orderItems,
});

const actionCancelOrder = (orderId) => ({
  type: CANCEL_ORDER,
  orderId,
});

// Thunk to create an order
export const thunkCreateOrder = (userId, total_price, cartItems) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/orders/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        total_price,
        items: cartItems,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      dispatch(actionAddOrder(data));
      // Optionally, return the created order data.
      return data;
    } else {
      console.error("Error creating the order:", data.errors);
      // Handle your error dispatching here, e.g., actionSetOrderError
      // dispatch(actionSetOrderError(data.errors || "Error creating the order."));
      return data.errors;
    }
  } catch (error) {
    console.error("An error occurred while creating the order:", error);
    // Handle your error dispatching here, e.g., actionSetOrderError
    // dispatch(actionSetOrderError("An error occurred while creating the order."));
    return ["An error occurred while creating the order."];
  }
};

export const thunkCreateOrderFromCart = () => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/orders/create_order', {
      method: 'POST'
    });

    if (response.ok) {
      const order = await response.json();
      dispatch(setCreatedOrder(order));
      return order;  // Return the created order object
    } else {
      const errors = await response.json();
      console.error('Error creating order from shopping cart:', errors);
      return Promise.reject(errors.error);  // Reject promise with the error message
    }
  } catch (error) {
    console.error('An error occurred while creating the order:', error);
    return Promise.reject('An error occurred while creating the order.');  // Reject promise with the error message
  }
};

// Thunk to delete an order
export const thunkDeleteOrder = (orderId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/orders/${orderId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      dispatch(actionRemoveOrder(orderId));
    } else {
      const errors = await response.json();
      console.error(`Error deleting order ID ${orderId}:`, errors);
      // Handle your error dispatching here, if needed
    }
  } catch (error) {
    console.error(`An error occurred while deleting order ID ${orderId}:`, error);
    // Handle your error dispatching here, if needed
  }
};

// Thunk to update an order's status
export const thunkUpdateOrderStatus = (orderId, status) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      dispatch(actionUpdateOrder(orderId, status));
    } else {
      const errors = await response.json();
      console.error(`Error updating status for order ID ${orderId}:`, errors);
      // Handle your error dispatching here, if needed
    }
  } catch (error) {
    console.error(`An error occurred while updating status for order ID ${orderId}:`, error);
    // Handle your error dispatching here, if needed
  }
};

// Thunk to get user's orders
export const thunkGetUserOrders = (userId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/orders/user/${userId}`);
    if (response.ok) {
      const orders = await response.json();
      dispatch(actionSetUserOrders(orders));
      return orders;
    } else {
      const errors = await response.json();
      console.error(`Error fetching orders for user ID ${userId}:`, errors);
      // Handle your error dispatching here, if needed
    }
  } catch (error) {
    console.error(`An error occurred while fetching orders for user ID ${userId}:`, error);
    // Handle your error dispatching here, if needed
  }
};

// Thunk to reorder a past order
export const thunkReorderPastOrder = (orderId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/orders/${orderId}/reorder`, {
      method: 'POST',
    });
    if (response.ok) {
      const order = await response.json();
      dispatch(actionReorderPastOrder(order));
      return order;
    } else {
      const errors = await response.json();
      console.error(`Error reordering order ID ${orderId}:`, errors);
      // Handle your error dispatching here, if needed
    }
  } catch (error) {
    console.error(`An error occurred while reordering order ID ${orderId}:`, error);
    // Handle your error dispatching here, if needed
  }
};

// Thunk to get order items
export const thunkGetOrderItems = (orderId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/orders/${orderId}/items`);
    if (response.ok) {
      const orderItems = await response.json();
      dispatch(actionSetOrderItems(orderItems));
      return orderItems;
    } else {
      const errors = await response.json();
      console.error(`Error fetching items for order ID ${orderId}:`, errors);
      // Handle your error dispatching here, if needed
    }
  } catch (error) {
    console.error(`An error occurred while fetching items for order ID ${orderId}:`, error);
    // Handle your error dispatching here, if needed
  }
};

// Thunk to cancel an order
export const thunkCancelOrder = (orderId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/orders/${orderId}/cancel`, {
      method: 'POST',
    });
    if (response.ok) {
      dispatch(actionCancelOrder(orderId));
    } else {
      const errors = await response.json();
      console.error(`Error cancelling order ID ${orderId}:`, errors);
      // Handle your error dispatching here, if needed
    }
  } catch (error) {
    console.error(`An error occurred while cancelling order ID ${orderId}:`, error);
    // Handle your error dispatching here, if needed
  }
};

export const thunkGetOrderDetails = (orderId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/orders/${orderId}`);

    if (response.ok) {
      const orderDetails = await response.json();
      dispatch(actionSetOrderDetails(orderDetails));
      // Optionally, return the fetched order details.
      return orderDetails;
    } else {
      const errors = await response.json();
      console.error(`Error fetching details for order ID ${orderId}:`, errors);
      // Handle your error dispatching here, e.g., actionSetOrderError
      // dispatch(actionSetOrderError(errors.message || `Error fetching details for order ID ${orderId}.`));
    }
  } catch (error) {
    console.error(`An error occurred while fetching details for order ID ${orderId}:`, error);
    // Handle your error dispatching here, e.g., actionSetOrderError
    // dispatch(actionSetOrderError(`An error occurred while fetching details for order ID ${orderId}.`));
  }
};


// Initial state
const initialState = {
  orders: {},
  orderItems: {},
  menuItems: {},
};

// Reducer
export default function ordersReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ORDER: {
      const { order } = action;
      return {
        ...state,
        orders: {
          ...state.orders,
          [order.id]: order,
        },
      };
    }

    case SET_ORDERS: {
      const { orders } = action;
      return {
        ...state,
        orders: {
          ...state.orders,
          ...orders.byId,
        },
        orderItems: {
          ...state.orderItems,
          ...orders.orderItems.byId,
        },
        menuItems: {
          ...state.menuItems,
          ...orders.menuItems.byId,
        },
      };
    }
    case SET_CREATED_ORDER:
      return {
        ...state,
        createdOrder: action.payload,
      };
    case REMOVE_ORDER: {
      const { orderId } = action;
      const newOrders = { ...state.orders };
      delete newOrders[orderId];
      return {
        ...state,
        orders: newOrders,
      };
    }

    case UPDATE_ORDER: {
      const { orderId, status } = action;
      return {
        ...state,
        orders: {
          ...state.orders,
          [orderId]: {
            ...state.orders[orderId],
            status,
          },
        },
      };
    }
    case SET_USER_ORDERS: {
      const { orders } = action;
      return {
        ...state,
        orders: {
          ...state.orders,
          ...orders.entities.orders.byId,
        },
      };
    }
    case SET_ORDER_DETAILS: {
      const { orderDetails } = action;
      return {
        ...state,
        orders: {
          ...state.orders,
          [orderDetails.order.id]: orderDetails.order,
        },
        orderItems: {
          ...state.orderItems,
          ...orderDetails.orderItems.byId,
        },
        menuItems: {
          ...state.menuItems,
          ...orderDetails.menuItems.byId,
        },
      };
    }
    case REORDER_PAST_ORDER: {
      const { order } = action;
      return {
        ...state,
        orders: {
          ...state.orders,
          [order.id]: order,
        },
      };
    }
    case SET_ORDER_ITEMS: {
      const { orderItems } = action;
      return {
        ...state,
        orderItems: {
          ...state.orderItems,
          ...orderItems.byId,
        },
      };
    }
    case CANCEL_ORDER: {
      const { orderId } = action;
      return {
        ...state,
        orders: {
          ...state.orders,
          [orderId]: {
            ...state.orders[orderId],
            status: "Cancelled",
          },
        },
      };
    }

    default:
      return state;
  }
}