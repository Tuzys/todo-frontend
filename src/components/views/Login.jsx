import { Form, Input, Button, Row, Col, notification } from "antd";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Success:", values);
    fetch("http://localhost:3001/login", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "Username or password is incorrect") {
          notification.error({
            message: 'Wrong username or password',
          });
        } else if (data.session.token) {
          localStorage.setItem("token", data.session.token);
          localStorage.setItem("user", data.session.user);
          notification.success({
            message: "Logged in",
          });
          navigate("/");
        }                
      });
  };
  return (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{ minHeight: "100vh" }}
    >
      <Col span={4}>
        <h1>Login</h1>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ username: "", password: "" }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
        <a href="/register">Register</a>
      </Col>
    </Row>
  );
}
