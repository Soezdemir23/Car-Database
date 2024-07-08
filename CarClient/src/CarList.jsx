//@ts-check
import React, {useState} from "react"; 


function CarList({name, data, onCreate, onUpdate, onDelete, error}){
    
    console.log(data)



    const [formData, setFormData] = useState(
        {id: '', brand: "", model: "", 
            year: null, reserved: false, price: null
        });
    const [editingId, setEditingId] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleFormChange = (event) => {
        const {name, value} = event.target;
        
        setFormData(prevData => ({
            ...prevData, [name]: value
        }));
        
        setSelectedOption(formData.reserved);
    };

    const handleSubmit = (event) =>  {
        event.preventDefault();
        console.log(formData);
        if (editingId) {
            if (selectedOption === "true"){
                formData.reserved = true;
            }else {
                formData.reserved = false;
            }
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
        setSelectedOption(item.reserved);
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
                    value={formData.brand === "" ?  "unknown" : formData.brand}
                    onChange={handleFormChange}
                />
                <input
                    type="text"
                    name="model"
                    placeholder="Model"
                    value={formData.model === "" || formData.model === null ? "unknown" : formData.model}
                    onChange={handleFormChange}
                />
                <input
                    type="text"
                    name="year"
                    placeholder="Year"
                    value={formData.year === null ? "": formData.year}
                    onChange={handleFormChange}
                />
                <input
                    type="text"
                    name="price"
                    placeholder="Price"
                    value={formData.price === null? "": formData.price}
                    onChange={handleFormChange}
                    />
                <select
                    name="reserved"
                    value={selectedOption}
                    onChange={handleFormChange}
                >
                    <option value={null}>Choose an option</option>
                    <option value={"true"}>reserved</option>
                    <option value={"false"}>available</option>
                </select>
                <button type="submit">{ editingId ? ' Update' : 'Create'}</button>
                {editingId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
            </form>
            {error && <div>{error.message}</div>}
            <h2>{name}</h2>
            <ul>
                {data.map(item => (
                    <li key={item.id}>
                        <div>{item.brand} - {item.model} - {item.year} - {item.price} - {item.reserved === true? "Unavailable": "Available"}</div>
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