'use client'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import zod from 'zod'
import { schemaRegister } from '../schema/SchemaRegister'
import { schemaSignin } from '../schema/SchemaSignin'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'

export default function Login() {
  const form = useForm({
      defaultValues: {
      email:'',
      password:'',
  },
      resolver:zodResolver(schemaSignin),
      mode:'onBlur'
    })
    async function register(data: zod.infer<typeof schemaSignin>){
      console.log(data);
      const response=await signIn('credentials', {
        email: data.email,
        password: data.password,
        callbackUrl: '/', 
        redirect: false
      }) 
      
      if (response?.ok){
        toast.success('Login Successful')
        window.location.href = response.url || '/';
      }else{
        toast.error('Login Failed')
      }
      
      console.log(response);
      form.reset();
    }
  return (
    <div>
      <div className='rounded-2xl p-3 flex flex-col  bg-gray-200  w-1/2 mx-auto mt-10 '>
      <h1 className='text-3xl text-center mb-2 text-[#72beba]'>Login Now</h1>
      <form onSubmit={form.handleSubmit(register)}>
        
      <Controller
  name="email"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel className='text-[#72beba] mt-10' htmlFor={field.name}>Email : </FieldLabel>
      <Input  type='email'
        {...field}
          value={field.value ?? ''}
        id={field.name}
        aria-invalid={fieldState.invalid}
        placeholder="Enter your email"
        autoComplete="off"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
      <Controller
  name="password"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel className='text-[#72beba] mt-10' htmlFor={field.name}>Password : </FieldLabel>
      <Input  type='password'
        {...field}
          value={field.value ?? ''}
        id={field.name}
        aria-invalid={fieldState.invalid}
        placeholder="inter your password"
        autoComplete="off"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
        <button type="submit" className="mt-10 bg-[#72beba] text-white w-full px-4 py-2 rounded-md">Login</button>
      </form>
    </div>
    </div>
  )
}
