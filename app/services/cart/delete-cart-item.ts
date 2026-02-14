'use server'

export async function deleteCartItem(productId: string, userToken: string) {
    try {
        if (!userToken) {
            return {
                status: 'fail',
                message: 'Please login first'
            };
        }

        const response = await fetch(`${process.env.API}/cart/${productId}`, {
            method: 'DELETE',
            headers: {
                'token': userToken,
                'Content-Type': 'application/json',
            },
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