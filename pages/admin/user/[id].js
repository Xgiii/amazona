import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../../../components/Layout';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function AdminUserEditScreen() {
  const router = useRouter();
  const userId = router.query.id;

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/users/${userId}`);
        console.log(data);
        dispatch({ type: 'FETCH_SUCCESS' });
        setValue('name', data.name);
        setValue('email', data.email);
        setValue('isAdmin', data.isAdmin);
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
    fetchUser();
  }, [setValue, userId]);

  const submitHandler = async ({ name, email, isAdmin }) => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      await axios.put(`/api/admin/users/${userId}`, {
        name,
        email,
        isAdmin,
      });
      dispatch({ type: 'FETCH_SUCCESS' });
      router.push('/admin/users');
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: error.message });
    }
  };

  return (
    <Layout title={`Edit User ${userId}`}>
      <div className='grid md:grid-cols-4 md:gap-5'>
        <div>
          <ul>
            <li>
              <Link href='/admin/dashboard'>Dashboard</Link>
            </li>
            <li>
              <Link href='/admin/orders'>Orders</Link>
            </li>
            <li>
              <Link href='/admin/products'>Products</Link>
            </li>
            <li>
              <Link href='/admin/users'>
                <a className='font-bold'>Users</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className='md:col-span-3'>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className='alert-error'>{error}</div>
          ) : (
            <form
              className='mx-auto max-w-screen-md'
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className='text-xl mb-4'>User {userId}</h1>
              <div className='mb-4'>
                <label htmlFor='name'>Name</label>
                <input
                  type='text'
                  className='w-full'
                  id='name'
                  autoFocus
                  {...register('name', {
                    required: 'Please enter name',
                  })}
                />
                {errors.name && (
                  <div className='text-red-500'>{errors.name.message}</div>
                )}
              </div>
              <div className='mb-4'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  className='w-full'
                  id='email'
                  {...register('email', {
                    required: 'Please enter email',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter valid email',
                    },
                  })}
                />
                {errors.email && (
                  <div className='text-red-500'>{errors.email.message}</div>
                )}
              </div>
              <div className='mb-4'>
                <label htmlFor='isAdmin'>Is Admin:</label>
                <input
                  type='checkbox'
                  className='ml-2 mt-1'
                  id='isAdmin'
                  {...register('isAdmin')}
                />
              </div>
              <button className='primary-button'>Edit</button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminUserEditScreen.auth = { adminOnly: true };
export default AdminUserEditScreen;
