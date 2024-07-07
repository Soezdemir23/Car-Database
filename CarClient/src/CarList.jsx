//@ts-check
import React, {useState} from "react"; 


function CarList({name, data, onCreate, onUpdate, onDelete, error}){
    
    console.log(data)



    const [formData, setFormData] = useState(
        {id: '', brand: "", model: "", 
            year: null, reserved: false, price: null
        });
    const [editingId, setEditingId] = useState(null);
    

    const handleFormChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevData => ({
            ...prevData, [name]: value
        }));
    };

    const handleSubmit = (event) =>  {
        event.preventDefault();
        if (editingId) {
            onUpdate(formData);
            setEditingId(null);
        } else {
            onCreate(formData);
        }
        setFormData({id: '', brand: "", model: "", 
            year: null, reserved: false, price: null
        });
    }

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({
            id: item.id, brand: item.brand, model: item.model, 
            year: item.year, reserved: item.reserved, price: item.price
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({id: '', brand: "", model: "", 
            year: null, reserved: false, price: null
        });
    }

    return (
        <div>
            <h2>New {name}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="brand"
                    placeholder="Brand"
                    value={formData.brand}
                    onChange={handleFormChange}
                />
                <input
                    type="text"
                    name="model"
                    placeholder="Model"
                    value={formData.model}
                    onChange={handleFormChange}
                />
                <input
                    type="text"
                    name="year"
                    placeholder="Year"
                    value={formData.year === null ? 0: formData.year}
                    onChange={handleFormChange}
                />
                <input
                    type="text"
                    name="reserved"
                    placeholder="Reserved"
                    value={
                        formData.reserved !== null
                        ? formData.reserved === true
                            ? "reserved"
                            : "available"
                        : "unknown"
                    }
                    onChange={handleFormChange}
                />
                <button type="submit">{ editingId ? ' Update' : 'Create'}</button>
                {editingId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
            </form>
            {error && <div>{error.message}</div>}
            <h2>{name}</h2>
            <ul>
                {data.map(item => (
                    <li key={item.id}>
                        <div>{item.brand} - {item.model} - {item.year} - {item.price} - {item.reserved === true? "Available": "Unavailable"}</div>
                        <div>
                            <button onClick={() => handleEdit(item)}>Edit</button>
                            <button onClick={() => onDelete(item.id)}> Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            
        </div>
    );
}

export default CarList;