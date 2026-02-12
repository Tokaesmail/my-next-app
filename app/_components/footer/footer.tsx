import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 mt-15 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-white">
                <span className="text-green-500">Fresh</span>Cart
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              FreshCart is your one-stop destination for fresh groceries, organic produce, and
              household essentials delivered right to your doorstep.
            </p>
            {/* Social Media */}
            <div className="flex items-center gap-3">
              {[
                { icon: 'facebook', href: '#' },
                { icon: 'twitter', href: '#' },
                { icon: 'instagram', href: '#' },
                { icon: 'youtube', href: '#' },
              ].map((social) => (
                <Link
                  key={social.icon}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                  <span className="text-white text-sm">
                    {social.icon === 'facebook' && 'f'}
                    {social.icon === 'twitter' && '𝕏'}
                    {social.icon === 'instagram' && '📷'}
                    {social.icon === 'youtube' && '▶'}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              {[
                'Fruits & Vegetables',
                'Dairy & Eggs',
                'Bakery & Snacks',
                'Meat & Seafood',
                'Beverages',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm hover:text-green-500 transition-colors inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                'About Us',
                'Contact Us',
                'Privacy Policy',
                'Terms of Service',
                'Shipping Policy',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm hover:text-green-500 transition-colors inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {[
                'My Account',
                'Order History',
                'Wishlist',
                'Returns & Refunds',
                'Help Center',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm hover:text-green-500 transition-colors inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2023 FreshCart. All rights reserved.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 mr-2">We accept:</span>
              {['💳', '💳', '💳', '💳'].map((icon, index) => (
                <div
                  key={index}
                  className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-lg"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}