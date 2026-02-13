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
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const schemaChangePassword = zod.object({
  currentPassword: zod.string().min(6, 'Current password is required'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
  rePassword: zod.string(),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords don't match",
  path: ["rePassword"],
});

export default function ChangePassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const userToken = (session as any)?.token;
  const router = useRouter();

  const form = useForm({
    defaultValues: { 
      currentPassword: '',
      password: '',
      rePassword: ''
    },
    resolver: zodResolver(schemaChangePassword),
    mode: 'onBlur',
  })

  async function handleChangePassword(data: zod.infer<typeof schemaChangePassword>) {
    if (!userToken) {
      toast.error('Please login first');
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Sending change password request');
      
      const res = await fetch('https://ecommerce.routemisr.com/api/v1/users/changeMyPassword', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'token': userToken
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          password: data.password,
          rePassword: data.rePassword
        }),
      });

      const result = await res.json();
      console.log('Change Password Response:', result);

      if (result.token) {
        toast.success('Password changed successfully! Please login again.');
        form.reset();
        
        // تسجيل الخروج بعد تغيير كلمة المرور
        setTimeout(async () => {
          await signOut({ redirect: false });
          router.push('/login');
        }, 1500);
      } else {
        toast.error(result.message || 'Failed to change password.');
      }
    } catch (error: any) {
      console.error('Change Password Error:', error);
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
          Change Password
        </h1>

        <p className="text-center text-white mb-6 text-sm">
          Update your account password
        </p>

        <form onSubmit={form.handleSubmit(handleChangePassword)}>
          <Controller
            name="currentPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <div data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="text-green-500 mt-4 block"
                  htmlFor={field.name}
                >
                  Current Password:
                </FieldLabel>
                <Input
                  type="password"
                  {...field}
                  value={field.value ?? ''}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter current password"
                  autoComplete="current-password"
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
            name="password"
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
            name="rePassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <div data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="text-green-500 mt-4 block"
                  htmlFor={field.name}
                >
                  Confirm New Password:
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
            {isSubmitting ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  )
}