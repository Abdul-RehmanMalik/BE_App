import User from '../models/User'

export async function createAdminUser(): Promise<void> {
  try {
    const existingAdmin = await User.findOne({ isAdmin: true })
    if (existingAdmin) {
      console.log('Admin user already exists. Skipping creation.')
      return
    }

    const adminUser = new User({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      address: process.env.ADMIN_ADDRESS,
      isAdmin: true,
    })

    await adminUser.save()

    console.log('Admin user created successfully!')
    return
  } catch (error: any) {
    console.error('Error creating admin:', error)
    throw error
  }
}
