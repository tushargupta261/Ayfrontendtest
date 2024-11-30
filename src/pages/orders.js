import { useSession, signIn } from "next-auth/client";
import Order from "../components/Order/Order";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import Head from "next/head";
import userAuth from "../util/user-auth";
import { fetchOrder } from "../api";
import { useEffect, useState } from "react";

function Orders() {
  const [session, loading] = userAuth();
  const [orders, setOrders] = useState([{}]);

  const fetchUserOrder = async () => {
    const response = await fetchOrder(session);
    setOrders(response?.data);
  };
  useEffect(() => {
    fetchUserOrder();
  }, [session]);

  return (
    <>
      <Head>
        <title>Medical | Orders</title>
      </Head>
      <div className=" heightFix px-6">
        <main className="max-w-screen-xl mx-auto md:py-20 py-12 pb-20">
          <h1 className="sm:text-2xl text-xl font-semibold border-b-2 mb-2 pb-4 border-gray-200 text-gray-700 h-full">
            Medical{" "}
          </h1>
          {session ? (
            <>
              <h2 className="font-medium text-lg  my-2 text-blue-light">
                {orders ? (
                  <>
                    <span className="font-semibold text-xl mr-2">
                      {orders?.length}
                    </span>
                    Orders
                  </>
                ) : (
                  <Skeleton width={100} />
                )}
              </h2>
              {orders ? (
                orders.length ? (
                  <div className="mt-5 space-y-6">
                    {orders.map(
                      ({
                        _id,
                        id,
                        totalAmount,
                        orderItems,
                        orderDate,
                        orderStatus,
                      }) => (
                        <Order
                          key={`order-${_id}`}
                          id={id}
                          _id={_id}
                          totalAmount={totalAmount}
                          orderDate={orderDate}
                          orderItems={orderItems}
                          status={orderStatus}
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
          ) : (
            <>
              <div className="text-center sm:text-lg text-base  font-medium mt-12">
                <h2>
                  Please
                  <span
                    className="link underline text-blue-light mx-2"
                    onClick={signIn}
                  >
                    login
                  </span>
                  in to view your orders.
                </h2>
                <div className="md:max-w-none max-w-xs sm:w-auto w-3/4 mx-auto">
                  <Image
                    src="/img/authentication.svg"
                    width={450}
                    height={450}
                    alt=""
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default Orders;
