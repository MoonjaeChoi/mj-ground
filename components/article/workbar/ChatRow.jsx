import React, { useState, useEffect } from 'react'
import { RxChatBubble, RxTrash } from 'react-icons/rx'
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation'

//////////////// [START] reduxjs/toolkit /////////////////////////
import { useSelector, useDispatch } from 'react-redux'
import { setGlobal } from '@/store/sliceWorkInfo'
//////////////// [END] reduxjs/toolkit   /////////////////////////

function ChatRow({formValues, work_no, handleRemove}) {
  const router = useRouter()
  const dispatch = useDispatch()
  const [workChats, setWorkChats] = useState([]);
//   const {data: session} = useSession()
  const [active, setActive] = useState(false)

  const currentUserEmail = useSelector(state => {
    return state.work?.userEmail
  })

  const currentWorkNo = useSelector(state => {
    return state.work?.workNo
  })

  const handleOnClick = async () => {
    router.replace(`/`)
    dispatch(setGlobal({workNo: work_no}))
  }

  useEffect(() => {
    console.log('############ : ' + work_no)
  }, [])
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
  }, [currentWorkNo])

  const removeChat = async () => {
    // await DB에서 work_no, useremail 이용해서 Delete....
    try {
      const payload = {
          user_email  : currentUserEmail,
          type        : 'delete'
        }
        console.log('removeChat work_no: '+ work_no)
        console.log('removeChat type: '+ payload.type)

        handleRemove(work_no)
    
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/work/deleteWorkChat/${work_no}`, payload);
    
        if (response.status != '200') {
          throw new Error(`Error! delete status: ${response.status}`);
        }
      } catch (err) {
        console.log(err.message)
      } finally {
        //setIsLoading(false);
        router.replace("/")
      }
  }
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
      <div className={`chatRow justify-center ${active && "bg-gray-700/50 hover:scale-105"}`} onClick={handleOnClick}>
          <RxChatBubble className='h-5 w-5' onClick={handleOnClick} />
          <p className='font-poppins font-normal'>
            {workChats?.[workChats.length - 1]?.message.value || work_no}
          </p>
          <RxTrash
            onClick={removeChat}
            className='h-5 w-5 text-gray-700 hover:text-red-700' />
      </div>
      )
}

export default ChatRow