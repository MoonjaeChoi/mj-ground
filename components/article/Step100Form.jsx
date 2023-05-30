import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import axios from 'axios'
import morphologicalAnalyzer from '@/components/lib/morphologicalAnalyzer'
import { setProperties } from '@/pages/api/UserContext'

//////////////// [START] reduxjs/toolkit /////////////////////////
import { useSelector, useDispatch } from 'react-redux'
import { setGlobal } from '@/store/sliceWorkInfo'
//////////////// [END] reduxjs/toolkit   /////////////////////////
import styles from "@/style"
import { robot } from "../assets"
import Image from 'next/image'

import { newsAPI } from "../pages/api/api";

const Step100Form = ({ formValues, onChange, setIsLoading }) => {
  /** Step1. 관련 옵션 */
  const [options, setOptions] = useState([])
  const [currentLabel, setCurrentLabel] = useState('')
  const [newsCount, setNewsCount] = useState(0)
  const [draftWords, setDraftWords] = useState('')
  const [isClearable, setIsClearable] = useState(true)
  const [isDisabled, setIsDisabled] = useState(false)

  //////////////// [START] reduxjs/toolkit /////////////////////////
  const dispatch = useDispatch()

  /**  형태소 분석기 조회 후 키워드 제안 */
  const [suggestedkeyword, setSuggestedKeyword] = useState([])
  
  /** Step2. 관련 옵션 */
  const [newsdata, setNewsData] = useState([])
    
  /** Step 1. 최초 기본 테마 단어 로딩.*/
  //  fetchKeyword
  //    setOptions
  //   
  /** Step 2. 선택지 변경. */
  //  changeValue
  //    setCurrentLabel
  //    getNewsFromDB       // DB 조회 
  //      saveNewsLocal // 로컬변수 저장.
  //        setNewsData
  //      isNeedNewsAPI     // DB에 저장된 자료가 없을 경우 NEWS API 호출.
  //        getNewsAPI      // NEWS API 호출.
  //          cachingNewsAPI
  //            setNewsData
  //          saveNewsToDB  // DB 저장.

  ///////////////////////////////// [시작] 최초 로딩시 셀렉트 박스 세팅 ///////////////////////////////////
  /** Step 1. 최초 기본 테마 단어 로딩.*/
  const fetchKeyword = async () => {
      try {
        var items = [];
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news/getSuggestKeyword`);
        response.data.forEach(function (element) { 
            items.push({
              value: element.id,
              label: element.keyword,
              color: '#0052CC',
              isFixed: true,
              isDisabled: false
            })
        });
        setOptions(items);
      } 
      catch(error){
        console.error(error?.stack)
      }
  }
  
  useEffect(() => {
      fetchKeyword();
      console.log('inital step 100:'+formValues.draftword)
  }, []);

  ///////////////////////////////// [종료] 최초 로딩시 셀렉트 박스 세팅 ///////////////////////////////////

  const currentUserEmail = useSelector(state => {
    return state.work?.userEmail
  })

  const currentWorkNo = useSelector(state => {
    return state.work?.workNo
  })

  useEffect(() => {
    /** formValues.draftword async로 가져오기. */
    console.log('inital step 100-1:'+formValues.draftword)
  }, [currentWorkNo?currentWorkNo:null]);

  useEffect(() => {
    console.log('inital step 100-2:'+formValues.draftword)
  }, [formValues.draftword?formValues.draftword:null]);

  /** Step 2. Select Box OnChange => 선택된 단어 DB 조회 */
  const changeValue = async (e) => {
    setIsLoading(true)
    console.log('SelectDraftWords current work number : ' + currentWorkNo)
    if (e && e.label && currentWorkNo.length>0)
    {
      setCurrentLabel(e.label)
      dispatch(setGlobal({draftWord: e.label}))
      console.log('changeValue : ' + e.label)
      await setProperties('draft_word',e.label,currentWorkNo,currentUserEmail)
      await getNewsFromDB(e.label)
    }
  }

  const changeInputValue = async (e) => {
    console.log('SelectDraftWords current work number : ' + currentWorkNo)
    if (e && e.label && currentWorkNo.length>0)
    {
      formValues.newsItems.length = 0
      formValues.suggestedKeywords.length = 0
      formValues.draftword = e.label
      console.log('changeInputValue : ' + e.label)
      await setProperties('draft_word',e.label,currentWorkNo,currentUserEmail)
      await getNewsFromDB(e.label)
    }
  }
  
///////////////////////////////// [시작] 셀렉트 박스 변경시 Locol DB 조회 ///////////////////////////////
  const getNewsFromDB = async (children) => {
    setIsLoading(true)
    console.log('getNewsFromDB loading : ' + formValues.loading )
    try {
      let payload = { email: currentUserEmail, kw: children }
      console.log(payload.email)
      console.log(payload.kw)
      let res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news/getNewsKeywordsByKeyword`, {params: payload})
      let newsCount = await saveNewsLocal(res.data)

      // await isNeedNewsAPI(newsCount)

    } catch (err) {
      
      setIsLoading(false)
      console.log('getNewsFromDB loading catch : ' + formValues.loading )
      //setErr(err.message);
      return err
    } finally {
      //
      
      setIsLoading(false)
      console.log('getNewsFromDB loading finally : ' + formValues.loading )
    }
  }

  /** DB에서 읽어온 뉴스 기사 정보를 변수로 가지고 있는다.  setNewsData(news) */
  const saveNewsLocal = async (items) => {
    let readcount = 0
    formValues.newsItems.length = 0 // newsItem 초기화.
    items.forEach(function (element) {
      readcount = readcount + 1
      formValues.newsItems.push({
        title: element.NEWS_TITLE,
        link: element.NEWS_LINK,
        desc: element.NEWS_DESC,
        publishedAt: element.PUBLISHED_TS,
        press: element.PRESS
      })
    });

    setNewsCount(readcount)

    return readcount
  }

  /** Draft Words에 관한 뉴스들을 NEWS API 통해서 읽어온다. */
  const isNeedNewsAPI = async (countFromDB) => {
    console.log('isNeedNewsAPI count : ' + countFromDB)
    if (countFromDB == 0) {
        await getNewsAPI(currentLabel,process.env.NEXT_PUBLIC_FROM_DT)
    }
  }

  /** Draft Words에 관한 뉴스들을 NEWS API 통해서 읽어온다. */
  const readNewsAPI = async () => {
    console.log('readNewsAPI : ' + formValues.draftword?.length)
    if (formValues.draftword?.length > 0)
    {
      await getNewsAPI(formValues.draftword,process.env.NEXT_PUBLIC_FROM_DT)
    }
  }
  ///////////////////////////////// [종료] 셀렉트 박스 변경시 Locol DB 조회 ///////////////////////////////

  ///////////////////////////////// [시작] NEWS API 조회 ///////////////////////////////
  const getNewsAPI = async (children,from_dt) => {
    try {
      let target_url = '/v2/everything?q=' 
                     + children 
                     + '&from=' 
                     + from_dt 
                     + '&sortBy=publishedAt' 
                     + process.env.NEXT_PUBLIC_NEWS_API_KEY
      
      console.log('target_url : ' + target_url)
      const response = await newsAPI.get(`${target_url}`);

      console.log('_____ : ' + JSON.stringify(response))

      //const response = await axios.get(`${target_url}`)
      //let rows = res.data
      // const response = await fetch(target_url, {
      //   method: 'GET',
      //   headers: {
      //     Accept: 'application/json',
      //   },
      // });
  
      if (!response.ok) {
         throw new Error(`Error! status: ${response.status}`)
      }
  
      const result = await response.json()
      //await cachingNewsAPI(result)
      //await saveNewsToDB(children)

      await cachingNewsAPI2(result,children)
  
    } catch (err) {
      //setErr(err.message);
      setIsLoading(false)
    } finally {
    }
  };

  const cachingNewsAPI2 = async (items,children) => {
    var news = []
    var newsLocal = []
    var readcount = 0
    for(var key in items.articles) {
      let element = items.articles[key]
      readcount = readcount + 1
      news.push({
        user_email  : currentUserEmail,
        keyword     : children,
        from_dt     : process.env.NEXT_PUBLIC_FROM_DT,
        news_title  : element.title,
        news_desc   : element.description,
        news_link   : element.url,
        img_link    : element.urlToImage,
        press       : element.author,
        published_ts: element.publishedAt
      })

      newsLocal.push({
        NEWS_TITLE: element.title,
        NEWS_LINK: element.url,
        NEWS_DESC: element.description,
        PUBLISHED_TS: element.publishedAt,
        PRESS: element.author
      })

      axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news/saveNewsKeyword`, news[readcount-1])
        .then(function (response) {
          
        })
        .catch(function (error) {
          console.log(error.message);
        });
    }
  
    if (readcount > 0) {
      // 전역변수에 저장.
      //dispatch(setGlobal({newsItems: newsLocal}))
      // NEWS API로 부터 읽어온 기사 건 수
      //setNewsData(news);
      await saveNewsLocal(newsLocal)
    }
  
    return readcount
  }

  const cachingNewsAPI = async (items) => {
    var news = []
    var readcount = 0
    for(var key in items.articles) {
      let element = items.articles[key]
      readcount = readcount + 1
      news.push({
        id:          readcount,
        author:      element.author,
        title:       element.title,
        description: element.description,
        link:        element.url,
        image:       element.urlToImage,
        publishedAt: element.publishedAt
      })
    }
  
    if (readcount > 0) {
      // NEWS API로 부터 읽어온 기사 건 수
      setNewsData(news);
    }
  
    return readcount
  }

  const saveNewsToDB = async (children) => {
    var no = 0
    try {
      //console.log('saveNewsToDB');
      newsdata.map((news) => {
        const userData = {
          user_email  : currentUserEmail,
          keyword     : children,
          from_dt     : process.env.NEXT_PUBLIC_FROM_DT,
          news_title  : news.title,
          news_desc   : news.description,
          news_link   : news.link,
          img_link    : news.image,
          press       : news.author,
          published_ts: news.publishedAt
        };
        //console.log(news.title);
  
        axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news/saveNewsKeyword`, userData)
        .then(function (response) {
          no = no + 1
        })
        .catch(function (error) {
          console.log(error.message);
        });
      
      })
    } catch (err) {
      //setErr(err.message);
      setIsLoading(false)
      console.log(err.message)
    } finally {
    }
  };
  ///////////////////////////////// [종료] NEWS API 조회 ///////////////////////////////

  
