import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

function PaymentScreen() {
  const [selectedPaymentMethod, setSelectededPaymentMethod] = useState('');

  const { state, dispatch } = useContext(Store);

  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  const router = useRouter();

  function submitHandler(e) {
    e.preventDefault();

    if (!selectedPaymentMethod) {
      return toast.error('Payment method is required');
    }

    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );

    router.push('/placeorder');
  }

  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push('/shipping');
    }
    setSelectededPaymentMethod(paymentMethod || '');
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <Layout title='Payment Method'>
      <CheckoutWizard activeStep={2} />
      <form className='mx-auto max-w-screen-md' onSubmit={submitHandler}>
        <h1 className='mb-4 text-xl'>Payment Method</h1>
        {['PayPal', 'Stripe', 'CashOnDelivery'].map((payment) => (
          <div key={payment} className='mb-4'>
            <input
              className='p-2 outline-none focus:ring-0'
              name='paymentMethod'
              id={payment}
              type='radio'
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectededPaymentMethod(payment)}
            />

            <label className='p-2' htmlFor={payment}>
              {payment}
            </label>
          </div>
        ))}
        <div className='mb-4 flex justify-between'>
          <button
            className='default-button'
            type='button'
            onClick={() => router.push('/shipping')}
          >
            Back
          </button>
          <button className='primary-button'>Next</button>
        </div>
      </form>
    </Layout>
  );
}

PaymentScreen.auth = true

export default PaymentScreen;
