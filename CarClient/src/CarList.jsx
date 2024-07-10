//@ts-check
import React, {useEffect,useState} from "react"; 
import { TextField,Button, Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Select, MenuItem, InputLabel, FormControl} from "@mui/material";
import {Delete, Edit} from '@mui/icons-material';


function CarList({name, data, onCreate, onUpdate, onDelete, error}){
    
    console.log("CarList: "+ JSON.stringify(data));

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
        <Box className="Box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h2>{name}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex',flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <TextField
                    label="Brand"
                    variant="standard"

                    name="brand"
                    value={formData.brand === "" ?  "-" : formData.brand}
                    onChange={handleFormChange}
                />
                <TextField
                    label="Model"
                    variant="standard"

                    name="model"
                    value={formData.model === "" || formData.model === null ? "-" : formData.model}
                    onChange={handleFormChange}
                />
                <TextField
                    variant="standard"
                    label="Year"
                    name="year"
                    value={formData.year === null ? "-": formData.year}
                    onChange={handleFormChange}
                />
                <TextField
                    variant="standard"
                    label="Price"
                    name="price"
                    value={formData.price === null? "0": formData.price}
                    onChange={handleFormChange}
                    />
                <FormControl variant="standard" sx={{ minWidth:180}}>
                    <InputLabel id="reservation-label">Reservation</InputLabel>
                        <Select
                            labelId="reservation-label"
                            name="Reservation"
                            value={selectedOption}
                            onChange={handleFormChange}
                        >
                            <MenuItem value={"null"}>Choose an option</MenuItem>
                            <MenuItem value={"true"}>reserved</MenuItem>
                            <MenuItem value={"false"}>available</MenuItem>
                        </Select>
                </FormControl>
                <Button sx={{mr:1}} variant="contained" type="submit">{editingId === null ? 'Create' : 'Update'} </Button>
                {editingId && <Button variant="contained" color="secondary" type="button" onClick={handleCancelEdit}>Cancel</Button>}
            </form>
            <List sx={{ width: '100%', maxWidth: 360}}>
                {data.map(item => (
                    <ListItem key={item.id} secondaryAction={
                        <>
                            <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(item.id)}>
                                <Edit/>
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item.id)}>
                                <Delete />
                            </IconButton>
                        </>
                    }>

<ListItemText primary={"Brand"} secondary={item.brand}  />
<ListItemText primary={"Model"} secondary={item.model}  />
<ListItemText primary={"Year"} secondary={item.year}  />
<ListItemText primary={"Price"} secondary={item.price}  />
<ListItemText primary={"reservation"} secondary={item.reserved === true?"Unavailable": "Available"}  />

</ListItem>
                ))}
            </List>
        </Box>
    );
}

export default CarList;