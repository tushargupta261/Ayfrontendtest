import { PencilAltIcon } from "@heroicons/react/solid";
import Fade from "react-reveal/Fade";

function ShippingAddress({
  _id,
  shippingAddressType,
  addressLine1,
  postalCode,
  isDefault,
  recipientName,
  defaultSelectedAddress,
  setDefaultSelectedAddress,
}) {
  return (
    <Fade>
      <div className=" p-4  flex items-center  items-start bg-white gap-4 border rounded-lg shadow-sm">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={defaultSelectedAddress == _id}
            onChange={(e) => setDefaultSelectedAddress(_id)}
            className="xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full border-gray-300 checked:bg-blue-500 checked:border-transparent focus:ring-0"
          />
        </div>
        <div className="flex-1 sm:ml-4 mt-2 mb-2 sm:mt-0 sm:mb-0">
          <h4 className="text-lg font-semibold mb-2 capitalize">
            {shippingAddressType} ({recipientName})
          </h4>
          <p className="text-sm text-gray-700 mb-2">{addressLine1}</p>
          <p className="text-sm text-gray-700">{postalCode}</p>
        </div>

        <div className="flex flex-col space-y-4 my-aPto">
          <PencilAltIcon className="h-5" />
        </div>
      </div>
    </Fade>
  );
}

export default ShippingAddress;
