
import React from 'react';

export default function ContactPage() {
  return (
    <div className="py-24 px-4 bg-gray-50 animate-fadeIn">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        <div className="bg-blue-600 p-12 text-white md:w-1/3">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="mb-8 opacity-80">Our support team is available 24/7 to help you build the perfect resume.</p>
          <div className="space-y-6">
            <div className="flex items-center">
              <i className="fas fa-envelope mr-4"></i>
              <span>support@resumeflux.ai</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-map-marker-alt mr-4"></i>
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>
        <div className="p-12 flex-1">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                <input type="text" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                <input type="text" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
              <textarea rows={4} className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white transition-colors"></textarea>
            </div>
            <button className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}