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

      // var keyname = '';
      // var payload = { };
      // payload[keyname + postfix] = value

  
      const existingWork = await prismadb.am_work_properties.findUnique({
        where: {
          id: workId,
        }
      });
  
      if (!existingWork) {
        throw new Error('Invalid ID');
      }
      
      await prismadb.am_work_properties.update({
        where: { id: workId },
        data: { draft_word: 'Updated post title' },
      })
  
//       const user = await prismadb.am_work_properties.update({
//         where: {
//               user_email: currentUser.email
//               //id: workId,
// //          user_email: currentUser.email || '',
//         },
//         data: {
//           draft_word: 'null'
//         }
//       });
  
   //   return res.status(200).json(user);
    }

    // POST END

  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
 
}
