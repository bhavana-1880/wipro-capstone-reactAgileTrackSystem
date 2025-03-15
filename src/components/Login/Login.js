import React, { useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '../../context/UserContext';

const Login = () => {
    const history = useHistory();
    const { login } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email format').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.get(`http://localhost:4000/users?email=${values.email}&password=${values.password}`);
                if (response.data.length > 0) {
                    const user = response.data[0];
                    login(user);
                    user.role === 'admin' ? history.push('/') : history.push('/profiles');
                } else {
                    alert('Invalid email or password');
                }
            } catch (error) {
                console.error('Error logging in:', error);
            }
        },
    });

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={formik.handleSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </label>
                {formik.touched.email && formik.errors.email && (
                    <p style={{ color: 'red' }}>{formik.errors.email}</p>
                )}

                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </label>
                {formik.touched.password && formik.errors.password && (
                    <p style={{ color: 'red' }}>{formik.errors.password}</p>
                )}

                <button type="submit">Login</button>
            </form>
            <button onClick={() => history.push('/signup')}>Sign Up</button>
        </div>
    );
};

export default Login;
