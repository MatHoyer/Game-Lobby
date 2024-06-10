import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const games = [
  {
    name: 'Puissance 4',
    link: '/puissance-4',
  },
  {
    name: '...',
    link: '/',
  },
  {
    name: '...',
    link: '/',
  },
];

export const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-5">
      <h1 className="text-4xl">Home</h1>
      {games.map((game, index) => (
        <Link key={index} to={game.link}>
          <Button>{game.name}</Button>
        </Link>
      ))}
    </div>
  );
};
