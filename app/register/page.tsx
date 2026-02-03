'use client'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import zod from 'zod'
import { schemaRegister } from '../schema/SchemaRegister'
import { toast } from 'react-hot-toast'
// احذف سطر import { console } من هنا تماماً

export default function Register() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: ''
    },
    resolver: zodResolver(schemaRegister),
    mode: 'onBlur'
  })

  // أضفنا async هنا
  async function register(data: zod.infer<typeof schemaRegister>) {
    try {
      const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      console.log(responseData);
      

      if (res.ok) {
        toast.success('Account created successfully!');
        form.reset();
      } else {
        toast.error(responseData.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  }

  return (
    <div className='rounded-2xl p-3 flex flex-col bg-gray-200 w-1/2 mx-auto mt-10 '>
      <h1 className='text-3xl text-center mb-2 text-[#72beba]'>Register Now</h1>
      <form onSubmit={form.handleSubmit(register)}>
        
        {/* Name Field */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className='text-[#72beba]' htmlFor={field.name}>Name : </FieldLabel>
              <Input 
                {...field}
                value={field.value ?? ''}
                id={field.name}
                placeholder="Enter your name"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Email Field */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className='text-[#72beba] mt-4' htmlFor={field.name}>Email : </FieldLabel>
              <Input 
                type='email'
                {...field}
                value={field.value ?? ''}
                id={field.name}
                placeholder="Enter your email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Password Field */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className='text-[#72beba] mt-4' htmlFor={field.name}>Password : </FieldLabel>
              <Input 
                type='password'
                {...field}
                value={field.value ?? ''}
                id={field.name}
                placeholder="Enter your password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* rePassword Field */}
        <Controller
          name="rePassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className='text-[#72beba] mt-4' htmlFor={field.name}>Re-enter Password : </FieldLabel>
              <Input 
                type='password'
                {...field}
                value={field.value ?? ''}
                id={field.name}
                placeholder="Re-enter your password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Phone Field */}
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className='text-[#72beba] mt-4' htmlFor={field.name}>Phone : </FieldLabel>
              <Input 
                type='tel' // يفضل استخدام tel بدل number لأرقام الهواتف
                {...field}
                value={field.value ?? ''}
                id={field.name}
                placeholder="Enter your phone number"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <button type="submit" className="mt-10 bg-[#72beba] text-white w-full px-4 py-2 rounded-md hover:bg-[#5da3a0] transition-colors">
          Register
        </button>
      </form>
    </div>
  )
}