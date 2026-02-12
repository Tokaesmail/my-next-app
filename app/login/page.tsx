'use client'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import zod from 'zod'
import { schemaSignin } from '../schema/SchemaSignin'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import background from '../../assets/images/trees.jpg'

export default function Login() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(schemaSignin),
    mode: 'onBlur',
  })

  async function register(data: zod.infer<typeof schemaSignin>) {
    const response = await signIn('credentials', {
      email: data.email,
      password: data.password,
      callbackUrl: callbackUrl,
      redirect: false,
    })

    if (response?.ok) {
      toast.success('Login Successful')
      window.location.href = response.url || '/'
    } else {
      toast.error('Login Failed')
    }

    form.reset()
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

      <div className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl text-center mb-6 text-green-500 font-semibold">
          Login Now
        </h1>

        <form onSubmit={form.handleSubmit(register)}>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <div data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="text-green-500 mt-4 block"
                  htmlFor={field.name}
                >
                  Email:
                </FieldLabel>
                <Input
                  type="email"
                  {...field}
                  value={field.value ?? ''}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your email"
                  autoComplete="off"
                  className="mt-1"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </div>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <div data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="text-green-500 mt-4 block"
                  htmlFor={field.name}
                >
                  Password:
                </FieldLabel>
                <Input
                  type="password"
                  {...field}
                  value={field.value ?? ''}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your password"
                  autoComplete="off"
                  className="mt-1"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </div>
            )}
          />

          <button
            type="submit"
            className="mt-8 bg-green-500 text-white w-full px-4 py-2 rounded-md hover:bg-[#5aa9a3] transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
