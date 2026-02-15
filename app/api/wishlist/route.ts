import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/schema/nextAuth';

const API_BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

// GET - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    // ⭐ Get token from SESSION (not from headers!)
    const token = (session as any)?.token;

    if (!token) {
      console.error('Token not found in session. Session:', session);
      return NextResponse.json(
        { message: 'Token not found. Please login again.' },
        { status: 401 }
      );
    }

    console.log('Fetching wishlist with token...');

    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'GET',
      headers: {
        'token': token,
      },
    });

    const data = await response.json();
    console.log('Wishlist response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch wishlist' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add product to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // ⭐ Get token from SESSION (not from headers!)
    const token = (session as any)?.token;

    if (!token) {
      console.error('Token not found in session');
      return NextResponse.json(
        { message: 'Token not found. Please login again.' },
        { status: 401 }
      );
    }

    console.log('Adding product to wishlist:', productId);

    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
      },
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();
    console.log('Add to wishlist response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to add to wishlist' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove product from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }

    const token = (session as any)?.token;

    if (!token) {
      console.error('Token not found in session');
      return NextResponse.json(
        { message: 'Token not found. Please login again.' },
        { status: 401 }
      );
    }

    console.log('Removing product from wishlist:', productId);

    const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: {
        'token': token,
      },
    });

    const data = await response.json();
    console.log('Remove from wishlist response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to remove from wishlist' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Wishlist DELETE error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}