///////////////////////////////// [시작] 형태소 분석 엔진 ///////////////////////////////////
const doMorphologicalAnalyzer = async () => {
  var plainDescText = ""
  console.log('doMorphologicalAnalyzer formValues.newsItems size : ' + formValues.newsItems.length)
  formValues.newsItems.map((news) => {
    //console.log('doMorphologicalAnalyzer : ' + news.title)
    plainDescText = plainDescText + news.desc + " "
  })
  let result = await morphologicalAnalyzer(plainDescText)
  await setProperties('suggested_keywords',JSON.stringify(result),currentWorkNo,currentUserEmail)

  let value = {
    target: {
      name: 'suggestedKeywords',
      value: result,
      type : 'list'
    }
  }
  onChange(value)
}
const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};

  return (
    <div className="section" id='first' >
      <div className={`flex-1 flex justify-center items-start flex-col xl:px-0 sm:px-16 px-6`}>
        <div className="flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2">
          <Image src={robot} alt="robot" className="w-[32px] h-[32px]" />
          <p className={`${styles.paragraph} ml-2`}>
            현재 {" "}
            <span className="text-white">작업번호 </span> : {" "}
            <span className="text-dimWhite">{currentWorkNo}</span>
          </p>
        </div>

        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px]">
            Select <br className=" hidden" />{" "}
             <span className="text-gradient">Draft Word</span>{" "}
          </h1>
        </div>
      
      
        <div className="mb-4">
          <label
            className="block text-gray-500 text-sm font-bold mb-5 leading-[2]"
            htmlFor="DraftWord"
          >
            문서를 작성하기 위한 첫 번째 단계인 <br/>초안을 작성하기 위해,<br/>
            단어를 선택하는 단계입니다. <br/>
            초안 작성 시 단어 선택은 문서의 품질과 목적에 큰 영향을 미칩니다.<br/>
            문서 작성을 위한 단어를 선택하여 주십시오.
          </label>
          <Select
            id="select-draft-words-form"
            instanceId="select-draft-words-form"
            className="rounded-full max-w-[460px] mx-auto m-1 selectInner"
            classNamePrefix="select"
            defaultValue={1}
            isDisabled={isDisabled}
            isLoading={formValues.isLoading}
            isClearable={isClearable}
            isSearchable={true}
            name="draft-words"
            options={options}
            onChange={changeInputValue}
            styles={groupBadgeStyles}
          />
        </div>

        <div className="flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2">
          <p className='font-poppins text-dimWhite ml-2 leading-[2]'>
            <span className="text-white">{"\""}{formValues.draftword} {"\" "}</span>
             에 관련된 키워드를 추출하기 위한<br/>
             뉴스 기사가 미리 준비되어 있을 경우{" "}<br/>
            <span className="text-gradient">관련 단어 분석</span> {" "}
            버튼이 활성화 됩니다. <br/> 
            <br/> 
            버튼을 눌러서 관련 키워드를 선택하시기 바랍니다. <br/> 
            그렇지 않을 경우 <br/> 
            <span className="text-gradient">관련 기사 가져오기</span> <br/> 
            버튼을 클릭하시면 <br/>
            선택한 단어와 관련된 기사를 읽어옵니다.
          </p>
        </div>

        {formValues.newsItems.length > 0 ? (
            <button
                onClick={doMorphologicalAnalyzer}
                className="btn btn-lg"
            >
              관련 단어 분석
            </button>
            ) : (
            <button
                onClick={readNewsAPI}
                className="btn btn-lg"
            >
              관련 기사 가져오기
            </button>
         )}
      </div>
    </div>
  );
};

export default Step100Form;
