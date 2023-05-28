import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';

import { getSession } from "next-auth/react";
//import { without } from "lodash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const session = await getSession({ req });

    if (!session?.user?.email) {
      throw new Error('Not signed in');
    }

    const { movieId } = req.body;

    const existingMovie = await prismadb.movie.findUnique({
      where: {
        id: movieId,
      }
    });

    if (!existingMovie) {
      throw new Error('Invalid ID');
    }

    const user = await prismadb.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      throw new Error('Invalid email');
    }

    console.log('user.favoriteIds : ' + user.favoriteIds)
    console.log('movieId : ' + movieId)
    // const updatedFavoriteIds = without(user.favoriteIds, movieId);
    const updatedFavoriteIds = user.favoriteIds.filter(str => str !== movieId);
    console.log('updatedFavoriteIds : ' + updatedFavoriteIds);

    const updatedUser = await prismadb.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        favoriteIds: updatedFavoriteIds,
      }
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);

    return res.status(500).end();
  }
}
