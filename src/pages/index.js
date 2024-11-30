import Banner from "../components/Banner/Banner";
import ProductFeed from "../components/Product/ProductFeed";
 
import axios from "axios";

export default function Home({products,categories}) {
 
 
  return (
    <>
      <Banner />
      <ProductFeed products={products} categories={categories} />
    </>
  );
}

export const getStaticProps = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Fetch products from the API using axios
    const { data: products } = await axios.get(`${baseUrl}/product`);

    // Fetch categories from the API using axios
    const { data: categories } = await axios.get(`${baseUrl}/category`);

    return {
      props: {
        products: products.data,
        categories: categories.data,
      },
      revalidate: 1, // Regenerate the page at most once per second
    };
  } catch (error) {
    // Safely log the error data if available
    console.log(error.response?.data || error.message, 'jjj');

    return {
      props: {
        products: [], // Return an empty array or fallback data if fetching fails
        categories: [],
      },
    };
  }
};
