import React from 'react'
import { Form, Input, Button, Row, Col, notification } from "antd";
import useBackend from './useBackend';
import { useNavigate } from "react-router";

export default function Register() {
    const {sendRequest} = useBackend();
    const navigate = useNavigate();

    const onFinish = (values) => {
        fetch("http://localhost:3001/register",{
            method : "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response=>response.json())
        .then(data =>{
            if (data.status == "Username already exists"){
                notification.error({
                    message: 'Username already exists'
                });
            } else {
                notification.success({
                    message: 'Log into your new account'
                });
                navigate("/login");
        }
        console.log('Success:', values);
        });
    };

  return (
    <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
    <Col span={4}>
        <h1>Register</h1>
        <Form
            name="basic"
            layout="vertical"
            initialValues={{ username: "", password: "" }}
            onFinish={onFinish}
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                label="Repeat Password"
                name="passwordRepeat"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Register</Button>
            </Form.Item>
        </Form>
        <a href="/login">Login</a>
    </Col>
</Row>
  )
}
