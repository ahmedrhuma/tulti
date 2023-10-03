import React, { useState } from 'react';
import { FloatButton } from 'antd';
import { CarryOutOutlined, SearchOutlined, ShoppingCartOutlined, TagsOutlined } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import AddSale from './Sales/CreateSale'
import AddReservation from './Reservations/CreateReservation'
import AddItem from './Items/AddItems';
import FastSearch from './FastSearch'

const FastAccess: React.FC = () => {
    const [fastSearchDrawer, setFastSearch] = useState<boolean>(false);


    const [salePopup, setSaleForm] = useState<boolean>(false);
    const [saleForm] = ProForm.useForm();

    const [reservationsPopup, setSReservationsForm] = useState<boolean>(false);
    const [reservationsForm] = ProForm.useForm();

    const [itemPopup, setItemForm] = useState<boolean>(false);
    const [itemsForm] = ProForm.useForm();

    const onCloseSale = () => setSaleForm(false);
    const onCloseItem = () => setItemForm(false);
    const onCloseReservations = () => setSReservationsForm(false);

    const addNewReservation = (e: React.MouseEventHandler) => {
        e?.preventDefault();
        reservationsForm?.resetFields();
        setSReservationsForm(true);
    }

    const addNewSale = (e: React.MouseEventHandler) => {
        e?.preventDefault();
        saleForm?.resetFields();
        setSaleForm(true);
    }

    const addNewItem = (e: React.MouseEventHandler) => {
        e?.preventDefault();
        saleForm?.resetFields();
        setItemForm(true);
    }

    const onCloseFastSearch = () => {
        setFastSearch(false);
    }

    const toggleFastSearch = () => {
        setFastSearch(true);
    }

    return (
        <>
            <FastSearch open={fastSearchDrawer} onClose={onCloseFastSearch} />
            <AddReservation open={reservationsPopup} onClose={onCloseReservations} form={reservationsForm} />
            <AddSale open={salePopup} onClose={onCloseSale} form={saleForm} />
            <AddItem open={itemPopup} onClose={onCloseItem} form={itemsForm} />
            <FloatButton.Group trigger='click' shape="square" style={{ right: 94 }}>
                <FloatButton onClick={toggleFastSearch} icon={<SearchOutlined />} />
                <FloatButton onClick={addNewItem} icon={<TagsOutlined />} />
                <FloatButton onClick={addNewReservation} icon={<CarryOutOutlined />} />
                <FloatButton danger onClick={addNewSale} icon={<ShoppingCartOutlined />} />
            </FloatButton.Group>
        </>
    )
}

export default FastAccess;