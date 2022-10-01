import axios from 'axios';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import { connectToDb, convertDocToObj } from '../utils/db';
import { Store } from '../utils/Store';

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find(
      (cartItem) => cartItem.slug === product.slug
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry, product is out of stock');
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity: quantity },
    });

    toast.success('Product added to the cart');
  };

  return (
    <Layout title='Home Page'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product) => (
          <ProductItem
            key={product.slug}
            product={product}
            addToCartHandler={() => addToCartHandler(product)}
          />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const client = await connectToDb();

  const productsCollection = client.db().collection('products');

  const products = await productsCollection.find({}).toArray();

  client.close();

  return {
    props: {
      products: products.map(convertDocToObj),
    },
  };
}
