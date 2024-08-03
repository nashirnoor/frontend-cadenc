import React from 'react'


const Footer = () => {
  return (
    <div>
        <footer className="bg-gray-900 text-white py-12 mt-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">About Us</h2>
                            <p className="text-sm p-1">
                                Welcome to Cadenc, where finding your dream job is made easy! We connect talented individuals with opportunities for professional growth and success.
                            </p>
                            <p className="text-sm p-1">
                                Join us today and take the next step toward your career goals with Cadenc. We're here for your success every step of the way.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                            <ul className="text-sm">
                                <li className='p-1'><a href="#">Home</a></li>
                                <li className='p-1'><a href="#">Browse Jobs</a></li>
                                <li className='p-1'><a href="#">Companies</a></li>
                                <li className='p-1'><a href="#">Post a Job</a></li>
                                <li className='p-1'><a href="#">Blog</a></li>
                                <li className='p-1'><a href="#">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
                            <p className="text-sm p-1">123 Job Street, City</p>
                            <p className="text-sm p-1">Phone: +123 456 7890</p>
                            <p className="text-sm p-1">Email: cadenc@gmail.com</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
                            <div className="flex space-x-4">
                                <a href="#" className="text-blue-500 hover:text-blue-400"><i className="fab fa-facebook fa-2x"></i></a>
                                <a href="#" className="text-pink-400 hover:text-pink-300"><i className="fab fa-instagram fa-2x"></i></a>
                                <a href="#" className="text-blue-400 hover:text-blue-300"><i className="fab fa-twitter fa-2x"></i></a>
                                <a href="#" className="text-red-500 hover:text-red-400"><i className="fab fa-youtube fa-2x"></i></a>
                                <a href="#" className="text-blue-600 hover:text-blue-500"><i className="fab fa-linkedin fa-2x"></i></a>
                            </div>
                            <h2 className="text-xl font-semibold mt-6 mb-4">Newsletter</h2>
                            <p className="text-sm p-1">Subscribe to our newsletter to get the latest job opportunities and updates.</p>
                            <form className="mt-4">
                                <input
                                    type="email"
                                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Your email"
                                />
                                <button type="submit" className="w-full mt-2 p-2 rounded bg-blue-600 hover:bg-blue-500 text-white">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-12 pt-4 text-center">
                    <p className="text-sm">&copy; 2024 Cadenc. All rights reserved.</p>
                </div>
            </footer>
    </div>
  )
}

export default Footer
