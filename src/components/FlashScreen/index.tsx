import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';


const FlashScreen = (props: any) => {

    return (
        <div id='page-alert-confirm' className={props.className}>
            <Link to='/Ecoleta_Web'>
                <FiCheckCircle />
                <h1>{props.text}</h1>
            </Link>
        </div>
    )
}

export default FlashScreen;