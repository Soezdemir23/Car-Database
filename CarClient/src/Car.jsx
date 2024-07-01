const term = "Car";

function Pizza() {
    const [data,setData] = useState([]);
    const [maxId, setMaxId] = useState(0);

    useEffect(() => {
        fetchCarData();
    }, []);

    const fetchCarData = () => {
        //first simulate getting data from the API:
        const carData = [
            { id: 1, brand: "Tesla", model: "Y - 300", year: 1990, Reserved: false, price: 19000},
            { id: 2, brand: "Ford", model: "Mustang F'", year: 2030, Reserved: true, price: 5400},
            { id: 3, brand: "Lamborghini", model: "Murcielago Genesis", year: 2080, Reserved: true, price: Number.MAX_SAFE_INTEGER},
        ];
        setData(carData);
        setMaxId(Math.max(...carData.map(car => car.id)));
    };

    const handleCreate = (item) => {
        // Simulate creating item on API
        const newItem = { ...item, id: data.length + 1};
        setData([...data, newItem]);
        setMaxId(maxId + 1);
    }
}