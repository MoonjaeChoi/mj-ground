import React from 'react'

import { BiHomeAlt, BiUser } from 'react-icons/bi'
import { BsClipboardData, BsBriefcase, BsChatSquare, BsFillDice1Fill, BsFillDice2Fill, BsFillDice3Fill, BsFillDice4Fill, BsFillDice5Fill } from 'react-icons/bs'

import { Link } from 'react-scroll'

function Nav() {
  return (
    <nav className='fixed bottom-2 lg:bottom-8 w-full overflow-hidden z-50'>
        <div className='container mx-auto'>
            <div className='w-full bg-black/20 h-[96px] backdrop-blur-2xl rounded-full max-w-[460px] mx-auto px-5 flex justify-between items-center text-2xl text-white/50'>
                <Link to='first' activeClass='active'
                      smooth={true}
                      spy={true} 
                      className='cursor-pointer w-[60px] h-[60px] flex items-center justify-center'>
                  <BiHomeAlt />
                </Link>
                <Link to='second' activeClass='active'
                      smooth={true}
                      spy={true} 
                      className='cursor-pointer w-[60px] h-[60px] flex items-center justify-center'>
                  <BiUser />
                </Link>
                <Link to='third' activeClass='active'
                      smooth={true}
                      spy={true} 
                      className='cursor-pointer w-[60px] h-[60px] flex items-center justify-center'>
                  <BsClipboardData />
                </Link>
                <Link to='forth' activeClass='active'
                      smooth={true}
                      spy={true} 
                      className='cursor-pointer w-[60px] h-[60px] flex items-center justify-center'>
                  <BsBriefcase />
                </Link>
                <Link to='fifth' activeClass='active'
                      smooth={true}
                      spy={true} 
                      className='cursor-pointer w-[60px] h-[60px] flex items-center justify-center'>
                  <BsChatSquare />
                </Link>
                <Link to='sub1_prompt' activeClass='active'
                      smooth={true}
                      spy={true} 
                      className='cursor-pointer w-[60px] h-[60px] flex items-center justify-center'>
                  <BsFillDice2Fill />
                </Link>
                <Link to='sub2_prompt' activeClass='active'
                      smooth={true}
                      spy={true} 
                      className='cursor-pointer w-[60px] h-[60px] flex items-center justify-center'>
                  <BsFillDice3Fill />
                </Link>
                <Link to='sub3_prompt' activeClass='active'
                      smooth={true}
                      spy={true} 
                      className='cursor-pointer w-[60px] h-[60px] flex items-center justify-center'>
                  <BsFillDice4Fill />
                </Link>
                <Link to='sub4_prompt' activeClass='active'
                      smooth={true}
                      spy={true} 
                      className='cursor-pointer w-[60px] h-[60px] flex items-center justify-center'>
                  <BsFillDice5Fill />
                </Link>
            </div>
        </div>

    </nav>
  )
}

export default Nav