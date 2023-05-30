import { useEffect, useRef, useState } from "react"
import { Configuration, OpenAIApi } from "openai"
import { Loading } from "./agent/Loading"
import { Header } from "./agent/Header"
import { Setting } from "./agent/Setting"

// DB 저장
import axios from 'axios';

//////////////// [START] reduxjs/toolkit /////////////////////////
import { useSelector } from 'react-redux'
//////////////// [END] reduxjs/toolkit   /////////////////////////
import { setProperties } from '@/pages/api/UserContext'


//const ChatReq = (props, ref) => { 
const ChatReq = ({formValues, step, setIsLoading }) => { 

  const keyNamePrompt = `sub${step}_prompt`
  const keyNameContents = `sub${step}_contents`
  
  //////////////// [START] reduxjs/toolkit /////////////////////////
  const currentUserEmail = useSelector(state => {
    return state.work?.userEmail
  })

  const currentWorkNo = useSelector(state => {
    return state.work?.workNo
  })
//////////////// [END] reduxjs/toolkit   /////////////////////////

  // Real-time return data
  const [result, setResult] = useState("");
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState(""); 

  useEffect(() => {
    formValues[keyNameContents] = result
  }, [result]);

  useEffect(()=>{
    var sentence = formValues[keyNamePrompt]
    sentence = sentence.replace(/\[|\]/g,'')
    console.log('부모가 나에게 준 Prompt 1: ' + sentence)
    console.log('부모가 나에게 준 Prompt 2: ' + formValues[keyNamePrompt])
    console.log('부모가 나에게 준 Prompt 3: ' + formValues[keyNameContents])
    console.log('부모가 나에게 준 Prompt 4: ' + keyNamePrompt)
    console.log('부모가 나에게 준 Prompt 5: ' + keyNameContents)
    
    setPrompt(sentence)
  }, [])

  const resultElement = useRef()

  let handleSubmitPromptBtnClicked = async () => {
    const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    const PROXY = process.env.NEXT_PUBLIC_API_PROXY ?? 'https://api.openai.com'

    if (prompt) {
      setIsLoading(true);
      var sendPrompt = prompt
      await setProperties(keyNamePrompt,prompt,currentWorkNo, currentUserEmail)
      // setResult('');
      // setPrompt('');
      const fullMessages = [...messages, {role: 'user', content: sendPrompt}];
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
      await addWorkHistory('user',sendPrompt)

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
                      formValues[keyNameContents] = formValues[keyNameContents] + delta.content;
                      setResult(formValues[keyNameContents]);
                      resultElement.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
                    }
                }
            }            
        }
        //const gptMessages = [...messages, {role: gptRole, content: formValues[keyNameContents]}];
        //setMessages(gptMessages);
        // DB 이력 생성
        step == 1 ? await setProperties('article_subject_fixed_yn','Y',currentWorkNo,currentUserEmail) : null
        await setProperties(keyNameContents,formValues[keyNameContents],currentWorkNo,currentUserEmail)
        await addWorkHistory(gptRole,formValues[keyNameContents])

      } else {
        // done
        console.log(fullMessages);
        setMessages(fullMessages.concat({role: gptRole, content: formValues[keyNameContents]}));
        source.close();
      }
    }

    setIsLoading(false)
  }

  function handleClearSession() {
    setMessages([])
    setResult("")
  }

  const [showSetting, setShowSetting] = useState(false);
  function handleSetting() {
    setShowSetting(true);
  }

  const addWorkHistory = async (role, prompt) => {
    try {
      const payload = {
        user_email  : currentUserEmail,
        work_no     : currentWorkNo,
        type        : 'after-step-' + step,
        role        : role,
        message     : prompt
      }
    
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/work/addWorkHistory`, payload);
    
      if (!response.ok) {
        throw new Error(`Error! 3 status: ${response.data.work_no}`);
      }
    } catch (err) {
      //setErr(err.message);
      console.log(err.message)
    } finally {
      //setIsLoading(false);
    }
  }

  let handleSubmitMore = async () => {
    var currentStep = 'after-step-' + step
    console.log('handleSubmitMore : currentStep : ' + currentStep)
    console.log('handleSubmitMore : prompts     : ' + prompts)
 }

  return (
    <>
    <div className='section' id={`sub${step}_prompt`}>
      <div className={`flex-1 flex justify-center items-start flex-col xl:px-0 sm:px-16 px-6`}>
        <div className="mb-4">
          <span className="font-poppins text-gradient">{prompt}</span> {" "}<br />
          {/* <button disabled={!prompt} className="bg-cyan-400 text-white h-full rounded-lg justify-end shadow-sm px-4 py-1 ml-1 disabled:opacity-50" onClick={handleSubmitPromptBtnClicked} >{prompt}</button> */}
          {/* <button className="bg-cyan-400 text-white h-full rounded-lg justify-end shadow-sm px-4 py-1 ml-1 disabled:opacity-50" onClick={handleSubmitMore} ></button> */}
          <button
            onClick={handleSubmitPromptBtnClicked}
            className="btn btn-sm"
          >요청</button>
        </div>
      </div>
    </div>
      {showSetting && <Header onClearSession={handleClearSession} onSetting={handleSetting}/>}
      {showSetting && <Setting onClose={() => setShowSetting(false)}/>}
    </>
  );
}

export default ChatReq
