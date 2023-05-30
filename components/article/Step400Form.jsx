import React, { useEffect, useState } from 'react';
import Select from "react-select";
import { setGlobal } from '@/store/sliceWorkInfo'
import { useDispatch, useSelector } from 'react-redux'

const Step400Form = ({ onChange, formValues }) => {
  //////////////// [START] reduxjs/toolkit /////////////////////////
  const dispatch = useDispatch()
  const subjectListFromGPT = useSelector(state => {
    return state.work?.responseSubjects
  })
  //////////////// [END] reduxjs/toolkit   /////////////////////////

  const [isClearable, setIsClearable] = useState(true)
  const [isSearchable, setIsSearchable] = useState(true)
  const [isDisabled, setIsDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRtl, setIsRtl] = useState(false)
  const [options, setOptions] = useState([])
  const [selectedSubjects, setSelectedSubjects] = useState('')
  
  const changeValue = (e) => {
    if (e && e.label)
    {
//      dispatch(setGlobal({postTitle: e.label}))
      setSelectedSubjects(e.label)
      formValues.subject = e.label
      
      
      console.log('selectedSubject : ' + selectedSubjects)
    }
  }

  useEffect(()=>{
    console.log('subjectListFromGPT : ' + formValues.subjectListFromGPT)
    if (formValues.subjectListFromGPT?.length > 0)
    {
        let items = []
        let no =0 
        formValues.subjectListFromGPT.forEach(function (element) { 
            no = no + 1
            items.push({
                value: no,
                label: element
            })
            console.log('subjectListFromGPT element : ' + element)
        });
        
        setOptions(items);
    }
  }, [formValues.subjectListFromGPT])

    return (
      <div className='section' id='forth'>
        <div className={`flex-1 flex justify-center items-start flex-col xl:px-0 sm:px-16 px-6`}>
          <div className="mb-4">
              <Select
                  id="select-single-select"
                  instanceId="select-single-select"
                  name="select-single-select"
                  className="rounded-full max-w-[460px] mx-auto m-1 selectInner"
                  classNamePrefix="select"
                  defaultValue={options[0]}
                  isDisabled={isDisabled}
                  isLoading={isLoading}
                  isClearable={isClearable}
                  isRtl={isRtl}
                  isSearchable={isSearchable}
                  options={options}
                  onChange={changeValue}
                  placeholder="Select Subject"
              />
          </div>
        </div>
      </div>
    )
  }
  
export default Step400Form

