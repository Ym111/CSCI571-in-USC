import React from 'react'
import SavedNewsbody from '../news/SavedNewsbody'
import { ToastContainer, toast,Zoom } from 'react-toastify';
function SaveNews() {
    return (
    <div>
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
