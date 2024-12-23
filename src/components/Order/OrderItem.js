import Image from "next/image";
import Link from "next/link";
import Currency from "react-currency-formatter";
import { useRouter } from "next/router";

function OrderItem({ item }) {
  console.log(item, "item");
  const router = useRouter();
  return (
    <div className="flex sm:flex-row flex-col-reverse my-4 text-sm text-gray-700 p-6 border border-gray-200 sm:justify-between gap-6">
      <div>
        <span className="link font-semibold capitalize">
          <p>{item?.product[0].name}</p>
        </span>
        <div className="mt-2">
          <p>
            <span>Quantity - </span>
            {item?.quantity}
          </p>
          <p className="font-semibold">
            <span className="font-normal">Price - </span>
            <Currency quantity={item?.price} currency="INR" />
          </p>
        </div>
      </div>
      <div className="sm:mx-0 sm:ml-6 min-w-max my-auto mx-auto">
        <Image
          src={item?.product[0].image || "/img/fallback-image.svg"}
          width={120}
          height={120}
          alt=""
          objectFit="contain"
          className="cursor-pointer"
          onClick={() => {
            router.push(`/product-details/${item?._id}`);
          }}
        />
      </div>
    </div>
  );
}

export default OrderItem;
