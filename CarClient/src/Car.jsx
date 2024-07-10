
import React, { useState, useEffect } from 'react';
import CarList from './CarList';

const term = "Car";
const API_URL = "/cars";
const headers = {
    "Content-Type": 'application/json',
};



function Car() {
    const [data,setData] = useState([]);
    const [error,setError] = useState(null);
    // const [maxId, setMaxId] = useState(0);

    useEffect(() => {
        fetchCarData();
    }, []);

    const fetchCarData = () => {
        //first simulate getting data from the API:
        fetch(API_URL)
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => setError)
    };

    const handleCreate = (item) => {
        console.log('add item:' + JSON.stringify(item));

        fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(
                {brand: item.brand, model: item.model, year: item.year,
                    reserved: item.reserved, price: item.price
                })
        })
            .then(response => response.json())
            .then(returnedItem => setData([...data,returnedItem]))
            .catch(error=>setError(error));
    };

    const handleUpdate = (updatedItem) => {
        //Simulate an update on the API
        console.log(`update item${JSON.stringify(updatedItem)}`);

        fetch(`${API_URL}/${updatedItem.id}`,  {
            method: 'PUT',
            headers,
            body: JSON.stringify(updatedItem),
        })
        .then(() => setData(data.map(item => item.id === updatedItem.id ? updatedItem : item)))
        .catch(error => setError(error));
    }

    const handleDelete = (id) => {
        // Simulate an item deletion on API
            fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers,
              })
                .then(() => setData(data.filter(item => item.id !== id)))
                .catch(error => console.error('Error deleting item:', error));
        }

    return (
        <div>
            <CarList 
            name={term}
            data={data}
            error={error}
            onCreate = {handleCreate}
            onUpdate = {handleUpdate}
            onDelete = {handleDelete}
            />
        </div>
        
    )
}

export default Car;