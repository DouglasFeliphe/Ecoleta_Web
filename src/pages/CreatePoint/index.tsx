import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import axios from 'axios';

import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import './styles.css';

interface Item {
    id: number,
    title: string,
    image_url: string,
    active: boolean
}

interface Point {
    id: number
    name: string
    email: string
    whatsapp: string
}

interface IBGE_UF_Response {
    id: number
    sigla: string
    nome: string
}
interface IBGE_City_Response {
    nome: string
}

const CreatePoint: React.FC = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [items, setItems] = useState<Item[]>([])
    const [itemActive, setItemActive] = useState(false)
    const [ufs, setUfs] = useState<string[]>([])
    const [selectedUf, setSelectedUf] = useState('0')
    const [cities, setCities] = useState<string[]>([])
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedMapPosition, setSelectedMapPosition] = useState<[number, number]>([0, 0]);
    const [inititalMapPosition, setInititalMapPosition] = useState<[number, number]>([0, 0]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });
    const [confirm, setConfirm] = useState(' ');

    const history = useHistory()

    useEffect(() => {
        //  carregando a localização atual do usuário no mapa
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            setInititalMapPosition([latitude, longitude])
        })
    }, [])

    useEffect(() => {
        // listando todos os items de coleta
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])

    useEffect(() => {
        axios.get<IBGE_UF_Response[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const ufInitials = response.data.map(uf => uf.sigla)
                setUfs(ufInitials)
            })
    }, [])

    useEffect(() => {
        // carregar as cidades sempre que a UF mudar 
        if (selectedUf === '0') {
            return
        }
        axios.get<IBGE_City_Response[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf.toLowerCase()}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome)
                setCities(cityNames)
            })
    }, [selectedUf])
    // carregando a tela da confirmação de cadastro do ponto, sempre que o ponto for cadastrado
    useEffect(() => {

        setConfirm(confirm)
    }, [confirm])


    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target
        // pega todos os dados que já existiam no formData e insere novos
        // insere o valor baseado no nome do campo(name,email,whatsapp)...
        setFormData({ ...formData, [name]: value })
    }

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        let uf = event.target.value
        setSelectedUf(uf)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        let city = event.target.value
        setSelectedCity(city)
    }

    function handleMapClick(event: LeafletMouseEvent) {
        // pegando a latitude e longitude ao clicar no mapa
        setSelectedMapPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleSelectItem(id: number) {

        const alreadySelectedItem = selectedItems.findIndex(item => item === id)
        if (alreadySelectedItem >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        } else {
            setSelectedItems([...selectedItems, id])
        }

    }

    function handleSubmit(event: FormEvent) {
        // impede o recarregamento da página
        event.preventDefault()

        const { whatsapp, email, name } = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedMapPosition
        const items = selectedItems

        const data = {
            name,
            whatsapp,
            email,
            uf,
            city,
            latitude,
            longitude,
            items
        }

        // await api.post('point', data)
        setConfirm('visible')
        console.log('confirm :>> ', confirm)
    }

    return (
        <>
            <div id="page-create-point">
                <header>
                    <img src={logo} alt="" />
                    <Link to='/' >
                        <FiArrowLeft />
                    Voltar para home
                </Link>
                </header>

                <form onSubmit={e => handleSubmit(e)}>
                    <h1>Cadastro do<br /> ponto de coleta</h1>
                    <fieldset>
                        <legend>
                            <h2>Dados</h2>
                        </legend>

                        <div className="field">
                            <label htmlFor="name">Nome da Entidade</label>
                            <input
                                type="text"
                                id='name'
                                name='name'
                                onChange={e => handleInputChange(e)} />
                        </div>
                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="Email">Email</label>
                                <input
                                    type="text"
                                    id='email'
                                    name='email'
                                    onChange={e => handleInputChange(e)} />
                            </div>
                            <div className="field">
                                <label htmlFor="Whatsapp">Whatsapp</label>
                                <input
                                    type="text"
                                    id='whatsapp'
                                    name='whatsapp'
                                    onChange={e => handleInputChange(e)} />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <h2>Endereço</h2>
                            <span>Selecione o endereço no mapa</span>
                        </legend>
                        {/* Geolocalização */}
                        <Map center={inititalMapPosition} zoom={12} onClick={handleMapClick}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={selectedMapPosition}></Marker>
                        </Map>
                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="uf">Estado(UF)</label>
                                <select
                                    id='uf'
                                    name='uf'
                                    value={selectedUf}
                                    onChange={e => handleSelectUf(e)}   >

                                    <option value="0">Selecione uma UF: </option>
                                    {ufs.map(uf => (
                                        <option key={uf} value={uf}>{uf}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="city">Cidade</label>
                                <select
                                    id='city'
                                    name='city'
                                    value={selectedCity}
                                    onChange={handleSelectCity} >

                                    <option value="0">Selecione uma city</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </fieldset>
                    <fieldset>
                        <legend>
                            <h2>Ítems de coleta</h2>
                            <span>Selecione um ou mais ítens abaixo</span>
                        </legend>
                        {/* listagem de items de coleta */}
                        <ul className='items-grid'>
                            {
                                items.map(item => (
                                    <li key={item.id} className={selectedItems.includes(item.id) ? 'selected' : ''} onClick={() => handleSelectItem(item.id)} >
                                        <img src={item.image_url} alt={item.title} />
                                        <span>{item.title}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </fieldset>

                    <button type="submit">Cadastrar Ponto de Coleta</button>
                </form>
            </div >

            <div id='page-alert-confirm' className={confirm}>
                <Link to='/'>
                    <FiCheckCircle />
                    <h1>Cadastro concluído!</h1>
                </Link>
            </div>

        </>
    )
}

export default CreatePoint;