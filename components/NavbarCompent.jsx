import Image from 'next/image'
import React from 'react'

const NavbarComponent = () => {

    return (

        <div className='flex justify-center bg-transparent'>
            <div className="navbar backdrop-blur-md w-5/6 rounded-lg shadow-lg border border-gray-300 fixed">
                <div className="navbar-start">
                    <a className="navbar-item">Ripple UI</a>
                    <Image
                        alt="logo-main"
                        src="/assets/backlogo.png"
                        width={60}
                        height={60}
                    />
                    
                </div>
               
                <div className="navbar-end">
                    <a className="navbar-item btn btn-primary" href='/login'>Login</a>
                </div>
            </div>
        </div>
    )
}

export default NavbarComponent