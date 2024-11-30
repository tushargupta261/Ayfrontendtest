import Head from "next/head";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import userAuth from "../util/user-auth";
import { useEffect, useState } from "react";
import {
  createOrder,
  createOrderItem,
  getAllShippingAddress,
  saveShippingAddress,
  updateOrder,
} from "../api";
import Skeleton from "react-loading-skeleton";
import ShippingAddress from "../components/ShippingAddress";
import { useDispatch, useSelector } from "react-redux";
import { emptyCart, selectItems, selectTotal } from "../slices/cartSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const ShippingAddressSchema = Yup.object().shape({
  recipientName: Yup.string().required("Recipient Name is required"),
  addressLine1: Yup.string().required("Address Line 1 is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  postalCode: Yup.string().required("Postal Code is required"),
  //   country: Yup.string().required("Country is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  shippingAddressType: Yup.string().required(
    "shipping Address Type Number is required"
  ),
  email: Yup.string(),
});
function Address() {
  const [session] = userAuth();
  const [shippingAddress, setShippingAddress] = useState([{}]);
  const [addNew, setAddNew] = useState(false);
  const [defaultSelectedAddress, setDefaultSelectedAddress] = useState();
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const router = useRouter();
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({
    recipientName: "",
    addressLine1: "",
    addressLine2: "",
    email: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phoneNumber: "",
    isDefault: true,
    shippingAddressType: "",
  });

  const handleSubmit = async (values) => {
    const response = await saveShippingAddress(values, session);
    if (response) {
      setAddNew(false);
    }
  };
  const fetchShippingAddress = async () => {
    const response = await getAllShippingAddress(session);
    setShippingAddress(response?.data);
    if (response?.data.length == 0) {
      setAddNew(true);
    } else {
      const defaultAddress = response?.data.find((data) => data.isDefault);
      setDefaultSelectedAddress(defaultAddress?._id);
    }
  };

  const submitOrder = async () => {
    const modifyRef = items.map((data) => {
      return { productId: data._id, quantity: data.qty, price: data.price };
    });
    const orderResponse = await createOrder(
      { shippingAddress: defaultSelectedAddress },
      session
    );
    console.log(orderResponse, "orderResponse");
    if (!orderResponse) return;
    const orderItemResponse = await createOrderItem(modifyRef, session);
    if (!orderItemResponse) return;
    await updateOrder(
      orderResponse.data._id,
      { orderStatus: "pending" },
      session
    );
    dispatch(emptyCart());
    toast("Order placed successfully");
  };

  if (items.length == 0) {
    router.push("/");
  }

  useEffect(() => {
    fetchShippingAddress();
  }, [session, addNew]);
  return (
    <>
      <Head>
        <title>Address | Cart</title>
      </Head>
      <div className="bg-gray-100 py-10 md:px-6 heightFix">
        <main className="max-w-screen-xl mx-auto">
          <div className="grid grid-flow-row sm:grid-flow-col  my-6 shadow rounded-md">
            <div className=" flex flex-col  md:p-8  p-6  bg-white">
              <div className="flex border-b-2 border-gray-200 ">
                <h1 className="flex-1 sm:text-2xl text-xl  font-semibold pb-4 text-gray-700">
                  {shippingAddress?.length} Address
                </h1>
                <p
                  className="pb-4 text-gray-700 cursor-pointer"
                  onClick={() => {
                    setAddNew((x) => !x);
                  }}
                >
                  Add New
                </p>
              </div>
              <>
                <h2 className="font-medium text-lg  my-2 text-blue-light">
                  {shippingAddress ? <></> : <Skeleton width={100} />}
                </h2>
                {shippingAddress ? (
                  shippingAddress.length ? (
                    <div className="mt-5 space-y-6">
                      {shippingAddress.map(
                        ({
                          _id,
                          addressLine1,
                          postalCode,
                          isDefault,
                          shippingAddressType,
                          recipientName,
                        }) => (
                          <ShippingAddress
                            key={`cart-product-${_id}`}
                            _id={_id}
                            shippingAddressType={shippingAddressType}
                            addressLine1={addressLine1}
                            postalCode={postalCode}
                            isDefault={isDefault}
                            recipientName={recipientName}
                            defaultSelectedAddress={defaultSelectedAddress}
                            setDefaultSelectedAddress={
                              setDefaultSelectedAddress
                            }
                          />
                        )
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center mt-16 sm:w-auto w-3/4 mx-auto sm:max-w-xs ">
                      <Image
                        src="/img/empty.svg"
                        width={300}
                        height={300}
                        alt=""
                        objectFit="contain"
                      />
                    </div>
                  )
                ) : (
                  <Skeleton count={12} />
                )}
              </>
              {addNew == true ? (
                <Formik
                  initialValues={formValues}
                  validationSchema={ShippingAddressSchema}
                  onSubmit={handleSubmit}
                  // enableReinitialize
                >
                  {({ handleChange, handleBlur, setFieldValue, values }) => (
                    <Form className=" shadow rounded-md p-8 mt-5 space-y-6">
                      <div className="flex justify-between items-center">
                        <label className="flex block mb-2 text-sm font-medium text-gray-900 dark:text-white gap-2">
                          <Field
                            type="checkbox"
                            id="isDefault"
                            name="isDefault"
                            placeholder="John"
                            className="input"
                            value={values.isDefault}
                            checked={values.isDefault}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          Default
                        </label>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="recipientName"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Recipient Name
                          </label>
                          <Field
                            type="text"
                            id="recipientName"
                            name="recipientName"
                            placeholder="John"
                            className="input"
                            value={values.recipientName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <ErrorMessage
                            name="recipientName"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="phoneNumber"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Phone Number
                          </label>
                          <Field
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="+91 9319332479"
                            className="input"
                            value={values.phoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <ErrorMessage
                            name="phoneNumber"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Email address
                          </label>
                          <Field
                            type="email"
                            id="email"
                            name="email"
                            placeholder="john.doe@company.com"
                            className="input"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="postalCode"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Postal Code
                          </label>
                          <Field
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            placeholder="942421"
                            className="input"
                            value={values.postalCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <ErrorMessage
                            name="postalCode"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="addressLine1"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Address Line 1
                          </label>
                          <Field
                            type="text"
                            id="addressLine1"
                            name="addressLine1"
                            placeholder="1297 phase 5"
                            className="input"
                            value={values.addressLine1}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <ErrorMessage
                            name="addressLine1"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="addressLine2"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Address Line 2
                          </label>
                          <Field
                            type="text"
                            id="addressLine2"
                            name="addressLine2"
                            placeholder="1274 phase 5"
                            className="input"
                            value={values.addressLine2}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <ErrorMessage
                            name="addressLine2"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="state"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            State
                          </label>
                          <Field
                            type="text"
                            id="state"
                            name="state"
                            placeholder="Punjab"
                            className="input"
                            value={values.state}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <ErrorMessage
                            name="state"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="city"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            City
                          </label>
                          <Field
                            type="text"
                            id="city"
                            name="city"
                            placeholder="Mohali"
                            className="input"
                            value={values.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <ErrorMessage
                            name="city"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="shippingAddressType"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Select Address Type
                          </label>
                          <Field
                            as="select"
                            id="shippingAddressType"
                            name="shippingAddressType"
                            className="input"
                            value={values.shippingAddressType}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <option value="" label="Select type" />
                            <option value="home" label="Home" />
                            <option value="office" label="Office" />
                            <option value="other" label="Other" />
                          </Field>
                          <ErrorMessage
                            name="shippingAddressType"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <button type="submit" className="button">
                        Submit
                      </button>
                    </Form>
                  )}
                </Formik>
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-col  md:p-8  p-6  bg-white">
              <div className="w-full  bg-white shadow-lg rounded-lg p-6 mt-6 lg:mt-0">
                <h2 className="text-lg font-semibold mb-4">Price Summary</h2>
                <div className="space-y-4">
                  {/* Subtotal */}
                  {console.log(items, "itemsitems")}
                  {items.map((data) => {
                    return (
                      <div
                        key={data._id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-600">
                          {data.title} x {data.qty}
                        </span>
                        <span className="font-medium">
                          ${data.price * data.qty}
                        </span>
                      </div>
                    );
                  })}

                  {/* Taxes */}
                  {/* <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">$0</span>
                  </div>

                  Shipping
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div> */}

                  <hr className="border-t my-4" />

                  {/* Total */}
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className="text-gray-800">Total</span>
                    <span className="text-primary">${total}</span>
                  </div>

                  {/* Checkout Button */}
                  <button
                    className="w-full button"
                    onClick={() => {
                      submitOrder();
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Address;
