import React, { useState, useEffect } from 'react'
import { RxChatBubble, RxTrash } from 'react-icons/rx'
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation'

import { useCallback, useMemo } from 'react'
import useCurrentUser from '@/hooks/useCurrentUser'
import useWorkNumbers from '@/hooks/useWorkNumbers'
import { IFormInfo } from '@/components/article/IObjType';

interface ChatRowProps {
  //formValues: IFormInfo
  work_no: string
  handleRemove: any
}

//function ChatRow({formValues, work_no, handleRemove}) {
const ChatRow: React.FC<ChatRowProps> = ({work_no, handleRemove}) => {
  const router = useRouter()
  const [active, setActive] = useState(false)

  const { data: currentUser, mutate } = useCurrentUser()
  const { mutate: mutateFavorites } = useWorkNumbers()
  
  const currentUserEmail = currentUser?.email
  const currentWorkNo = currentUser?.currentWorkId
  let postfix = 'work_no'
  let postvalue = currentUser?.currentWorkId

  const onclick = useCallback(async () => {
    try {
      await axios.post('/api/worknumbers', {
        currentWorkNo,
        postfix,
        postvalue
      })

      router.replace(`/`)
    } catch (error) {
      console.log(error)
    }
  }, [currentWorkNo, postfix, postvalue, router])

  let keyDelete = 'delete_yn'
  let keyValue = 'Y'

  const removeChat = useCallback(async () => {
    try {
      await axios.post('/api/worknumbers', {
        currentWorkNo,
        keyDelete,
        keyValue
      })

      router.replace(`/`)
      //handleRemove(work_no)
    } catch (error) {
      console.log(error)
    }
  }, [currentWorkNo, keyDelete, keyValue, router])

  // useEffect(() => {
  //   console.log('############ : ' + work_no)
  // }, [])


///  flows?work_no=20230406230233
//   const [messages] = useCollection(
//     query(
//         collection(db, "users", session?.user?.email!, "chats", work_no,
//         "messages"),
//         orderBy("createdAt", "asc")
//     )
//   )


  useEffect(() => {
    console.log('currentWorkNo : ' + currentWorkNo + '|| ID            : ' + work_no)
    if (work_no == currentWorkNo)
      setActive(true)
    else
      setActive(false)
  }, [work_no, currentWorkNo])

  // <Link href={`/chat/${work_no}`} className={`chatRow justify-center ${active && "bg-gray-700/50"}`}>

//  return (
//    <Link href={{
//      pathname: '/flows',
//      query: { work_no: `${work_no}`},
//    }} className={`chatRow justify-center ${active && "bg-gray-700/50"}`}>
//        <RxChatBubble className='h-5 w-5' />
//        <p className='flex-1 hidden md:inline-flex truncate'>
//          {workChats?.[workChats.length - 1]?.message.value || 'New Chat'}
//        </p>
//        <RxTrash
//          onClick={removeChat}
//          className='h-5 w-5 text-gray-700 hover:text-red-700' />
//    </Link>
//    )
//

    return (
      <div className={`chatRow justify-center ${active && "bg-gray-700/50 hover:scale-105"}`} onClick={onclick}>
          <RxChatBubble className='h-5 w-5' onClick={onclick} />
          <p className='font-poppins font-normal'>
            {/* {workChats?.[workChats.length - 1]?.message.value || work_no} */}
            { work_no }
          </p>
          <RxTrash
            onClick={removeChat}
            className='h-5 w-5 text-gray-700 hover:text-red-700' />
      </div>
      )
}

export default ChatRow