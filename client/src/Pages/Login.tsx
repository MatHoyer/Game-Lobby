import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import socket from '@/lib/socket';
import { useState } from 'react';

export const Login = () => {
  const [name, setName] = useState('');

  const handleLogin = () => {
    socket.emit('update-name', name);
  };

  return (
    <div className="flex flex-col justify-center space-y-5 w-64">
      <h1>Login</h1>
      <Input
        type="text"
        value={name}
        onChange={(e) => {
          if (/^[a-zA-Z]+$/.test(e.target.value) || e.target.value === '') setName(e.target.value);
        }}
        placeholder="Name"
      />
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};
