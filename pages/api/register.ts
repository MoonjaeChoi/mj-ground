import { NextApiRequest, NextApiResponse } from 'next'
import prismadb from '@/libs/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('register:',req.method)
    console.log('register:',req.method?.length)
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { email, name } = req.body;

    const existingUser = await prismadb.user.findUnique({
      where: {
        email
      }
    })

    if (existingUser) {
      return res.status(422).json({ error: 'Email taken' });
    }

    const user = await prismadb.user.create({
      data: {
        email,
        name,
        image: '',
        emailVerified: new Date(),
      }
    })

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` });
  }
}