'use client'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import zod from 'zod'
import { schemaRegister } from '../schema/SchemaRegister'

export default function Register() {
  const form = useForm({
    defaultValues: {
    name: '',
    email:'',
    password:'',
    rePassword:'',
    phone:''
},
    resolver:zodResolver(schemaRegister),
    mode:'onBlur'
  })
  function register(data: zod.infer<typeof schemaRegister>){
    console.log(data);
    form.reset();

  }
  return (
    <div className='rounded-2xl p-3 flex flex-col  bg-gray-200  w-1/2 mx-auto mt-10 '>
      <h1 className='text-3xl text-center mb-2 text-[#72beba]'>Register Now</h1>
      <form onSubmit={form.handleSubmit(register)}>
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
        aria-invalid={fieldState.invalid}
        placeholder="inter your name"
        autoComplete="off"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
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
      <Controller
  name="rePassword"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel className='text-[#72beba] mt-10' htmlFor={field.name}>Re-enter Password : </FieldLabel>
      <Input  type='password'
        {...field}
          value={field.value ?? ''}
        id={field.name}
        aria-invalid={fieldState.invalid}
        placeholder="re-enter your password"
        autoComplete="off"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
      <Controller
  name="phone"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel className='text-[#72beba] mt-10' htmlFor={field.name}>Phone : </FieldLabel>
      <Input  type='number'
        {...field}
          value={field.value ?? ''}
        id={field.name}
        aria-invalid={fieldState.invalid}
        placeholder="inter your phone number"
        autoComplete="off"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>

)}
/>
        <button type="submit" className="mt-10 bg-[#72beba] text-white w-full px-4 py-2 rounded-md">Register</button>
      </form>
    </div>
  )
}
