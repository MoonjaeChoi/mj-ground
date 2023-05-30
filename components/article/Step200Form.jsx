import React, { useEffect, useState } from 'react';
import Select from "react-select";
import axios from 'axios';
import { setGlobal,initGlobal } from '@/store/sliceWorkInfo'
import { useDispatch } from 'react-redux'

const Step200Form = ({ formValues, onChange }) => {
  //////////////// [START] reduxjs/toolkit /////////////////////////
  const dispatch = useDispatch()
  //////////////// [END] reduxjs/toolkit   /////////////////////////
  const [labels, setLabels] = useState([]);
  const [optionsWarna, setOptionsWarna] = useState([]);
  
  const handleWarnaChange = async (selected, selectaction) => {
    const { action } = selectaction;
    console.log(`action ${action}`);
    if (action === "clear") {
        } else if (action === "select-option") {
        } else if (action === "remove-value") {
            console.log("remove : " + JSON.stringify(selected));
        }
        //setWarna(selected);
        //formValues.selectedKeywords.length = 0
        //labels.length = 0

        // selected.map((sel) => (
        //   //setLabels([...labels, sel.label])
        //   setLabels([...labels, sel.label])
        // ))

        let value = {
          target: {
            name: 'selectedKeywords',
            value: selected,
            type : 'list'
          }
        }
        onChange(value)
    };

    useEffect(() => {
        optionsWarna.length = 0
        if (formValues.suggestedKeywords.length > 0)
        {
            let notes = []
            let no =0 
            formValues.suggestedKeywords.forEach(function (element) { 
                no = no + 1
                notes.push({
                    value: no,
                    label: element
                })
            });
            setOptionsWarna(notes)
        }
    }, [formValues.suggestedKeywords])

      return (
      <div className='section' id='second'>
        <div className={`flex-1 flex justify-center items-start flex-col xl:px-0 sm:px-16 px-6`}>
          <div className="mb-4">
            <label
              className="block text-gray-500 text-sm font-bold mb-5 leading-[2]"
              htmlFor="DraftWord"
            >
              제목을 정할 때 관련된 키워드를 고르는 방법에는 다양한 방법이 있지만,<br/>
              다음과 같은 방법을 고려할 수 있습니다:<br/>
              <br/>
              1. 주요 내용 파악<br/>
              제목을 정하기 전에 문서의 주요 내용을 파악하는 것이 중요합니다.<br/>
              문서에서 다루는 핵심 내용을 정리하고, <br/>
              해당 내용과 관련된 주요 단어를 파악합니다. <br/>
              이러한 단어들은 제목을 정하는 데 유용한 키워드가 될 수 있습니다.<br/>
              <br/>
              2. 목적을 고려<br/>
              문서의 목적에 맞게 키워드를 선택하는 것이 중요합니다. <br/>
              예를 들어, 정보를 전달하는 문서인 경우, <br/>
              "알림", "가이드", "설명"과 같은 키워드를 선택할 수 있습니다.<br/>
              반면, 문제를 해결하거나 창의적인 아이디어를 제시하는 문서인 경우, <br/>
              "해결책", "아이디어", "혁신"과 같은 키워드를 선택할 수 있습니다.<br/>
              <br/>
              <br/>
              적절한 키워드를 선택하고, <br/>
              이를 조합하여 간결하고 명확한 제목을 작성하는 것이 좋습니다.<br/>
            </label>
            <Select
                id="relate-select"
                instanceId="relate-select"
                isMulti
                name="relate-select"
                className="rounded-full max-w-[460px] mx-auto m-1 selectInner basic-multi-select"
                classNamePrefix="select"
                options={optionsWarna}
                onChange={handleWarnaChange}
                placeholder="Select Related Keywords"
            />
          </div>
        </div>
      </div>
    )
  }
  
export default Step200Form

