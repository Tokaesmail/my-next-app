'use client'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import zod from 'zod'
import toast from 'react-hot-toast'
import Image from 'next/image'
import background from '../../assets/images/trees.jpg'
import Link from 'next/link'

const schemaVerifyCode = zod.object({
  resetCode: zod.string().min(4, 'Reset code must be at least 4 characters'),
})

export default function VerifyResetCode() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: { resetCode: '' },
    resolver: zodResolver(schemaVerifyCode),
    mode: 'onBlur',
  })

  async function handleVerifyCode(data: zod.infer<typeof schemaVerifyCode>) {
    setIsSubmitting(true);
    try {
      const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetCode: data.resetCode }),
      })

      const result = await res.json();
      console.log('Verify Code Response:', result);

      if (res.ok && result.status === 'Success') {
        toast.success('Code verified successfully!');
        
        // Store the reset code for the next step
        sessionStorage.setItem('resetCode', data.resetCode);
        
        // Redirect to reset password page
        setTimeout(() => {
          window.location.href = '/reset-password';
        }, 1500);
      } else {
        toast.error(result.message || 'Invalid or expired code.');
      }
    } catch (error: any) {
      console.error('Verify Code Error:', error);
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
          Verify Reset Code
        </h1>

        <p className="text-center text-white mb-6 text-sm">
          Enter the reset code sent to your email.
        </p>

        <form onSubmit={form.handleSubmit(handleVerifyCode)}>
          <Controller
            name="resetCode"
            control={form.control}
            render={({ field, fieldState }) => (
              <div data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="text-green-500 mt-4 block"
                  htmlFor={field.name}
                >
                  Reset Code:
                </FieldLabel>
                <Input
                  type="text"
                  {...field}
                  value={field.value ?? ''}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter reset code"
                  autoComplete="off"
                  className="mt-1 text-center text-lg tracking-wider"
                  disabled={isSubmitting}
                  maxLength={6}
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
            {isSubmitting ? 'Verifying...' : 'Verify Code'}
          </button>

          <p className="text-center mt-4 text-sm text-white">
            Didn't receive the code?{' '}
            <Link
              href="/forgot-password"
              className="text-green-400 font-semibold hover:underline"
            >
              Resend
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}