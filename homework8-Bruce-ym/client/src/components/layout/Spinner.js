import React from 'react';
import BounceLoader from "react-spinners/BounceLoader";
import { css } from "@emotion/core";

const Spinner = () => {
    const override = css`
  display: block;
  margin: 0 auto;
`;
    return (
        <div style={{ margin: 'auto', textAlign: 'center', marginTop: '20%' }}>
            <div className="sweet-loading">
                <BounceLoader
                    css={override}
                    size={40}
                    color={"#123abc"}
                    loading={true}
                />
                <h5> <strong>Loading</strong></h5>
            </div>
        </div>

    )
    //TODO :
    // add a background og spinner
    //css -> at the 

}

export default Spinner
