import { useEffect, useRef, useState } from "react"
import { Configuration, OpenAIApi } from "openai"
import { Loading } from "@/components/agent/Loading"
import { Header } from "@/components/agent/Header"
import { Setting } from "@/components/agent/Setting"
import { setProperties } from '@/pages/api/UserContext'

// DB 저장
import axios from 'axios';

//////////////// [START] reduxjs/toolkit /////////////////////////
import { setGlobal } from '@/store/sliceWorkInfo'
import { useSelector,useDispatch } from 'react-redux'
//////////////// [END] reduxjs/toolkit   /////////////////////////

 const Step300Form = ({ onChange, formValues, setIsLoading }) => {

  //////////////// [START] reduxjs/toolkit /////////////////////////
  const currentUserEmail = useSelector(state => {
    return state.work?.userEmail
  })

  const currentWorkNo = useSelector(state => {
    return state.work?.workNo
  })

  const relatedWords1 = useSelector(state => {
    return state.work.relatedWords
  })

  const dispatch = useDispatch()
  //////////////// [END] reduxjs/toolkit   /////////////////////////

  // Real-time return data
  const [messages, setMessages] = useState([])
  const [prompt, setPrompt] = useState('')
  const [responseChatGPT, setResponseChatGPT] = useState('')
  const [value, setValue] = useState('')

  ///////////////
  useEffect(() => {
    let word = ''
    formValues.selectedKeywords.map((sel) => {
        word = word + ',' + sel.label
     })
     setPrompt(word)
  }, [formValues.selectedKeywords])

  const getWorkMessage = async (e) => {
    try {
      var keyNameContents = 'suggest_title'

      console.log('getWorkMessage keyNameContents : '+ keyNameContents)
      
      var result = await getProperties(keyNameContents,e,currentWorkNo,currentUserEmail)
      await parseSubjects(result[keyNameContents])
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
      var keyNameContents = 'suggest_title'

      console.log('updateWorkMessage message keyNameContents : '+ keyNameContents)
      console.log('updateWorkMessage message e : '+ e)
      
      await setProperties(keyNameContents,e,currentWorkNo,currentUserEmail)

      } catch (err) {
        console.log(err.message)
      } finally {
      }
  }

  const resultElement = useRef()
  
  const handleInput = (e) => {
    setPrompt(e.target.value);
  }

  const handleKeyDown = (e) => {
    if (e.code === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitPromptBtnClicked()
    }
  }
  /**
   * 
   * 이전에 받아온 데이터가 저장되어 있는지 
   * 추천 제목을 DB에서 읽어온다. 
   * 
   */

  /**
   * 
   * 다음 단어와 관련된 블로그 제목 5개를 추천해주세요. 목록을 글머리 기호로 표시 
   * 
   * */
  let handleSubmitPromptBtnClicked = async () => {
    const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    const PROXY = process.env.NEXT_PUBLIC_API_PROXY ?? 'https://api.openai.com'

    setIsLoading(true);
    console.log('handleSubmitPromptBtnClicked loading : ' + formValues.loading )

    if (prompt) {
      var sendPrompt = "Please suggest five blog titles related to the following words. Show a list in bullet points \n\n:"
      sendPrompt = sendPrompt + prompt
      setPrompt('');
      const fullMessages = [...messages, {role: 'user', content: sendPrompt}];
      setMessages(fullMessages);
      console.log('fullMessages', fullMessages);
      let url = `${PROXY}/v1/chat/completions`;
      let data = {
        model: "gpt-3.5-turbo",
        messages: fullMessages.slice(fullMessages.length-5, fullMessages.length), // 최대 5개 항목 가져오기
        temperature: 0.7,
        top_p: 0.7,
        max_tokens: 500,
        stream: true,
        n: 1,
      };

      // DB 이력 생성
      const historyResponse = await addWorkHistory('user',sendPrompt)
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

        // string to JSON 
        let json_temp1 = JSON.stringify(response_text)
        // JSON to string
        let json_temp2 = JSON.parse(json_temp1)
        let payload = json_temp1

        console.log('typeof json_temp1 : ' + typeof(json_temp1))
        console.log('typeof json_temp2 : ' + typeof(json_temp2))
        console.log('typeof payload : ' + typeof(payload))
        console.log('typeof payload.data : ' + typeof(payload.data))

        console.log('--------------------json_temp1-------------------------')
        //console.log(JSON.stringify(response_text))
        console.log('--------------------json_temp2-------------------------')
        var js = JSON.parse(JSON.stringify(response_text))
        //console.log(JSON.parse(JSON.stringify(response_text)))
        var arr = js.toString().split("\n");
        var i = 0

        // chatGPT 응답 결과 저장
        var responseGPT = ''
        for ( i in arr ) {
          var sentence = arr[i].trim()
          if (sentence.length > 0) {
            sentence = sentence.replace("data: ","")
            //var sub_1 = JSON.parse(JSON.stringify(sentence))
            var sub_1 = JSON.parse(sentence)
            //console.log(sub_1)
            let {delta, finish_reason} = sub_1.choices[0]
            if (finish_reason != "stop") {
                const {role,  content} = delta;
                if(role) {
                  gptRole = role;
                }
                if(content && content !== "\n\n") {
                  responseGPT = responseGPT + delta.content
                }
              }
            }            
          }
        // local 변수에 저장은 되지만, 
        // setResponseChatGPT(responseGPT)는 작동하지 않는다.
        // DB 이력 생성
        await updateWorkMessage(responseGPT)      /** set properties */
        await addWorkHistory(gptRole,responseGPT) /** add history  ,"type":"suggest_title","role":"assistant" */
        await parseSubjects(responseGPT)          /** 결과를  responseSubjects store에 저장.*/
        console.log('chatGPT SUBJECT response : ' + responseGPT)
        console.log('-------------------- E N d    -------------------------')

      } else {
        // done
        console.log(fullMessages);
        setMessages(fullMessages.concat({role: gptRole, content: responseChatGPT}));
        source.close();
      }
    }
  };

  function handleClearSession() {
    setMessages([]);
  }

  const [showSetting, setShowSetting] = useState(false);

  function handleSetting() {
    setShowSetting(false);
  }

  const addWorkHistory = async (role, prompt) => {
    try {
      const payload = {
        user_email  : currentUserEmail,
        work_no     : currentWorkNo,
        type        : "suggest_title",
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
    }
  }

  ///////////////
  const parseSubjects = async (str) => {
    var openQuote = false;
    var parsed = [];
    var quote = '';
    var text = '';
    var openQuote = false;
  
    for (var i = 0; i < str.length; i++) {
      var item = str[i];
      if (item === '"' && !openQuote) {
        openQuote = true;
        //parsed.push({ type: 'text', value: text });
        text = '';
      }
      else if (item === '"' && openQuote) {
        openQuote = false;
        //parsed.push({ type: 'quote', value: quote });
        parsed.push(text)
        text = '';
      }
      else if (openQuote) text += item;
      else quote += item;
    }
    console.log('parsed : ' + parsed)
    console.log('parsed length: ' + parsed.length)

    formValues.subjectListFromGPT = parsed
    await setProperties('subject_from_gpt',JSON.stringify(parsed),currentWorkNo,currentUserEmail)

    dispatch(setGlobal({responseSubjects: parsed}))

    setIsLoading(false);
    console.log('parseSubjects loading : ' + formValues.loading )
  }
  ///////////////


  return (
    <div className='section' id='third'>
      <div className={`flex-1 flex justify-center items-start flex-col xl:px-0 sm:px-16 px-6`}>
        <label
          className="block text-gray-500 text-sm font-bold mb-5 leading-[2]"
          htmlFor="DraftWord"
        >
        선택한 키워드들이 포함된 <br/>
        제목을 추천합니다. <br/>
        <br/>
        <br/>

        </label>
      
        <button
          onClick={handleSubmitPromptBtnClicked}
          className="btn btn-lg"
        >
          제목 추천 요청
        </button>
        {showSetting && <Header onClearSession={handleClearSession} onSetting={handleSetting}/>}
        {showSetting && <Setting onClose={() => setShowSetting(false)}/>}
      </div>
    </div>
  );
}

export default Step300Form