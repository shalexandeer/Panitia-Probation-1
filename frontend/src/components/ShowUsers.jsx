import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';

const ShowUsers = () => {
    const [loading, setLoading] = useState(true);

    const [users, setUsers] = useState([]);

    const loadName = async () => {
        try {
            let { data } = await axios('https://jsonplaceholder.typicode.com/users/');
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.log('err message: ', error);
        }
    };

    useEffect(() => {
        loadName().then((r) => r);
    }, []);

    return (
        <div>
            <Card>
                <Card.Title>Users : {users.length}</Card.Title>
                <Card.Body>
                    {loading ? (
                        <div>Screen reloading</div>
                    ) : (
                        <ol>
                            {users.map((userData) => {
                                return (
                                    <li key={userData.id}>
                                        {userData.name}({userData.username})
                                    </li>
                                );
                            })}
                        </ol>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default ShowUsers;
