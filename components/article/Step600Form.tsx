import React, { useState, useEffect } from 'react'
import * as ISelectType from './IObjType'
import { ActionMeta, SingleValue } from "react-select"
import CustomSelect from './CustomSelect'

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
}

interface ArrayObjectSelectState {
  selectedVehicle: Vehicle | null;
}


const vehicles: Vehicle[] = [
  { id: 1, make: 'Audi', model: 'A4', year: 2009,  },
  { id: 2, make: 'Beta', model: 'Betman', year: 2010,  },
  { id: 3, make: 'Cesc', model: 'Bug', year: 2023,  },
  { id: 4, make: 'Emma', model: 'Horse', year: 2023,  },
  { id: 5, make: 'Ford', model: 'Fiesta', year: 2023,  },
  { id: 6, make: 'Gene', model: 'Motor', year: 2023,  },
  { id: 7, make: 'KIA', model: 'Grandu', year: 2023,  },
  { id: 8, make: 'Hyun', model: 'K9', year: 2009, },
];

type Props = {}

const Step600Form = (props: Props) => {

  const [suggestedkeyword, setSuggestedKeyword] = useState<ISelectType.IOptionObj[]>([])

  useEffect(() => {
    let list: Array<ISelectType.IOptionObj> = []

    list.push({
      label: '선택',
      color: 'gray',
      isDisabled: true,
    })

    vehicles.map((item, i) => {
      list.push({
        label: item.model,
        color: 'red'
      })
    })

    setSuggestedKeyword(list)
  }, [])

  const onChangeWord = (
    newValue: SingleValue<ISelectType.IOptionObj>,
    actionMeta: ActionMeta<ISelectType.IOptionObj>
  ) => {
    const name = newValue?.label;
    const color = newValue?.color;
  }

  return (
    <div className="container">
      <h3>스케줄 수정</h3>
      <div className="content">
        <p className="modal">
          <span>직원</span>
          {/* <CustomSelect>
           </CustomSelect> */}
        </p>
      </div>
    </div>
  )
}

export default Step600Form