'use server'

export async function cartServices(productId: string, userToken: string) {
    try {
        if (!userToken) {
            return {
                status: 'fail',
                message: 'Please login first'
            };
        }

        const response = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'token': userToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Cart Response:', result);
        return result;

    } catch (error: any) {
        console.error('Cart Service Error:', error);
        return {
            status: 'fail',
            message: error.message || 'Failed to add to cart'
        };
    }
}