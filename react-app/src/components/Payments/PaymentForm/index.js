import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { thunkCreatePayment } from "../../../store/payments";
import { thunkCreateOrderFromCart } from "../../../store/orders";
import { thunkClearCart } from "../../../store/shoppingCarts";
import "./PaymentForm.css";

function PaymentForm({
  totalWithDeliveryCost,
  deliveryCost,
  totalAmount,
  onSubmit
  // onPaymentSubmit,
  // onOrderCreation,
  // onNext,

}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [gateway, setGateway] = useState("Stripe");

  const [paymentFormData, setPaymentFormData] = useState({
    cardholder_name: "Anas Alakkad",
    card_number: "4242424242424242",
    card_expiry_month: "12",
    card_expiry_year: "34",
    card_cvc: "123",
    postal_code: "91784",
    // cardholderName: "",
    // cardNumber: "",
    // expiryMonth: "",
    // expiryYear: "",
    // cvc: "",
    // postalCode: "",
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
    console.log("🚀🚀🚀🚀🚀🚀🚀 ~ **PaymentForm** ~ handleSubmit ~ paymentFormData:", paymentFormData)
    // const paymentSuccess = await onPaymentSubmit({
    //   gateway: gateway,
    //   cardholder_name: paymentFormData.cardholder_name,
    //   card_number: paymentFormData.card_number,
    //   card_expiry_month: paymentFormData.card_expiry_month,
    //   card_expiry_year: paymentFormData.card_expiry_year,
    //   card_cvc: paymentFormData.card_cvc,
    //   postal_code: paymentFormData.postal_code

    // });
    const paymentData = {
      gateway,
      ...paymentFormData,
      amount: totalWithDeliveryCost,
    };
    onSubmit(paymentData); 
    // const paymentSuccess = await onPaymentSubmit(paymentData);
    // if (paymentSuccess) onOrderCreation();
    // else console.error("Payment failed");
  };

  return (
    <div className="PaymentForm">
      <form onSubmit={handleSubmit}>
        <select value={gateway} onChange={(e) => setGateway(e.target.value)}>
          <option value="Stripe">Stripe</option>
          <option value="PayPal">PayPal</option>
          <option value="Credit Card">Credit Card</option>
        </select>

        {gateway === "Credit Card" && (
          <>
            <input
              name="cardholder_name"
              type="text"
              value={paymentFormData.cardholder_name}
              onChange={handleChange}
              placeholder="Cardholder Name"
            />
            <input
              name="card_number"
              type="text"
              value={paymentFormData.card_number}
              onChange={handleChange}
              placeholder="Card Number"
            />
            <input
              name="card_expiry_month"
              type="text"
              value={paymentFormData.card_expiry_month}
              onChange={handleChange}
              placeholder="Expiry Month (MM)"
            />
            <input
              name="card_expiry_year"
              type="text"
              value={paymentFormData.card_expiry_year}
              onChange={handleChange}
              placeholder="Expiry Year (YYYY)"
            />
            <input
              name="card_cvc"
              type="text"
              value={paymentFormData.card_cvc}
              onChange={handleChange}
              placeholder="CVC"
            />
            <input
              name="postal_code"
              type="text"
              value={paymentFormData.postal_code}
              onChange={handleChange}
              placeholder="Postal Code"
            />
          </>
        )}
        <div className="amounts-div">
          <p>Subtotal: ${totalAmount?.toFixed(2)}</p>
          <p>Delivery Fee: ${deliveryCost?.toFixed(2)}</p>
          <p>Total with Delivery: ${totalWithDeliveryCost?.toFixed(2)}</p>
        </div>

        <button type="submit">Confirm Payment</button>
      </form>
    </div>
  );
}

export default PaymentForm;
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { NavLink, useNavigate } from "react-router-dom";
// import { thunkCreatePayment } from "../../../store/payments";
// import { thunkCreateOrderFromCart } from "../../../store/orders";
// import { thunkClearCart } from "../../../store/shoppingCarts";
// import "./PaymentForm.css";

// function PaymentForm({
//   totalWithDeliveryCost,
//   deliveryCost,
//   totalAmount,
//   onSubmit,
//   // onNext,

// }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [gateway, setGateway] = useState("Stripe");

//   const [paymentFormData, setPaymentFormData] = useState({
//     cardholder_name: "Anas Alakkad",
//     card_number: "4242424242424242",
//     card_expiry_month: "12",
//     card_expiry_year: "34",
//     card_cvc: "123",
//     postal_code: "91784",
//     // cardholderName: "",
//     // cardNumber: "",
//     // expiryMonth: "",
//     // expiryYear: "",
//     // cvc: "",
//     // postalCode: "",
//   });



//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPaymentFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit =  async (e) => {
//     e.preventDefault();
//     console.log("🚀🚀🚀🚀🚀🚀🚀 ~ **PaymentForm** ~ handleSubmit ~ paymentFormData:", paymentFormData)
//     onSubmit({
//       gateway: gateway,
//       cardholder_name: paymentFormData.cardholder_name,
//       card_number: paymentFormData.card_number,
//       card_expiry_month: paymentFormData.card_expiry_month,
//       card_expiry_year: paymentFormData.card_expiry_year,
//       card_cvc: paymentFormData.card_cvc,
//       postal_code: paymentFormData.postal_code

//     });
//   };

//   return (
//     <div className="PaymentForm">
//       <form onSubmit={handleSubmit}>
//         <select value={gateway} onChange={(e) => setGateway(e.target.value)}>
//           <option value="Stripe">Stripe</option>
//           <option value="PayPal">PayPal</option>
//           <option value="Credit Card">Credit Card</option>
//         </select>

//         {gateway === "Credit Card" && (
//           <>
//             <input
//               name="cardholder_name"
//               type="text"
//               value={paymentFormData.cardholder_name}
//               onChange={handleChange}
//               placeholder="Cardholder Name"
//             />
//             <input
//               name="card_number"
//               type="text"
//               value={paymentFormData.card_number}
//               onChange={handleChange}
//               placeholder="Card Number"
//             />
//             <input
//               name="card_expiry_month"
//               type="text"
//               value={paymentFormData.card_expiry_month}
//               onChange={handleChange}
//               placeholder="Expiry Month (MM)"
//             />
//             <input
//               name="card_expiry_year"
//               type="text"
//               value={paymentFormData.card_expiry_year}
//               onChange={handleChange}
//               placeholder="Expiry Year (YYYY)"
//             />
//             <input
//               name="card_cvc"
//               type="text"
//               value={paymentFormData.card_cvc}
//               onChange={handleChange}
//               placeholder="CVC"
//             />
//             <input
//               name="postal_code"
//               type="text"
//               value={paymentFormData.postal_code}
//               onChange={handleChange}
//               placeholder="Postal Code"
//             />
//           </>
//         )}
//         <div className="amounts-div">
//           <p>Subtotal: ${totalAmount?.toFixed(2)}</p>
//           <p>Delivery Fee: ${deliveryCost?.toFixed(2)}</p>
//           <p>Total with Delivery: ${totalWithDeliveryCost?.toFixed(2)}</p>
//         </div>

//         <button type="submit">Confirm Payment</button>
//       </form>
//     </div>
//   );
// }

// export default PaymentForm;