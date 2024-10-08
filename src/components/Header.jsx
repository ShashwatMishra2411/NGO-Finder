import React from 'react';
import { FaBars } from "react-icons/fa6";

const Header = () => {
    return (
        <>
            <div className="flex place-items-center gap-10 h-20 bg-green-400 px-2 py-2">
                <img src="/assets/logo-Cd1et5It.png" alt="LOGO" className='h-14 w-14'/>
                <text className='text-2xl font-bold'>NGO FINDER</text>
            </div>
            
        </>
    );
};

export default Header;