import { close, logo, menu } from "../assets"
import { navLinks } from "../constants"
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Link from 'next/link'
import { RxSketchLogo, RxDashboard, RxPerson, RxArrowLeft} from 'react-icons/rx'
import { HiOutlineShoppingBag } from 'react-icons/hi'
import { MdChevronLeft, MdChevronRight} from 'react-icons/md'

import ChatRow from '@/components/chat/ChatRow'
import NewChat from '@/components/chat/NewChat'
import styles from '@/style'
import { quinan } from "../assets"

import { useSelector } from 'react-redux'

const Workbar = ({ formValues }) => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [works, setWorks] = useState([])

  const currentUserEmail = useSelector(state => {
    return state.work?.userEmail
  })

  const getWorkChat = async () => {
    try {
      let payload = { email: currentUserEmail,}
      console.log(payload.email);
      const result = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/work/getWorkByNo`, {params: payload})
      const works = await updateCurrent(result)
    } catch (err) {
      //setErr(err.message);
    } finally {
    }
  }

  const updateCurrent = async (e) => {
    let rows = e.data
    let items = []
    let index = 0
    rows.forEach(function (element) { 
        index = index + 1
        items.push({
            key : index,
            work_no: element.work_no,
        })
    });
    setWorks(items)
    return items
  }

  function handleRemove(id) {
    const newList = works.filter((item) => item.work_no !== id)

    setWorks(newList)
  }

  function handleAdd(id) {
    let newItem = {
        key: works.length+1,
        work_no: id,
    }

    setWorks(oldWorks => [...oldWorks, newItem])
  }

  useEffect(() => {
      getWorkChat()
  }, [currentUserEmail]);

  const slideLeft = () => {
    var slider = document.getElementById('slider')
    slider.scrollLeft = slider.scrollLeft - 500
  }

  const slideRight = () => {
    var slider = document.getElementById('slider')
    slider.scrollLeft = slider.scrollLeft + 500
  }

  const onClicked = async (id) => {
    setActive(id)
    setToggle(false)
  }

  // sm:flex hidden justify-end items-center flex-1
  // <nav className="w-full flex py-6 justify-between items-center navbar">
  return (
    <>
    <nav className="relative flex items-center z-[99]" >
      {/* <Image src={logo} alt="discovery" className="w-[124px] h-[32px]" /> */}
      <MdChevronLeft size={40} onClick={slideLeft} className="text-white opacity-50 cursor-pointer hover:opacity-100"/>
      <div id='slider' className="sm:flex hidden w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide">
        
        <div className="w-[100px] inline-block p-2">
          <NewChat handleAdd={handleAdd} />
        </div>
        {works.map((work, index) => (
            <div key={work.work_no}
                className={`w-[220px] inline-block font-poppins font-normal cursor-pointer text-[16px] ${
                active === work.work_no ? "text-white" : "text-dimWhite"
              } ${index === works.length - 1 ? "mr-0" : "mr-10"}`}
              onClick={() => setActive(work.work_no)}
            >
              <ChatRow work_no={work.work_no} handleRemove={handleRemove}/>
            </div>
            ))
        }
        
      </div>
      <MdChevronRight size={40} onClick={slideRight} className="text-white opacity-50 cursor-pointer hover:opacity-100"/>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <Image
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[220px] rounded-xl sidebar`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            <NewChat handleAdd={handleAdd} />
            {works.map((work, index) => (
                <li key={work.work_no}
                    className={`font-poppins font-small cursor-pointer text-[16px] w-[200px] ${
                    active === work.work_no ? "text-white" : "text-dimWhite"
                } ${index === works.length - 1 ? "mr-0" : "mr-10"}`}
                onClick={() => onClicked(work.work_no)}
                >
                <ChatRow formValues={formValues} work_no={work.work_no} handleRemove={handleRemove}/>
                </li>
                ))
            }
          </ul>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Workbar
