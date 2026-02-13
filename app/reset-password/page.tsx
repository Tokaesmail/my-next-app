'use client'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import zod from 'zod'
import toast from 'react-hot-toast'
import Image from 'next/image'
import background from '../../assets/images/trees.jpg'
import { useRouter } from 'next/navigation'

const schemaResetPassword = zod.object({
  email: zod.string().email('Enter a valid email address'),
  newPassword: zod.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: zod.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: { 
      email: '',
      newPassword: '',
      confirmPassword: ''
    },
    resolver: zodResolver(schemaResetPassword),
    mode: 'onBlur',
  })

  useEffect(() => {
    // Check if user came from verify code page
    const resetCode = sessionStorage.getItem('resetCode');
    if (!resetCode) {
      toast.error('Please verify your reset code first');
      router.push('/forgot-password');
    }
  }, [router]);

  async function handleResetPassword(data: zod.infer<typeof schemaResetPassword>) {
    setIsSubmitting(true);
    try {
      const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/resetPassword', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          newPassword: data.newPassword
        }),
      })

      const result = await res.json();
      console.log('Reset Password Response:', result);

      if (res.ok && result.token) {
        toast.success('Password reset successfully!');
        
        // Clear the reset code from sessionStorage
        sessionStorage.removeItem('resetCode');
        
        // Redirect to login page
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        toast.error(result.message || 'Failed to reset password.');
      }
    } catch (error: any) {
      console.error('Reset Password Error:', error);
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
          Reset Password
        </h1>

        <p className="text-center text-white mb-6 text-sm">
          Enter your email and new password.
        </p>

        <form onSubmit={form.handleSubmit(handleResetPassword)}>
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

          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <div data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="text-green-500 mt-4 block"
                  htmlFor={field.name}
                >
                  New Password:
                </FieldLabel>
                <Input
                  type="password"
                  {...field}
                  value={field.value ?? ''}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="mt-1"
                  disabled={isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <div data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="text-green-500 mt-4 block"
                  htmlFor={field.name}
                >
                  Confirm Password:
                </FieldLabel>
                <Input
                  type="password"
                  {...field}
                  value={field.value ?? ''}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
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
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}