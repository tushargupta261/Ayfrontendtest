import { useEffect, useState } from "react";
import moment from "moment";
import Currency from "react-currency-formatter";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import OrderItem from "../../components/Order/OrderItem";
import { useSession } from "next-auth/client";
import axios from "axios";
import NormalToast from "../../util/Toast/NormalToast";
import { useRouter } from "next/router";
import { fetchOrderById } from "../../api";
import userAuth from "../../util/user-auth";

function OrderDetails({ id, admin }) {
  const router = useRouter();
  const [session, loading] = userAuth();
  const [disabled, setDisabled] = useState(false);
  const [order, setOrder] = useState();

  const updateStatus = (e) => {
    setDisabled(true);
    axios
      .post("/api/admin/update-order-status", {
        status: e.target.value,
        _id: id,
      })
      .then(() => {
        setDisabled(false);
      })
      .catch((err) => {
        setDisabled(false);
        console.error(err);
      });
  };

  const cancelOrder = () => {
    setDisabled(true);
    axios
      .post("/api/cancel-order", { status: "cancelled", _id: id })
      .then(() => {
        NormalToast("Order cancelled");
        setDisabled(false);
      })
      .catch((err) => {
        console.error(err);
        NormalToast("Something went wrong", true);
        setDisabled(false);
      });
  };

  const fetchUserOrderById = async () => {
    const response = await fetchOrderById(id, session);
    setOrder(response?.data);
  };
  useEffect(() => {
    fetchUserOrderById();
  }, [session]);

  return (
    <div className="heightFix sm:px-6">
      <div className="border rounded-md max-w-screen-xl  mx-auto md:my-20 my-12 shadow-sm">
        <div className="flex items-center p-5 bg-gray-100 text-sm text-gray-700">
          <div>
            <p className="sm:text-2xl text-xl font-semibold mb-2">
              Order Details
            </p>
            <p className="xs:text-sm text-xs">
              {order ? moment(order?.orderDate).format("llll") : <Skeleton />}
            </p>
          </div>
          {order && (
            <p className="lg:text-xl md:text-lg text-base font-medium whitespace-nowrap  self-end flex-1 text-right text-blue-500">
              {order?.orderItems?.length} items
            </p>
          )}
        </div>
        <div className="p-5 md:p-10 sm:p-8">
          {order ? (
            <>
              {admin &&
              session?.admin &&
              order?.orderStatus !== "cancelled" &&
              order?.orderStatus !== "delivered" ? (
                <select
                  className="shadow leading-tight focus:outline-none focus:shadow-outline border xs:text-sm text-xs p-2 rounded bg-blue-500 text-white capitalize"
                  value={order?.orderStatus}
                  disabled={disabled}
                  // onChange={updateStatus}
                >
                  <option value="shipping soon">Shipping soon</option>
                  <option value="shipped">Shipped</option>
                  <option value="out for delivery">Out for delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              ) : (
                <></>
              )}
              <div className="space-y-6 lg:text-lg sm:text-base text-sm">
                <div
                  className={`my-2 p-4 border-2 ${
                    order?.orderStatus === "cancelled"
                      ? "text-red-500 border-red-500 bg-red-100"
                      : order?.orderStatus === "delivered"
                      ? "text-green-500 border-green-500 bg-green-100"
                      : "text-blue-500 border-blue-500 bg-blue-100"
                  }  rounded-md`}
                >
                  <h1 className="font-semibold mb-4">Order Status</h1>
                  <span className="sm:text-sm text-xs font-medium capitalize">
                    {order.orderStatus}
                  </span>
                </div>
                {order?.orderStatus === "cancelled" ? (
                  <p className="my-2 text-xs xs:text-sm text-red-500">
                    * Money will be refunded within 24 hour
                  </p>
                ) : (
                  <></>
                )}

                <p className="whitespace-nowrap font-semibold overflow-x-auto hideScrollBar">
                  ORDER ID -
                  <span className="text-green-500 font-medium ml-2">
                    {order?._id}
                  </span>
                </p>
                <p className="font-semibold whitespace-nowrap overflow-x-auto hideScrollBar flex items-center">
                  EMAIL -
                  <span className="text-sm font-normal ml-2">
                    {order?.customer_details?.email}
                  </span>
                </p>
                <div>
                  <h3 className="font-semibold mb-2 uppercase">Address </h3>
                  <div className="text-sm text-gray-700">
                    <p>
                      <span className="font-semibold"> Name - </span>
                      {order?.shipping?.name}
                    </p>
                    <p>
                      <span className="font-semibold">City - </span>
                      {order?.shipping?.address?.city}
                    </p>
                    <p>
                      <span className="font-semibold">Country - </span>
                      {order?.shipping?.address?.country}
                    </p>
                    <p>
                      <span className="font-semibold">Line 1 - </span>
                      {order?.shipping?.address?.line1},
                    </p>
                    <p>
                      <span className="font-semibold">Line 2 - </span>
                      {order?.shipping?.address?.line2}
                    </p>
                    <p>
                      <span className="font-semibold">Postal Code - </span>
                      {order?.shipping?.address?.postal_code}
                    </p>
                    <p>
                      <span className="font-semibold">State - </span>
                      {order?.shipping?.address?.state}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2  uppercase">Amount</h3>
                  <div className="text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Subtotal - </span>
                      <Currency
                        quantity={order?.amount_subtotal / 100}
                        currency="INR"
                      />
                    </p>
                    <p className="text-green-500 font-semibold">
                      <span>Shipping - </span>
                      <Currency
                        quantity={order?.total_details?.amount_shipping / 100}
                        currency="INR"
                      />
                    </p>
                    <p className="font-bold text-red-500">
                      <span className="font-semibold">Total - </span>
                      <Currency
                        quantity={order?.amount_total / 100}
                        currency="INR"
                      />
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2  uppercase">Items </h4>
                  {order?.orderItems?.map((item, index) => {
                    console.log(item, "item");
                    return (
                      <OrderItem
                        item={item}
                        key={`order-item${item?._id}${index}`}
                      />
                    );
                  })}
                </div>
                {order?.orderStatus &&
                order?.orderStatus !== "cancelled" &&
                order?.orderStatus !== "delivered" ? (
                  <div className="py-4">
                    <button
                      className={`button-red py-2 px-12 capitalize w-full sm:text-base text-sm ${
                        disabled ? "opacity-50" : ""
                      }`}
                      // onClick={cancelOrder}
                      disabled={disabled}
                    >
                      Cancel Order
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </>
          ) : (
            <Skeleton count={30} />
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
