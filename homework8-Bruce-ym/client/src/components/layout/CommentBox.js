import React,{useEffect} from 'react';
import commentBox from 'commentbox.io';

const CommentBox =props=> {
    useEffect(() => {
        const removeCommentBox = commentBox('5767258311753728-proj',{
                createBoxUrl(boxId, pageLocation) {
				pageLocation.search = props.id; 
        			pageLocation.hash = boxId;
        			return boxId;
    			},
        });
        
    }, [])

        return (
            <div>
            <p>{props.id}</p>
            <div className="commentbox"/>
            </div>
        );
}

export default CommentBox
