import React from 'react';
import ReactTooltip from 'react-tooltip'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  EmailIcon
} from "react-share";
const ShareIcon = props => {
  const {url,size} = props;
  return (
    <div className=" d-flex justify-content-between ml-5 mr-5 mb-2">
      <ReactTooltip effect = 'solid' />
      <FacebookShareButton
      url={url}
      hashtag={"#CSCI_571_NewsApp"}
      > <FacebookIcon size={size} round={true} data-tip="FaceBook"/></FacebookShareButton>
      <TwitterShareButton 
      url={url}
      hashtags={["CSCI_571_NewsApp"]}
      > <TwitterIcon size={size} round={true} data-tip="Twitter"/></TwitterShareButton>
      <EmailShareButton 
      url={url}
      subject={"#CSCI_571_NewsApp"}
      > <EmailIcon size={size} round={true} data-tip="Email"/></EmailShareButton>
    </div>
  )
}

export default ShareIcon
