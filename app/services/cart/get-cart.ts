export async function getLoggedUserCart(token: string) {
    if (!token) return null;
    
    const response = await fetch("https://ecommerce.routemisr.com/api/v2/cart", {
        method: 'GET',
        headers: { 
            'token': token 
        },
    });
    
    return response; 
}