import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SignUp = () => {
    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(3, 'Name must be at least 3 characters')
                .required('Name is required'),
            email: Yup.string()
                .email('Invalid email format')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                await axios.post('http://localhost:4000/users', {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    role: 'employee',
                });
                history.push('/login');
            } catch (error) {
                console.error('Error signing up:', error);
            }
        },
    });

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={formik.handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </label>
                {formik.touched.name && formik.errors.name && (
                    <p style={{ color: 'red' }}>{formik.errors.name}</p>
                )}

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

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
