import Link from 'next/link';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { signIn, useSession } from 'next-auth/react';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  async function submitHandler({ email, password }) {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
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
            autoFocus
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
          <button className='primary-button'>Login</button>
        </div>
        <div className='mb-4'>
          Don&apos;t have an account? &nbsp;
          <Link href='/register'>Register</Link>
        </div>
      </form>
    </Layout>
  );
}

export default LoginScreen;
