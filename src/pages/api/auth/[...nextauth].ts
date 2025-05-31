import prisma from '@/utils/prisma';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';


const secret = process.env.NEXT_PRIVATE_SECRET_PASS_KEY

const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_PRIVATE_JWT_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 5 * 60 * 60,
  },
  jwt: {
    maxAge: 5 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      id: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'Your email...' },
        password: { label: 'Password', type: 'password', placeholder: 'Your password...' },
      },
      async authorize(credentials: any) {
        if (!credentials) {
          throw new Error('No credentials provider!')
        }
        const { email, password } = credentials

        const users = await prisma.user.findMany({ where: { email } })
        if (users.length === 0) {
          throw new Error('Invalid Email or Password')
        }
        const user = users[0]

        const isPassMatch = bcrypt.compareSync(password + secret, user.password)

        if (isPassMatch) {
          return user
        } else {
          throw new Error('failed to auth!')
        }
      }
    }),
    CredentialsProvider({
      name: 'Admin',
      id: 'Admin',
      credentials: {
        username: { label: 'username', type: 'text', placeholder: 'your username ...' },
        password: { label: 'password', type: 'password', placeholder: 'your password' }
      },
      async authorize(credentials: any) {
        if (!credentials) {
          throw new Error('no credentials provider!')
        }
        const { username, password } = credentials
        const users = await prisma.admin.findMany({ where: { username } })
        const user = users[0]

        const isPassMatch = bcrypt.compareSync(password + secret, user.password)
        if (isPassMatch) {
          return user
        } else {
          throw new Error('failed to auth!')
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PRIVATE_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.NEXT_PRIVATE_GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }: any) {
      if (account?.provider === 'Credentials' && user) {
        token.id = user.id
        token.role = 'user'
      }

      if (account?.provider === 'Admin' && user) {
        token.id = user.id
        token.role = 'admin'
      }

      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findFirst({ where: { email: user.email } })

        if (existingUser) {
          token.id = existingUser.id
          token.role = 'user'
          await prisma.user.update({
            where: { id: existingUser.id }, data: {
              type: 'google',
              emailVerified: true,
            }
          })
        } else {
          const newUser = await prisma.user.create({
            data: {
              name: user.name,
              email: user.email || '',
              password: "",
              emailVerified: true,
              type: 'google',
              image: user.image || '',
              items: [],
              phone: user.phone || '',
              orderId: [],
            },
          })
          token.id = newUser.id
          token.role = 'user'
        }
      }

      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          id: token.id,
          role: token.role
        }
      }

      return session
    },
  },
}

export default NextAuth(authOptions)
