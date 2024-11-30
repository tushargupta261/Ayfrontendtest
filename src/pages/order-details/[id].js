import { useRouter } from "next/router";
import OrderDetails from "../../components/Order/OrderDetails";
import Head from "next/head";
function orderDetails() {
  const router = useRouter();
  // const fetchOrderById = async () => {
  //   const response = await fetchOrderById(id, session);
  //   setOrder(response?.data);
  // };
  // useEffect(() => {
  //   fetchOrderById();
  // }, [session]);

  return (
    <>
      <Head>
        <title>Medical | OrderDetails</title>
      </Head>
      <OrderDetails id={router.query?.id} />
    </>
  );
}

// orderDetails.auth = true;
export default orderDetails;
