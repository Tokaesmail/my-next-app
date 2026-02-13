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

    const schemaSignup = zod.object({
    name: zod.string().min(2, 'Name must be at least 2 characters'),
    email: zod.string().email('Enter a valid email address'),
    password: zod.string().min(6, 'Password must be at least 6 characters'),
    rePassword: zod.string(),
    phone: zod.string().min(10, 'Phone must be at least 10 digits'),
    }).refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
    });

    export default function SignUp() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm({
        defaultValues: {
        name: '',
        email: '',
        password: '',
        rePassword: '',
        phone: '',
        },
        resolver: zodResolver(schemaSignup),
        mode: 'onBlur',
    })

    async function handleSignup(data: zod.infer<typeof schemaSignup>) {
        setIsSubmitting(true);
        
        try {
        console.log('Sending signup request');
        
        const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signup', {
            method: 'POST',
            headers: { 
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            rePassword: data.rePassword,
            phone: data.phone
            }),
        });

        const result = await res.json();
        console.log('Signup Response:', result);

        if (result.message === 'success') {
            toast.success('Account created successfully! Please login.');
            form.reset();
            
            setTimeout(() => {
            router.push('/login');
            }, 1500);
        } else {
            toast.error(result.message || 'Failed to create account.');
        }
        } catch (error: any) {
        console.error('Signup Error:', error);
        toast.error('Something went wrong. Please try again.');
        } finally {
        setIsSubmitting(false);
        }
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center py-12">
        <Image
            src={background}
            alt="background"
            fill
            className="object-cover absolute inset-0 z-0"
            priority
        />

        <div className="absolute inset-0 bg-black/40 z-0"></div>

        <div className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-lg my-8">
            <h1 className="text-3xl text-center mb-6 text-green-500 font-semibold">
            Create Account
            </h1>

            <p className="text-center text-white mb-6 text-sm">
            Sign up to get started with FreshCart
            </p>

            <form onSubmit={form.handleSubmit(handleSignup)}>
            <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid}>
                    <FieldLabel
                    className="text-green-500 mt-4 block"
                    htmlFor={field.name}
                    >
                    Name:
                    </FieldLabel>
                    <Input
                    type="text"
                    {...field}
                    value={field.value ?? ''}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your name"
                    autoComplete="name"
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
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid}>
                    <FieldLabel
                    className="text-green-500 mt-4 block"
                    htmlFor={field.name}
                    >
                    Phone:
                    </FieldLabel>
                    <Input
                    type="tel"
                    {...field}
                    value={field.value ?? ''}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
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
                    Password:
                    </FieldLabel>
                    <Input
                    type="password"
                    {...field}
                    value={field.value ?? ''}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
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
                    Confirm Password:
                    </FieldLabel>
                    <Input
                    type="password"
                    {...field}
                    value={field.value ?? ''}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Confirm your password"
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
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>

            <p className="text-center mt-4 text-sm text-white">
                Already have an account?{' '}
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