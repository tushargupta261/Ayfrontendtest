import { useState } from "react";

function Payment() {
  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      // 1. Create an order on the server
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const order = await res.json();

      // 2. Configure Razorpay Checkout options
      const options = {
        key: "YOUR_KEY_ID", // Replace with your Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: "Your Company Name",
        description: "Test Transaction",
        order_id: order.id, // Order ID from the server
        handler: function (response) {
          alert("Payment successful!");
          alert("Payment ID: " + response.razorpay_payment_id);
          alert("Order ID: " + response.razorpay_order_id);
          alert("Razorpay Signature: " + response.razorpay_signature);
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // 3. Open Razorpay Checkout
      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("There was an error processing your payment.");
    }
  };

  return (
    <div>
      <h2>Enter Payment Amount</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in INR"
      />
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
}

export default Payment;