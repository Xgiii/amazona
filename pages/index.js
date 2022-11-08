import axios from 'axios';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Filters from '../components/Filters';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import { connectToDb, convertDocToObj } from '../utils/db';
import { Store } from '../utils/Store';
import {
  BarsArrowDownIcon,
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';

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
      <Menu as='div' className='relative flex justify-end cursor-pointer'>
        <Menu.Button>
          <div className='flex items-end'>
            <p className='mr-2'>Sort:</p>
            <BarsArrowDownIcon className='h-5 w-5' />
          </div>
        </Menu.Button>
        <Menu.Items className='absolute top-6 right-0 w-56 origin-top-right bg-white shadow-lg'>
          <Menu.Item
            as='a'
            className='dropdown-link'
            href='/?order=price_lowest'
          >
            Price: Lowest
          </Menu.Item>
          <Menu.Item
            as='a'
            className='dropdown-link'
            href='/?order=price_highest'
          >
            Price: Highest
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <div className='grid gap-6 md:gap-12 grid-cols-1 md:grid-cols-4 p-4'>
        <div className='col-span-4 md:col-span-1 p-4 card'>
          <Filters />
        </div>
        <div className='grid gap-4 col-span-4 md:col-span-3 grid-cols-1 md:grid-cols-3'>
          {products.map((product) => (
            <ProductItem
              key={product.slug}
              product={product}
              addToCartHandler={() => addToCartHandler(product)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const client = await connectToDb();

  const productsCollection = client.db().collection('products');

  const sortMethod = ctx.query.order;

  let products;

  if (!sortMethod) {
    products = await productsCollection.find({}).toArray();
  }

  switch (sortMethod) {
    case 'price_lowest':
      products = await productsCollection
        .find({})
        .sort({ price: 1 })
        .toArray();
      break;
    case 'price_highest':
      products = await productsCollection.find({}).sort({ price: -1 }).toArray();
      break;
    default:
      break;
  }

  client.close();

  return {
    props: {
      products: products.map(convertDocToObj),
    },
  };
}
