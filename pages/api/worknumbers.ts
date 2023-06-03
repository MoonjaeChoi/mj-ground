import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    const { currentUser } = await serverAuth(req, res);

    if (!currentUser?.email) {
      throw new Error('Not signed in');
    }

    // GET START
    if (req.method === 'GET') {
      const workData = await prismadb.am_work_properties.findMany({
        where: {
        OR: [
          {
            user_email: {
              in: currentUser?.email,
            },
          },
          {
            // type: {
            //   in: 'create',
            // },
          }
          ],
          }
      });

      if (workData) {
        return res.status(200).json(workData);
      }

      const work = await prismadb.am_work_properties.create({
        data: {
          user_email: currentUser.email,
          createdAt: new Date(),
        }
      })

      return res.status(200).json(work);
    }
    // GET END

    // POST START
    if (req.method === 'POST') {

      const { workId, postfix, value } = req.body;
  
      const existingWork = await prismadb.am_work_properties.findUnique({
        where: {
          id: workId,
        }
      });
  
      if (!existingWork) {
        throw new Error('Invalid ID');
      }
      const name = 'Bob'
  //    await prismadb.$queryRaw`SELECT 'My name is ${name}';`
      //const workProperties = await prismadb.$runCommandRaw`SELECT 'My name is ${name}';`
      //const workProperties = await prismadb.$transaction`SELECT 'My name is ${name}';`
  
      // const user = await prismadb.am_work_properties.update({
      //   where: {
      //     AND: [
      //       {
      //         user_email: {
      //           in: currentUser?.email,
      //         },
      //       },
      //       {
      //         id: {
      //           in: workId,
      //         },
      //       }
      //     ]
      //     user_email: currentUser.email || '',
      //   },
      //   data: {
      //     draft_word: {
      //       push: 'null'
      //     }
      //   }
      // });
  
   //   return res.status(200).json(user);
    }

    // POST END

  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
 
}
