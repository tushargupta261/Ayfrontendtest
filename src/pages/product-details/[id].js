import Head from "next/head";
import ProductDetails from "../../components/Product/ProductDetails";
import { getProductById } from "../../api";

function productDetails({ product }) {
  return (
    <>
      {product?.title && (
        <Head>
          <title>{product.name}</title>
        </Head>
      )}
      <ProductDetails
        _id={product?._id}
        title={product?.name}
        price={product?.price}
        description={product?.description}
        category={product?.category?.[0]?.name || ""}
        image={product?.image || "/img/fallback-image.svg"}
      />
    </>
  );
}

export default productDetails;

export const getStaticPaths = async () => {
  const paths = [{ params: { id: "1" } }];

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  try {
    let product;
    const response = await getProductById(context.params.id);
    product = response.data;

    if (!product) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        product,
      },
      revalidate: 1,
    };
  } catch (error) {
    console.log(error);
  }
};
