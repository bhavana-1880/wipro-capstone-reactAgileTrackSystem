import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { useHistory } from 'react-router-dom';

const ScrumDetails = ({ scrum }) => {
    const [taskList, setTaskList] = useState([]);
    const [scrumMembers, setScrumMembers] = useState([]);
    const { user } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        const verifyUser = () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser) {
                history.push('/login');
            }
        };

        verifyUser();
    }, [history]);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/tasks?scrumId=${scrum.id}`);
                setTaskList(response.data);
            } catch (error) {
                console.error('Error loading tasks:', error);
            }
        };

        loadTasks();
    }, [scrum.id]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                const relatedUsers = response.data.filter(member => 
                    taskList.some(task => task.assignedTo === member.id)
                );
                setScrumMembers(relatedUsers);
            } catch (error) {
                console.error('Error loading users:', error);
            }
        };

        if (taskList.length > 0) {
            loadUsers();
        }
    }, [taskList]);

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await axios.patch(`http://localhost:4000/tasks/${taskId}`, {
                status: newStatus,
                history: [
                    ...taskList.find(task => task.id === taskId).history,
                    {
                        status: newStatus,
                        date: new Date().toISOString().split('T')[0], // Current date
                    },
                ],
            });

            setTaskList(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    return (
        <div>
            <h3>Scrum Details: {scrum.name}</h3>
            <h4>Task List</h4>
            <ul>
                {taskList.map(task => (
                    <li key={task.id}>
                        <strong>{task.title}:</strong> {task.description} - <em>{task.status}</em>
                        {user?.role === 'admin' && (
                            <select
                                value={task.status}
                                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                            >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        )}
                    </li>
                ))}
            </ul>
            <h4>Scrum Members</h4>
            <ul>
                {scrumMembers.map(member => (
                    <li key={member.id}>
                        {member.name} ({member.email})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ScrumDetails;
