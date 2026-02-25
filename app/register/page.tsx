'use client'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import zod from 'zod'
import { schemaRegister } from '../schema/SchemaRegister'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import background from '../../assets/images/trees.jpg'
import Login from '../login/page'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Register() {
  const router = useRouter();
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

  async function register(data: zod.infer<typeof schemaRegister>) {
    try {
      const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const responseData = await res.json()
      console.log(responseData)

      if (responseData.message=='success') {
        router.push('../login')
      }

      if (res.ok) {
        toast.success('Account created successfully!')
        form.reset()
      } else {
        toast.error(responseData.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration Error:', error)
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <Image
        src={background}
        alt="background"
        fill
        className="object-cover absolute inset-0 z-0"
        priority
      />

      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 w-full max-w-lg bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl text-center mb-6 text-green-500 font-semibold">
          Register Now
        </h1>

        <form onSubmit={form.handleSubmit(register)}>
          {/* Name */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-green-500" htmlFor={field.name}>
                  Name:
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  id={field.name}
                  placeholder="Enter your name"
                  autoComplete="off"
                  className="mt-1"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-green-500 mt-4" htmlFor={field.name}>
                  Email:
                </FieldLabel>
                <Input
                  type="email"
                  {...field}
                  value={field.value ?? ''}
                  id={field.name}
                  placeholder="Enter your email"
                  className="mt-1"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-green-500 mt-4" htmlFor={field.name}>
                  Password:
                </FieldLabel>
                <Input
                  type="password"
                  {...field}
                  value={field.value ?? ''}
                  id={field.name}
                  placeholder="Enter your password"
                  className="mt-1"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Re-Password */}
          <Controller
            name="rePassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-green-500 mt-4" htmlFor={field.name}>
                  Re-enter Password:
                </FieldLabel>
                <Input
                  type="password"
                  {...field}
                  value={field.value ?? ''}
                  id={field.name}
                  placeholder="Re-enter your password"
                  className="mt-1"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Phone */}
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-green-500 mt-4" htmlFor={field.name}>
                  Phone:
                </FieldLabel>
                <Input
                  type="tel"
                  {...field}
                  value={field.value ?? ''}
                  id={field.name}
                  placeholder="Enter your phone number"
                  className="mt-1"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <button
            type="submit"
            className="mt-8 bg-green-500 text-white w-full px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Register
          </button>
          <p className="text-center mt-4 text-sm text-white">
  Already have an account?{' '}
  <Link href="/login" className="text-green-400 font-semibold hover:underline">
    Login
  </Link>
</p>

        </form>
      </div>
    </div>
  )
}
