import React, { useState } from 'react'
import axios from 'axios';
import { RxPlus } from 'react-icons/rx' 
// import { useRouter } from 'next/navigation'
// import { useSelector } from 'react-redux'

import useCurrentUser from '@/hooks/useCurrentUser'
import useWorkNumbers from '@/hooks/useWorkNumbers'

interface NewChatProps {
  handleAdd: any
}

//function NewChat({handleAdd}) {
const NewChat: React.FC<NewChatProps> = ({handleAdd}) => {
    const { data: currentUser, mutate } = useCurrentUser()
    const { mutate: mutateFavorites } = useWorkNumbers()

    const currentUserEmail = 'useSelector(state => {return state.work?.userEmail})'

    const createNewChat = async () => {
      console.log('createNewChat')
      
      let response
      let workid = ''
      let postfix = ''
      let value = ''

      response = await axios.post('/api/worknumbers', {
        workid,
        postfix,
        value
      })

      const workID = response?.data?.id;

      mutate({ 
        ...currentUser, 
        workIds: workID,
      });

      mutateFavorites()
    }

  return (
    <div onClick={createNewChat} className='border-gray-700 border chatRow cursor-pointer'>
        <RxPlus className='h-4 w-4' />
        {/* <p>add new work</p> */}
    </div>
  )
}

export default NewChat