
import React from 'react'
import Link from 'next/link'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-green-100 text-gray-800 mt-[1px] w-full top-0 ackdrop-blur-[5px] bottom-0 ">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 w- full" >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About section */}
          <div>
            <h2 className="font-semibold text-lg mb-2">About Us</h2>
            <p className="text-sm">
              We are a community of vegetable suppliers dedicated to providing
              fresh and organic produce. Learn more about our mission and values.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h2 className="font-semibold text-lg mb-2 *:">Quick Links</h2>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social/contact */}
          <div>
            <h2 className="font-semibold text-lg mb-2">Connect</h2>
            <ul className="flex space-x-4">
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="mailto:sanketade344@gmail.com?subject=Inquiry from Vegetable Suppliers Website&body=Hi Sanket,%0D%0AI would like to know more about..."
                  className="  hover:text-blue-600 "
                >
                  Email Us
                </a>


              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-indigo-400 pt-4 text-center text-sm">
          <p>
            © {year} Vegetable Suppliers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
