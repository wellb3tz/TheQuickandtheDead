import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import BackButton from './BackButton';
import Spinner from './Spinner';
import '../western-theme.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    console.log('Login component mounted');
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.onEvent('auth', (authData) => {
        fetch('https://thequickandthedead.onrender.com/telegram_auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(authData),
        })
          .then(response => response.json())
          .then(data => {
            if (data.access_token) {
              localStorage.setItem('token', data.access_token);
              localStorage.setItem('username', authData.username); // Store username
              setMessage("Login successful!");
              history.push('/post-login');
            } else {
              setMessage(data.msg);
            }
          });
      });
    } else {
      console.error('Telegram WebApp is not defined');
    }
  }, []);

  const handleLogin = () => {
    setLoading(true);
    console.log('Login button clicked');
    fetch('https://thequickandthedead.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('username', username); // Store username
          setMessage("Login successful!");
          history.push('/post-login');
        } else {
          setMessage(data.msg);
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
        setMessage('An error occurred. Please try again.');
      });
  };

  const handleShot = (e) => {
    const button = e.target;
    const rect = button.getBoundingClientRect();
    const hole = document.createElement('div');
    hole.className = 'hole';
    hole.style.left = `${e.clientX - rect.left - 5}px`;
    hole.style.top = `${e.clientY - rect.top - 5}px`;
    button.appendChild(hole);
    setTimeout(() => {
      button.removeChild(hole);
    }, 500);
  };

  return (
    <div className="container">
      <BackButton />
      <h2>Login</h2>
      {message && <p>{message}</p>}
      {loading ? <Spinner /> : (
        <>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={(e) => { handleLogin(); handleShot(e); }}>Login</button>
        </>
      )}
    </div>
  );
};

export default Login;