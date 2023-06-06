import React, { useState, useEffect } from 'react'
import RingLoader from "react-spinners/RingLoader"
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "white",
};

//import { useSelector } from 'react-redux'
import { ChatReq, Step100Form, Step200Form, Step300Form, Step400Form, Step500Form
       , QuillEditor, Footer, Nav, Workbar } from './'

/*
import { getWorkInfo } from '@/pages/api/UserContext'
*/

const ArticleMaker = () => {

// Quill Editor Options 
const editorType = 'write_article'
const editorType1 = 'after-step-1'
const editorType2 = 'after-step-2'
const editorType3 = 'after-step-3'
const editorType4 = 'after-step-4'

// ChatReq Options
const afterPrompt1 = 'In this article, create 10 english words and Korean meanings that Korean high school students should know., bullet points.'
const afterPrompt2 = 'In this article, make the topic sentence into one sentence of not more than 10 words, and write four more sentences, which should be a sentence, not a topic sentence.  And let each sentence be distinguished by numbering it.'
const afterPrompt3 = 'summarize the text less than 20 words, bullet points'
const afterPrompt4 = 'Create and answer three specific questions that would allow someone reading this article to check their understanding of the content. And number each question so you can tell them apart.'

  const initialValues = {
    loading:false,      
    draftword:"",
    newsItems:[],
    suggestedKeywords:[],
    selectedKeywords:[],
    subjectListFromGPT:[],
    subject:"",
    adjustSubject: "",
    send_article_contents:"",
    article_contents: "",
    sub1_contents: "",
    sub2_contents: "",
    sub3_contents: "",
    sub4_contents: "",
    sub5_contents: "",
    sub6_contents: "",
    sub7_contents: "",
    sub8_contents: "",
    sub9_contents: "",
    sub1_prompt: afterPrompt1,
    sub2_prompt: afterPrompt2,
    sub3_prompt: afterPrompt3,
    sub4_prompt: afterPrompt4,
    sub5_prompt: "sub5_prompt",
    sub6_prompt: "sub6_prompt",
    sub7_prompt: "",
    sub8_prompt: "",
    sub9_prompt: "",
    lastname: "",
    password: "",
    confirmPassword: "",
    username: "",
    city: "1",
    address: "",
    zip: "",
    terms: "",
  };

  const [values, setValues] = useState(initialValues);

  const setIsLoading = (e) => {
  setValues({ ...values, loading: e })
  }

  const parseResult = async (data) => {
    if (data == null)
      return null
      
    console.log(JSON.stringify(data))

    values.draftword = data?.draftword
    values.suggestedKeywords = JSON.parse(JSON.stringify(data?.suggested_keywords))
    values.subjectListFromGPT = JSON.parse(JSON.stringify(data?.subject_from_gpt))
    values.article_subject = data?.article_subject
    values.article_contents = data?.article_contents
    values.sub1_contents = data?.sub1_contents
    values.sub2_contents = data?.sub2_contents
    values.sub3_contents = data?.sub3_contents
    values.sub4_contents = data?.sub4_contents
  }


  useEffect(()=>{
  console.log('values.loading : ' + values.loading)
  }, [values?.loading])

  const currentUserEmail = useSelector(state => {
    return state.work?.userEmail
  })

  const currentWorkNo = useSelector(state => {
  return state.work?.workNo
  })
  
  const onChange = (e) => {
    //console.log('onChange : ' + JSON.stringify(e))
    const { name, value, type, checked } = e.target;
    setValues({ ...values, [name]: type === "checkbox" ? checked : value });
  };
/*
  useEffect( () => {
    async function sub() {
      if (currentWorkNo.length>0)
      {
          setValues(initialValues)
          var result = await getWorkInfo(currentWorkNo,currentUserEmail)
          await parseResult(result)
          return null
      }
    }
    sub()
  }, [currentWorkNo])
*/
  useEffect(() => {
    console.log('init2 : ' + JSON.stringify(values.suggestedKeywords))
  }, [values.suggestedKeywords])

  return (
      <>
        <Workbar formValues={values} />
        {/* <Method /> */}
        { currentWorkNo.length > 0 ?
          <>
            <Nav />
            <div className="sweet-loading">
                  {/* <input value={color} onChange={(input) => setColor(input.target.value)} placeholder="Color of the loader" /> */}
                  <RingLoader
                    color={`#ffffff`}
                    loading={values.loading}
                    cssOverride={override}
                    size={50}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
            </div>
            <Step100Form formValues={values} onChange={onChange} setIsLoading={setIsLoading}></Step100Form>
          </>
        :null}
        
        {values.suggestedKeywords?.length > 0 ?
        <>
        <Step200Form formValues={values} onChange={onChange}></Step200Form>
        <Step300Form formValues={values} onChange={onChange} setIsLoading={setIsLoading}></Step300Form>
        <div className="sweet-loading">
                  {/* <input value={color} onChange={(input) => setColor(input.target.value)} placeholder="Color of the loader" /> */}
                  <RingLoader
                    color={`#ffffff`}
                    loading={values.loading}
                    cssOverride={override}
                    size={50}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
        </div>
        </>
        : null
        }
        {values.subjectListFromGPT?.length > 0 ?
        <>
        <Step400Form formValues={values} onChange={onChange}></Step400Form>
        <Step500Form formValues={values} onChange={onChange} setIsLoading={setIsLoading}></Step500Form>
        <div className="sweet-loading">
          <RingLoader
            color={`#ffffff`}
            loading={values.loading}
            cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
        </>
        :null
        }

        {values.article_contents?.length > 0 ?
        <>
        <QuillEditor articleType={editorType} formValues={values}/>
        <ChatReq formValues={values} step={1} setIsLoading={setIsLoading}></ChatReq>
        <div className="sweet-loading">
          <RingLoader
            color={`#ffffff`}
            loading={values.loading}
            cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
        </>
        :null
        }
        {values.sub1_contents?.length > 0 ?
        <>
          <QuillEditor articleType={editorType1} formValues={values}/>
          <ChatReq formValues={values} step={2} setIsLoading={setIsLoading}></ChatReq>
        </>
          :null}
        {values.sub2_contents?.length > 0 ?
        <>
          <QuillEditor articleType={editorType2} formValues={values}/>
          <ChatReq formValues={values} step={3} setIsLoading={setIsLoading}></ChatReq>
        </>
          :null}
        {values.sub3_contents?.length > 0 ?
        <>
          <QuillEditor articleType={editorType3} formValues={values}/>
          <ChatReq formValues={values} step={4} setIsLoading={setIsLoading}></ChatReq>
        </>
          :null}
        {values.sub4_contents?.length > 0 ?
         <QuillEditor articleType={editorType4} formValues={values}/>
        :null}
        <Footer />
        <div className='h-[4000px]'></div>
      </>
  )
}


export default ArticleMaker