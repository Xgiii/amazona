import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';

function RegisterScreen() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  async function submitHandler({ email, password, name }) {
    try {
      const { data } = await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });
      toast.success(data);
      router.push('/login');
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <Layout title='login'>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className='mx-auto max-w-screen-md'
      >
        <h1 className='mb-4 text-xl'>Login</h1>
        <div className='mb-4'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            {...register('name', {
              required: 'Please enter name',
            })}
            id='name'
            className='w-full'
            autoFocus
          />
          {errors.name && (
            <div className='text-red-500'>{errors.name.message}</div>
          )}
        </div>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter valid email',
              },
            })}
            id='email'
            className='w-full'
          />
          {errors.email && (
            <div className='text-red-500'>{errors.email.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            {...register('password', {
              required: 'Please enter password',
              minLength: { value: 6, message: 'password is more than 5 chars' },
            })}
            id='password'
            className='w-full'
          />
          {errors.password && (
            <div className='text-red-500'>{errors.password.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <button className='primary-button'>Register</button>
        </div>
        <div className='mb-4'>
          Already have an account? &nbsp;
          <Link href='/login'>Login</Link>
        </div>
      </form>
    </Layout>
  );
}

export default RegisterScreen;
