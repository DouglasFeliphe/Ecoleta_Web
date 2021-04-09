import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';


const SuccessScreen = (props: any) => {

    return (
        <div id='page-alert-confirm' className={props.confirm}>
            <Link to='/Ecoleta_Web'>
                <FiCheckCircle />
                <h1>Cadastro concluído!</h1>
            </Link>
        </div>
    )
}

export default SuccessScreen;