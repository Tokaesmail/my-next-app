import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import OrderReviewClient from './OrderReviewClient';

interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    category: {
      name: string;
    };
    brand: {
      name: string;
    };
  };
}

interface CartData {
  status: string;
  numOfCartItems: number;
  data: {
    _id: string;
    cartOwner: string;
    products: CartItem[];
    totalCartPrice: number;
  };
}

// Server Component - Fetch cart data
async function getCartData(token: string): Promise<CartData | null> {
  try {
    const response = await fetch('https://ecommerce.routemisr.com/api/v1/cart', {
      headers: { 
        'token': token,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}

export default async function Step2ReviewPage() {
  // Get token from cookies
  const cookieStore =await cookies();
  const token = cookieStore.get('userToken')?.value || '';

  if (!token) {
    redirect('/login');
  }

  // Fetch cart data on server
  const cartData = await getCartData(token);

  if (!cartData || !cartData.data) {
    redirect('/cart');
  }

  const cartItems = cartData.data.products || [];
  const totalPrice = cartData.data.totalCartPrice || 0;
  const cartId = cartData.data._id;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 mb-3">
            Secure Checkout
          </h1>
          <p className="text-gray-600 text-lg">Complete your purchase in simple steps</p>
        </div>

        {/* Client Component for interaction */}
        <OrderReviewClient 
          cartItems={cartItems}
          totalPrice={totalPrice}
          cartId={cartId}
          token={token}
        />
      </div>
    </div>
  );
}