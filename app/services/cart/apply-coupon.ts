'use server'

export async function applyCoupon(couponName: string, userToken: string) {
    try {
        if (!userToken) {
            return {
                status: 'fail',
                message: 'Please login first'
            };
        }

        if (!couponName || couponName.trim() === '') {
            return {
                status: 'fail',
                message: 'Please enter a coupon code'
            };
        }

        const response = await fetch(`https://ecommerce.routemisr.com/api/v2/cart/applyCoupon`, {
            method: 'PUT',
            headers: {
                'token': userToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                coupon: couponName
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Apply Coupon Response:', result);
        return result;

    } catch (error: any) {
        console.error('Apply Coupon Error:', error);
        return {
            status: 'fail',
            message: error.message || 'Failed to apply coupon'
        };
    }
}