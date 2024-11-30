import Product from "./Product";
import { useState } from "react";
import { AdjustmentsIcon } from "@heroicons/react/outline";
import axios from "axios";
import { getProductByCategoryId } from "../../api";

function ProductFeed({ products, categories }) {
  const [categoryActive, setCategoryActive] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState(products);
  console.log(products, categories, "final");
  const activeCategoryHandler = async (categoryId) => {
    if (categoryId === "all") {
      setCategoryActive("all");
      setFilteredProducts(products);
      return;
    }
    const response = await getProductByCategoryId(categoryId);
    setCategoryActive(categoryId);
    setFilteredProducts(response?.data);
  };

  return (
    <div className="w-full py-20 px-6 bg-gray-100 mt-10" id="products-feed">
      <div className="flex items-center w-full max-w-screen-xl sm:mb-20 mb-16 gap-4  mx-auto overflow-x-auto hideScrollBar capitalize text-sm font-medium">
        <div>
          <AdjustmentsIcon className="w-6" />
        </div>
        <div
          className={` py-2 px-6 bg-white text-center rounded hover:bg-blue-light hover:text-white transition-all cursor-pointer ease-in-out duration-200 shadow ${
            categoryActive === "all" ? "bg-blue-light text-white" : ""
          }`}
          onClick={() => activeCategoryHandler("all")}
        >
          All
        </div>
        {categories?.map((category, i) => (
          <div
            key={`category-${i}`}
            className={`py-2 px-6 bg-white text-center whitespace-nowrap rounded hover:bg-blue-light hover:text-white transition-all cursor-pointer ease-in-out duration-200 shadow ${
              categoryActive === category?._id ? "bg-blue-light text-white" : ""
            }`}
            onClick={() => activeCategoryHandler(category._id)}
          >
            {category?.name}
          </div>
        ))}
      </div>
      <div className="grid grid-flow-row-dense sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 mx-auto max-w-screen-xl gap-x-6 gap-y-8">
        {(categoryActive === "all" ? products : filteredProducts)?.map(
          ({ _id, name, price, description, category, image }) => (
            <Product
              key={`product-${_id}`}
              _id={_id}
              title={name}
              price={price}
              description={description}
              category="hello"
              image={image || "/img/fallback-image.svg"}
            />
          )
        )}
      </div>
    </div>
  );
}

export default ProductFeed;
