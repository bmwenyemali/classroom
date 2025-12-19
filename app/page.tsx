import Link from 'next/link'
import { AcademicCapIcon, UserGroupIcon, ChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">Classroom</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A modern classroom management system for students, teachers, and professors
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <AcademicCapIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Courses</h3>
            <p className="text-gray-600 text-sm">
              Organize and track all your courses in one place
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <ChartBarIcon className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Grades</h3>
            <p className="text-gray-600 text-sm">
              Monitor student performance and academic progress
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <UserGroupIcon className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect</h3>
            <p className="text-gray-600 text-sm">
              Students and teachers collaborate seamlessly
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <CalendarIcon className="h-12 w-12 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Organized</h3>
            <p className="text-gray-600 text-sm">
              Keep track of schedules and important events
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
