/**
 * The signed-in user.
 *
 * PLACEHOLDER until Phase 1 (login): returns a fixed demo user so the portal
 * can be designed and reviewed. Phase 1 replaces this with the real session
 * from the API, including the user's permissions.
 */
export interface SessionUser {
  firstName: string
  fullName: string
  initials: string
  email: string
  employeeId: string
  jobTitle: string
  department: string
  location: string
  role: string
  manager: { fullName: string; initials: string; jobTitle: string }
  shift: { name: string; hours: string }
}

const demoUser: SessionUser = {
  firstName: 'Aarav',
  fullName: 'Aarav Mehta',
  initials: 'AM',
  email: 'aarav.mehta@verve.example',
  employeeId: 'VA-0142',
  jobTitle: 'Product Designer',
  department: 'Design',
  location: 'Hyderabad',
  role: 'Employee',
  manager: { fullName: 'Priya Raman', initials: 'PR', jobTitle: 'Design Lead' },
  shift: { name: 'General shift', hours: '9:30 AM – 6:30 PM' },
}

export function useSession(): { user: SessionUser } {
  return { user: demoUser }
}
