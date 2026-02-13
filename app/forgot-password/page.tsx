'use client'

import { FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import zod from 'zod'
import toast from 'react-hot-toast'
import Image from 'next/image'
import background from '../../assets/images/trees.jpg'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const schemaForgot = zod.object({
  email: zod.string().email('Enter a valid email address'),
})

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: { email: '' },
    resolver: zodResolver(schemaForgot),
    mode: 'onBlur',
  })

  async function handleForgot(data: zod.infer<typeof schemaForgot>) {
    setIsSubmitting(true);
    
    try {
      console.log('Sending forgot password request for:', data.email);
      
      const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: data.email 
        }),
      });

      const result = await res.json();
      console.log('Forgot Password Response:', result);

      // تحقق من الـ response
      if (result.statusMsg === 'success') {
        toast.success(result.message || 'Reset code sent to your email!');
        form.reset();
        
        // حفظ البريد الإلكتروني في sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('resetEmail', data.email);
        }
        
        // التوجيه لصفحة التحقق من الكود
        setTimeout(() => {
          router.push('/verify-reset-code');
        }, 1500);
      } else {
        toast.error(result.message || 'Failed to send reset code.');
      }
    } catch (error: any) {
      console.error('Forgot Password Error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
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

      <div className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl text-center mb-6 text-green-500 font-semibold">
          Forgot Password
        </h1>

        <p className="text-center text-white mb-6 text-sm">
          Enter your email address and we'll send you a code to reset your password.
        </p>

        <form onSubmit={form.handleSubmit(handleForgot)}>
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
                  autoComplete="email"
                  className="mt-1"
                  disabled={isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            )}
          />

          <button
            disabled={isSubmitting}
            type="submit"
            className="mt-8 bg-green-500 text-white w-full px-4 py-2 rounded-md hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Code'}
          </button>

          <p className="text-center mt-4 text-sm text-white">
            Remembered your password?{' '}
            <Link
              href="/login"
              className="text-green-400 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}