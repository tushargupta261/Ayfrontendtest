import { useState } from "react";

function XpressbeesOrderForm() {
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    orderId: "",
    codAmount: 0,
    weight: 0.5,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/xpressbees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderDetails }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Order created successfully!");
      console.log("Xpressbees Response:", result);
    } else {
      alert("Failed to create order!");
      console.error("Error:", result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={orderDetails.name}
        onChange={(e) => setOrderDetails({ ...orderDetails, name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={orderDetails.address}
        onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Phone"
        value={orderDetails.phone}
        onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="City"
        value={orderDetails.city}
        onChange={(e) => setOrderDetails({ ...orderDetails, city: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="State"
        value={orderDetails.state}
        onChange={(e) => setOrderDetails({ ...orderDetails, state: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Pincode"
        value={orderDetails.pincode}
        onChange={(e) => setOrderDetails({ ...orderDetails, pincode: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Order ID"
        value={orderDetails.orderId}
        onChange={(e) => setOrderDetails({ ...orderDetails, orderId: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="COD Amount (0 if not applicable)"
        value={orderDetails.codAmount}
        onChange={(e) => setOrderDetails({ ...orderDetails, codAmount: e.target.value })}
      />
      <input
        type="number"
        placeholder="Weight (kg)"
        value={orderDetails.weight}
        onChange={(e) => setOrderDetails({ ...orderDetails, weight: e.target.value })}
      />
      <button type="submit">Create Order</button>
    </form>
  );
}

export default XpressbeesOrderForm;