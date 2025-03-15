import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const UserProfile = () => {
    const { user } = useContext(UserContext);
    const [employeeList, setEmployeeList] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [currentUser, setCurrentUser] = useState(user || null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'employee' });

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchUsers();
        } else {
            loadTasks(user?.id);
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('http://localhost:4000/users');
            setEmployeeList(data.filter(emp => emp.role !== 'admin'));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const loadTasks = async (userId) => {
        try {
            const { data } = await axios.get(`http://localhost:4000/tasks?assignedTo=${userId}`);
            setTaskList(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchUserHistory = (userId) => {
        setCurrentUser(employeeList.find(emp => emp.id === userId));
        loadTasks(userId);
    };

    const handleUserInput = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const submitNewUser = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:4000/users', newUser);
            fetchUsers();
            setIsFormVisible(false);
            setNewUser({ name: '', email: '', password: '', role: 'employee' });
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <div>
            <h2>User Profiles</h2>
            {user?.role === 'admin' && (
                <div>
                    <button onClick={() => setIsFormVisible(!isFormVisible)}>
                        {isFormVisible ? 'Cancel' : 'Add New User'}
                    </button>

                    {isFormVisible && (
                        <form onSubmit={submitNewUser}>
                            {['name', 'email', 'password'].map((field) => (
                                <div key={field}>
                                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                                    <input
                                        type={field === 'password' ? 'password' : 'text'}
                                        name={field}
                                        value={newUser[field]}
                                        onChange={handleUserInput}
                                        required
                                    />
                                </div>
                            ))}
                            <div>
                                <label>Role:</label>
                                <select name="role" value={newUser.role} onChange={handleUserInput} required>
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit">Create User</button>
                        </form>
                    )}

                    <ul>
                        {employeeList.map(emp => (
                            <li key={emp.id}>
                                <strong>Name:</strong> {emp.name} <br />
                                <strong>Email:</strong> {emp.email} <br />
                                <button onClick={() => fetchUserHistory(emp.id)}>Get History</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {(user?.role !== 'admin' || currentUser) && (
                <div>
                    <h3>Tasks Worked By {currentUser?.name}</h3>
                    <ul>
                        {taskList.map(task => (
                            <li key={task.id}>
                                <strong>Title:</strong> {task.title} <br />
                                <strong>Description:</strong> {task.description} <br />
                                <strong>Status:</strong> {task.status}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
