import { DeleteOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, List, Col, Row, Space, Divider } from "antd";
import produce from "immer";
import { useEffect, useState } from "react";
import useBackend from "./useBackend";


export default function TaskList() {
    const {sendRequest} = useBackend();
    const [tasks, setTasks] = useState([]);

    var token;
    if (localStorage.getItem("token")) {
        token = localStorage.getItem('token');
    }
    useEffect(() => {
        if (!token)  return;
        console.log(token)
        fetch(`http://localhost:3001/tasks` , {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })
            .then(response => response.json())
            .then(data => {setTasks(data.tasks); console.log(data); })
    }, []);

  
    const handleNameChange = (task, event) => {
        const newName = event.target.value;

        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].name = newName;
        });
        setTasks(newTasks);
        const updatedTask = { ...task, name: newName}
        console.log(updatedTask)

        fetch(`http://localhost:3001/tasks/${task.id}`, {
            method: "PUT",
            body: JSON.stringify(updatedTask),
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
        })
        .catch(error => {
            console.error('Error updating task:', error.message);
        });
    };

    const handleCompletedChange = (task, event) => {
        console.log(event)
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].completed = event.target.checked;
        });
        setTasks(newTasks);
    };

    const handleAddTask = () => {
        const newTask = {
            name: "aa"
        }

        try {
            fetch("http://localhost:3001/tasks", {
                method: "POST",
                body: JSON.stringify(newTask),
                headers: {
                    "Content-Type": "application/json",
                    "token": token
                }
            })
        fetch("http://localhost:3001/tasks", {
            method:"GET",
            headers:{
                "Content-Type": "application/json",
                "token": token
            }
        })
            .then(response => response.json())
            .then(data => {setTasks([data.tasks])})

        } catch (error) {
            console.log(error);
        }


            setTasks(produce(tasks, draft => {
                draft.push(newTask);
            }));
    };

    const handleDeleteTask = (task, taskId) => {
        fetch(`http://localhost:3001/tasks/${taskId}`, {
            method: "DELETE",
            body: JSON.stringify(task),
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })

        setTasks(produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft.splice(index, 1);
        }));
    };

    return (
        <Row type="flex" justify="center" style={{minHeight: '100vh', marginTop: '6rem'}}>
            <Col span={12}>
                <h1>Task List</h1>
                <a href="/logout">Log Out</a>
                <Button onClick={handleAddTask}>Add Task</Button>
                <Divider />
                <List
                    size="small"
                    bordered
                    dataSource={tasks}
                    renderItem={(task) => <List.Item key={task.id}>
                        <Row type="flex" justify="space-between" align="middle" style={{width: '100%'}}>
                            <Space>
                                <Checkbox checked={task.completed} onChange={(e) => handleCompletedChange(task, e)} />
                                <Input value={task.name} onChange={(event) => handleNameChange(task, event)} />
                            </Space>
                            <Button type="text" onClick={() => handleDeleteTask(task)}><DeleteOutlined /></Button>
                        </Row>
                    </List.Item>}
                />
            </Col>
        </Row>
    )
}