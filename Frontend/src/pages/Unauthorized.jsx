import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md text-center bg-white shadow-xl rounded-2xl p-8 border border-gray-200"
      >
        <div className="bg-[#e0f2fa] p-4 rounded-full inline-block mb-4">
          <ShieldOff className="h-12 w-12 text-[#338db5]" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-[#338db5]">
          403 - Unauthorized
        </h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to view this page. Please contact your
          administrator if you believe this is an error.
        </p>
        <Link
          to="/Dashboard"
          className="inline-block bg-[#338db5] hover:bg-[#287392] text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
}
