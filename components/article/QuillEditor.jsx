// https://www.npmjs.com/package/react-quill
// "ReferenceError: document is not defined"
// https://stackoverflow.com/questions/73047747/error-referenceerror-document-is-not-defined-nextjs/74096771#74096771
// https://velog.io/@nawon5154/quill.js-react-quill-%EC%98%A4%EB%A5%98-%EC%9D%BC%EC%A7%80

import React, { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios';
//////////////// [START] reduxjs/toolkit /////////////////////////
import { setGlobal } from '@/store/sliceWorkInfo'
import { useDispatch, useSelector } from 'react-redux'
//////////////// [END] reduxjs/toolkit   /////////////////////////
import { setProperties, getProperties } from '@/pages/api/UserContext'

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: []} ],
        [{ size: []} ],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link", "image", "video"],
    ],
}

const QuillEditor = ({articleType, formValues}) => { 
    //////////////// [START] reduxjs/toolkit /////////////////////////
    const currentUserEmail = useSelector(state => {
      return state.work?.userEmail
    })

    const currentWorkNo = useSelector(state => {
      return state.work?.workNo
    })
    //////////////// [END] reduxjs/toolkit   /////////////////////////
    var keyNameContents = ''
    switch (articleType) {
      case 'write_article':
        keyNameContents = 'article_contents'
      break
      case 'after-step-1':
        keyNameContents = 'sub1_contents'
      break
      case 'after-step-2':
        keyNameContents = 'sub2_contents'
      break
      case 'after-step-3':
        keyNameContents = 'sub3_contents'
      break
      case 'after-step-4':
        keyNameContents = 'sub4_contents'
      break
      case 'after-step-5':
        keyNameContents = 'sub5_contents'
      break
      case 'after-step-6':
        keyNameContents = 'sub6_contents'
      break
      case 'after-step-7':
        keyNameContents = 'sub7_contents'
      break
      case 'after-step-8':
        keyNameContents = 'sub8_contents'
      break
      default:
        keyNameContents = 'sub9_contents'
    }
  
    const [value, setValue] = useState("")
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false}),[])

    const getWorkMessage = async (e) => {
      try {

        console.log('@@@@@@@@@@@@@@@@@@@@@@@@ : '+ formValues[keyNameContents])
        
        var result = await getProperties(keyNameContents,e,currentWorkNo,currentUserEmail)
        result ? setValue(result[keyNameContents]) : null

        } catch (err) {
          console.log(err.message)
        } finally {
        }
    }

    const updateWorkMessage = async (e) => {
      try {
        if (e.length == 0 )
        {
          return null
        }

        console.log('updateWorkMessage message keyNameContents : '+ keyNameContents)
        console.log('updateWorkMessage message e : '+ e)

        formValues[keyNameContents] = e
        
        await setProperties(keyNameContents,e,currentWorkNo,currentUserEmail)

        } catch (err) {
          console.log(err.message)
        } finally {
        }
    }

    useEffect(() => {
      getWorkMessage()
    }, [])
  
  const handleChangeEditor = async (editor) => {
    console.log('background', editor);
    let _postForm = this.state.postForm;

    _postForm.notesValid = true;
    _postForm.notes = editor;

    if (editor.length < 30) { _postForm.notesValid = false; }

    this.setState({ ...this.state, postForm: _postForm });
  };    

  return (
    <div className={`flex-1 flex justify-center items-start flex-col xl:px-0 sm:px-16 px-6`}>
        <div className="mb-4 max-w-[460px]">
            <div className='editor'>
                <ReactQuill
                theme="snow"
                value={formValues[keyNameContents]}
                onChange={updateWorkMessage}
                className='editor-input'
                modules={modules}
                />
            </div>
        </div>
    </div>
  )
}

export default QuillEditor
