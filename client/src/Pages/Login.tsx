import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import socket from '@/lib/socket';
import { useUserStore } from '@/store';
import { useState } from 'react';

export const Login = () => {
  const store = useUserStore();

  const [name, setName] = useState('');

  const handleLogin = () => {
    store.setName(name);
    socket.emit('update-name', { name });
  };

  return (
    <div className="flex flex-col justify-center space-y-5 w-64">
      <h1>Login</h1>
      <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};
