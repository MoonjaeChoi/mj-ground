import { useEffect, useState } from "react"
import { Configuration, OpenAIApi } from "openai"
import { Loading } from "@/components/agent/Loading"
import { Header } from "@/components/agent/Header"
import { Setting } from "@/components/agent/Setting"

import { promptOptions } from "@/data/data"
import Select from "react-select"

import GetStarted from "./GetStarted"

// DB 저장
import axios from 'axios';
//////////////// [START] reduxjs/toolkit /////////////////////////
import { setGlobal } from '@/store/sliceWorkInfo'
import { useDispatch, useSelector } from 'react-redux'
//////////////// [END] reduxjs/toolkit   /////////////////////////

import { setProperties } from '@/pages/api/UserContext'

 const Step500Form = ({ onChange, formValues, setIsLoading }) => {

  //////////////// [START] reduxjs/toolkit /////////////////////////
  const dispatch = useDispatch()

  const currentUserEmail = useSelector(state => {
    return state.work?.userEmail
  })
  
  const currentWorkNo = useSelector(state => {
    return state.work?.workNo
  })
  
  const postTitle = useSelector(state => {
    return state.work?.postTitle
  })
  //////////////// [END] reduxjs/toolkit   /////////////////////////

  // Real-time return data
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState(""); 

  useEffect(()=>{
    var sentence = postTitle
    sentence = sentence.replace(/\[|\]/g,'')
    console.log('부모가 나에게 준 제목은 : ' + sentence)
    setPrompt(sentence)
    // setPrompt(sentence)
    formValues.adjustSubject = sentence
  }, [postTitle])

  useEffect(()=>{
    console.log(formValues.send_article_contents);
  }, [formValues.send_article_contents])

  let handleSubmitPromptBtnClicked = async () => {
    const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    const PROXY = process.env.NEXT_PUBLIC_API_PROXY ?? 'https://api.openai.com'
    console.log('handleSubmitPromptBtnClicked prompt : ' + prompt)
    if (prompt) {
      setIsLoading(true)
      await setProperties('article_subject',formValues.subject,currentWorkNo,currentUserEmail)
      setPrompt('');
      const fullMessages = [...messages, {role: 'user', content: formValues.send_article_contents}];
      setMessages(fullMessages);
      console.log('fullMessages', fullMessages);
      let url = `${PROXY}/v1/chat/completions`;
      let data = {
        model: "gpt-3.5-turbo",
        messages: fullMessages.slice(fullMessages.length-5, fullMessages.length), // 최대 5개 항목 가져오기
        temperature: 0.75,
        top_p: 0.8,
        max_tokens: 3000,
        stream: true,
        n: 1,
      };

      // DB 이력 생성
      const historyResponse = await addWorkHistory('user',formValues.send_article_contents)
      console.log('history result : ' + historyResponse)

      const configuration = new Configuration({
        organization: "org-1SrdMWZdN2M9uD3PWKHLFki8",
        apiKey: API_KEY,
        });
      const openai = new OpenAIApi(configuration);

      const response = await openai.createChatCompletion(data);
      let gptRole = 'assistant';
      const e = response
      if (e.data != "[DONE]") {

        let response_text = ""
        response_text = e.data
        response_text = response_text.replace("data: [DONE]","")

        var js = JSON.parse(JSON.stringify(response_text))
        var arr = js.toString().split("\n");
        var i = 0

        // chatGPT 응답 결과 저장
        var responseGPT = ''
        for ( i in arr )
        {
            var sentence = arr[i].trim()
            if (sentence.length > 0)
            {
                sentence = sentence.replace("data: ","")
                var sub_1 = JSON.parse(sentence)
                let {delta, finish_reason} = sub_1.choices[0]
                if (finish_reason != "stop") {
                    const {role,  content} = delta;
                    if(role) {
                      gptRole = role;
                    }
                    if(content && content !== "\n\n") {
                      let content = delta.content.replace("\n", '<br/>')
                      responseGPT = responseGPT + content
                      console.log(delta.content)
                      
                    }
                }
            }            
        }

        // DB 이력 생성
        formValues.article_contents = responseGPT
        await setProperties('article_contents',responseGPT,currentWorkNo,currentUserEmail)
        await addWorkHistory(gptRole, responseGPT)
        console.log('-------------------- E N d    -------------------------')
        setIsLoading(false)

      } else {
        // donesetIsLoading
        setIsLoading(false)
        console.log(fullMessages);
        source.close()
      }
    }

    setIsLoading(false)
  };

  function handleClearSession() {
    setMessages([]);
  }

  const [showSetting, setShowSetting] = useState(false);
  function handleSetting() {
    setShowSetting(false);
  }

  const addWorkHistory = async (role, postSentence) => {
    try {
      const payload = {
        user_email  : currentUserEmail,
        work_no     : currentWorkNo,
        type        : "write_article",
        role        : role,
        message     : postSentence
      }

      dispatch(setGlobal({postBody: postSentence}))

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/work/addWorkHistory`, payload);
    
      if (!response.ok) {
        throw new Error(`Error! 3 status: ${response.data.work_no}`);
      }
    } catch (err) {
      console.log(err.message)
    } finally {
    }
  }

  const handleWarnaChange = async (selected, selectaction) => {
    const { action } = selectaction;
    if (action === "clear") {
        } else if (action === "select-option") {
        } else if (action === "remove-value") {
            console.log("remove");
        }
        //////////////// [START] reduxjs/toolkit /////////////////////////
        console.log('요청한 수준별 글쓰기 selected : ' + JSON.stringify(selected))
        formValues.send_article_contents = selected.prompt + formValues.subject
        console.log('요청한 수준별 글쓰기 prompt : ' + formValues.send_article_contents)

        dispatch(setGlobal({postTitle: formValues.send_article_contents}))
    };

  return (
    <div className='section' id='fifth'>
      <div className={`flex-1 flex justify-center items-start flex-col xl:px-0 sm:px-16 px-6`}>
        <div className="mb-4">
          <p className='font-poppins text-dimWhite ml-2 leading-[2]'>
            <span className="text-white">제목 : </span>
            <span className="font-poppins text-gradient">{postTitle}</span> {" "}<br/>
            Common European Framework of Reference (CEFR)는 <br/>
            유럽 언어 교육, 학습 및 평가를 위한 국제적인 표준입니다.<br/>
            이 표준은 유럽 언어 교육 분야에서 공통적으로 사용되며,<br/>
            39개 회원국이 이를 인정하고 있습니다.<br/>
            CEFR은 언어 학습자의 언어 능력을 6가지 수준으로 분류합니다.<br/>
            이 수준은 
            <span className="text-white">A1, A2, B1, B2, C1, C2 </span>
            로 구성되어 있으며,<br/>
            언어 학습자가 어느 수준에 해당하는지 평가할 수 있습니다.<br/>
            <br/>
          </p>
          <label
            className="font-poppins text-dimWhite ml-2 leading-[2]"
            htmlFor="subject"
          >CEFR 기준 레벨 선택
          </label>
          <Select
              id="relate-select-step500"
              instanceId="relate-select-step500"
              isMulti = {false}
              name="relate-select-step500"
              className="basic-single rounded-full max-w-[460px] mx-auto m-2 selectInner"
              classNamePrefix="select"
              options={promptOptions}
              onChange={handleWarnaChange}
              placeholder="Select level"
          />
          <label
            className="font-first text-dimWhite ml-2 leading-[2]"
            htmlFor="subject"
          >
          Post Subject (직접입력가능합니다.)
          </label>
          <input
            className="font-poppins font-normal shadow appearance-none border w-full rounded py-2 px-3 m-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="adjustSubject"
            name="adjustSubject"
            onChange={onChange}
            value={formValues.adjustSubject}
            type="text"
            placeholder="..."
          ></input>

          <textarea
            id="send_article_contents"
            name="send_article_contents"
            className="font-poppins font-normal shadow appearance-none border w-full rounded py-2 px-3 m-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={onChange}
            defaultValue="직접입력가능합니다."
            value={formValues.send_article_contents}
            rows={7}
            cols={100}
            placeholder="..."
          ></textarea>
          
        </div>
        {/* <div disabled={!prompt} className="bg-cyan-400 text-white h-full rounded-lg justify-end shadow-sm px-4 py-1 m-2 ml-1 disabled:opacity-50 cursor-pointer"  >send</div> */}
        <div className="mt-4 mr-0 cursor-pointer" onClick={handleSubmitPromptBtnClicked}>
          <GetStarted />
        </div>
      </div>
      {showSetting && <Header onClearSession={handleClearSession} onSetting={handleSetting}/>}
      {showSetting && <Setting onClose={() => setShowSetting(false)}/>}
    </div>
  );
}

export default Step500Form
