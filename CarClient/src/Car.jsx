//@ts-check
const term = "Car";
import React, { useState, useEffect } from 'react';

import CarList from './CarList';


function Car() {
    const [data,setData] = useState([]);
    const [maxId, setMaxId] = useState(0);

    useEffect(() => {
        fetchCarData();
    }, []);

    const fetchCarData = async () => {
        //first simulate getting data from the API:
        const carRequest = await fetch("http://localhost:5100/cars")
        const carResponse = await carRequest.json();
        await setData(carResponse);
        await setMaxId(Math.max(...carResponse.map(car => car.id)));
        
        // setData(carData);
        // setMaxId(Math.max(...carData.map(car => car.id)));
            
    };

    const handleCreate = (item) => {
        // Simulate creating item on API
        const newItem = { ...item, id: data.length + 1};
        setData([...data, newItem]);
        setMaxId(maxId + 1);
    };

    const handleUpdate = (item) => {
        //Simulate an update on the API
        const updatedData = data.map(car => car.id === item.id ? item :car);
        setData(updatedData);
    }

    const handleDelete = (id) => {
        // Simulate an item deletion on API
        const updatedData = data.filter(car => car.id !== id);
        setData(updatedData);
    }

    return (
        <div>
            <CarList 
            name={term}
            data={data}
            onCreate = {handleCreate}
            onUpdate = {handleUpdate}
            onDelete = {handleDelete}
            />
        </div>
        
    )
}

export default Car;