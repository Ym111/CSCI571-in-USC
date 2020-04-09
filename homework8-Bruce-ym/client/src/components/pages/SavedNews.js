import React from 'react'
import SavedNewsbody from '../news/SavedNewsbody'
import { ToastContainer, toast,Zoom } from 'react-toastify';
import Navbar from '../layout/Navbar';
function SaveNews() {
    return (
    <div>
         <Navbar />
        <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    transition={Zoom}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                />
            
            <SavedNewsbody/>
    </div>
    )
}

export default SaveNews
