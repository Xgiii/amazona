import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { connectToDb, convertDocToObj } from '../../utils/db';
import { Store } from '../../utils/Store';

function ProductScreen({ product }) {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  if (!product) {
    return <Layout title='Product not found'>Product not found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find(
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
    router.push('/cart');
  };

  return (
    <Layout title={product.name}>
      <div className='py-2'>
        <Link href='/'>back to products</Link>
      </div>
      <div className='grid md:grid-cols-4 md:gap-3'>
        <div className='md:col-span-2'>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout='responsive'
          />
        </div>
        <div>
          <ul>
            <li>
              <h1 className='text-lg'>{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className='card p-5'>
            <div className='mb-2 flex justify-between'>
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className='mb-2 flex justify-between'>
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
            </div>
            <button
              className='primary-button w-full'
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const { params } = ctx;
  const { slug } = params;
  const client = await connectToDb();

  const productsCollection = client.db().collection('products');

  const product = await productsCollection.findOne({ slug });
  client.close();

  return {
    props: {
      product: product ? convertDocToObj(product) : null,
    },
  };
}

export default ProductScreen;
