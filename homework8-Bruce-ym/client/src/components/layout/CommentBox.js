import React,{useEffect} from 'react';
import commentBox from 'commentbox.io';

const CommentBox =props=> {
    useEffect(() => {
        const removeCommentBox = commentBox('5723360122109952-proj');

        return () => {
            removeCommentBox();
        }
        
    }, [])

        return (
            <div>

            <div className="commentbox" id={props.id}/>
            </div>
        );
}

export default CommentBox
