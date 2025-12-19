'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  HomeIcon, 
  BookOpenIcon, 
  AcademicCapIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CalendarIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import type { UserRole } from '@/lib/types'

interface NavItem {
  name: string
  href: string
  icon: any
  roles: UserRole[]
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['student', 'teacher', 'tenured_professor'] },
  { name: 'My Classes', href: '/dashboard/classes', icon: BookOpenIcon, roles: ['student'] },
  { name: 'My Grades', href: '/dashboard/grades', icon: AcademicCapIcon, roles: ['student'] },
  { name: 'Teachers', href: '/dashboard/teachers', icon: UserGroupIcon, roles: ['student'] },
  { name: 'My Courses', href: '/dashboard/courses', icon: BookOpenIcon, roles: ['teacher'] },
  { name: 'Students', href: '/dashboard/students', icon: UserGroupIcon, roles: ['teacher'] },
  { name: 'Grade Entry', href: '/dashboard/grade-entry', icon: AcademicCapIcon, roles: ['teacher'] },
  { name: 'All Classes', href: '/dashboard/all-classes', icon: BookOpenIcon, roles: ['tenured_professor'] },
  { name: 'All Grades', href: '/dashboard/all-grades', icon: ChartBarIcon, roles: ['tenured_professor'] },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon, roles: ['tenured_professor'] },
  { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarIcon, roles: ['student', 'teacher', 'tenured_professor'] },
  { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon, roles: ['student', 'teacher', 'tenured_professor'] },
]

export default function DashboardNav({ role }: { role: UserRole }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const filteredNav = navigation.filter(item => item.roles.includes(role))

  return (
    <nav className="bg-white w-64 min-h-screen shadow-lg flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">Classroom</h1>
        <p className="text-sm text-gray-500 mt-1 capitalize">
          {role.replace('_', ' ')}
        </p>
      </div>

      <div className="flex-1 px-3">
        {filteredNav.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>

      <div className="p-3 border-t">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-3 w-full text-gray-700 hover:bg-gray-50 rounded-lg transition"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  )
}
