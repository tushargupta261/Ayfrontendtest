import axios from "axios";
import { toast } from "react-toastify";
import Router from "next/router";
import Payment from "../components/Payment/Payment";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getProductByCategoryId = async (categoryId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/product/category/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.log(error, "error");
  }
};

export const getProductById = async (Id) => {
  try {
    const response = await axios.get(`${baseUrl}/product/${Id}`);
    return response.data;
  } catch (error) {
    console.log(error, "hellomand");
    // throw ne(error?.error?.message || "Something went wrong");
  }
};

export const Login = async (data) => {
  try {
    const response = await axios.post(`${baseUrl}/user/login`, data);
    Router.push("/");
    return response.data;
  } catch (error) {
    console.log(error, "error");
    const errorMessage = error.response.data.error.message;
    toast(errorMessage);
  }
};

export const Signup = async (data) => {
  try {
    const response = await axios.post(`${baseUrl}/user/signup`, data);
    Router.push("/");
    return response.data;
  } catch (error) {
    const errorMessage = error.response.data.error.message;
    toast(errorMessage);
  }
};

export const saveShippingAddress = async (data, session) => {
  try {
    const response = await axios.post(`${baseUrl}/shipping-addresses`, data, {
      headers: {
        authorization: `Bearer ${session}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response.data.error.message;
    toast(errorMessage);
  }
};

export const getAllShippingAddress = async (session) => {
  try {
    const response = await axios.get(`${baseUrl}/shipping-addresses`, {
      headers: {
        authorization: `Bearer ${session}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response.data.error.message;
    console.log(errorMessage);
  }
};

export const createOrder = async (data, session) => {
  try {
    const response = await axios.post(`${baseUrl}/order`, data, {
      headers: {
        authorization: `Bearer ${session}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response.data.error.message;
    toast(errorMessage);
  }
};

export const createOrderItem = async (data, session) => {
  try {
    const response = await axios.post(
      `${baseUrl}/order-item/create-bulk`,
      data,
      {
        headers: {
          authorization: `Bearer ${session}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response.data.error.message;
    toast(errorMessage);
  }
};

export const updateOrder = async (orderId, data, session) => {
  try {
    const response = await axios.patch(`${baseUrl}/order/${orderId}`, data, {
      headers: {
        authorization: `Bearer ${session}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response.data.error.message;
    toast(errorMessage);
  }
};

export const fetchOrder = async (session) => {
  try {
    const response = await axios.get(`${baseUrl}/order`, {
      headers: {
        authorization: `Bearer ${session}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response.data.error.message;
   }
};

export const fetchOrderById = async (id,session) => {
  try {
    const response = await axios.get(`${baseUrl}/order/${id}`, {
      headers: {
        authorization: `Bearer ${session}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response.data.error.message;
   }
};

//for razorpay
export default function Home() {
  return (
    <div>
      <h1>Welcome to Razorpay Integration</h1>
      <Payment />
    </div>
  );
}
