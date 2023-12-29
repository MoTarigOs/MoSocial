import React from 'react';
import './DeleteObjectAdmin.css';
import loading from '../../Assets/icons/transparentLoadingGif.gif';

const DeleteObjectAdmin = ({ objectType, reason, setReason, setIsDeleting, handleDelete, isDeleting, setIsDelete }) => {

    
    return (

        <div className='delete'>

            <p>Do you want to delete this {objectType}?</p>

            <label>Reason</label>
            <input type='text' onChange={(e) => setReason(e.target.value)} placeholder={`What the reason for deleting this ${objectType}`}/>
        
            <div className='buttons'>
                <button onClick={() => {setIsDeleting(false); setIsDelete(false)}}>Cancel</button>
                <button onClick={handleDelete}
                style={{background: reason && reason.length > 0 && !isDeleting ? "orange" : null,
                color: reason && reason.length > 0 && !isDeleting ? "white" : null,
                padding: !isDeleting ? null : 7}}
                >{!isDeleting ? "Delete" : <img src={loading}/>}</button>
            </div>

        </div>

    )
}

export default DeleteObjectAdmin
