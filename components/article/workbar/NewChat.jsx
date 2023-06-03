import React, { useState } from 'react'
import axios from 'axios';
import { RxPlus } from 'react-icons/rx' 
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

function NewChat({handleAdd}) {
    const router = useRouter()
    const [err, setErr] = useState('')

    const currentUserEmail = useSelector(state => {
      return state.work?.userEmail
    })

    const createNewChat = async () => {
        try {
            //   const payload = {
            //     user_email  : currentUserEmail,
            //     work_no     : children,
            //     chat_id     : process.env.NEXT_PUBLIC_FROM_DT,
            //     type        : userJson.title,
            //     roll        : userJson.description,
            //     message     : userJson.link,
            //   };
              const payload = {
                user_email  : currentUserEmail,
              }
        
              let response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/work/createWork`, payload);
              let result = await routerPush(response)
        
            } catch (err) {
              setErr(err.message);
              console.log(err.message)
            } finally {
              //setIsLoading(false);
            }

            //router.push(`/chat/${response.data.work_no}`)
            //router.push(`/flows?${response.data.work_no}`)
    }

    const routerPush = async (response) => {
//      console.log('createNewChat : ' + JSON.stringify(response.data.data[0].work_no));
//      router.push(`/flows?${response.data.data[0].work_no}`)
      handleAdd(response.data.data[0].work_no)
      return true
    }

  return (
    <div onClick={createNewChat} className='border-gray-700 border chatRow'>
        <RxPlus className='h-4 w-4' />
        {/* <p>add new work</p> */}
    </div>
  )
}

export default NewChat