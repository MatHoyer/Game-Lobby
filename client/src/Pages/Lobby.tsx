import { useParams } from 'react-router-dom';

export const Lobby = () => {
  const params = useParams();

  return (
    <div>
      <h1>Lobby</h1>
      <p>Game ID: {params.id}</p>
    </div>
  );
};
