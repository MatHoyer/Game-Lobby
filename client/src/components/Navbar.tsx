import { routes } from '@/Router';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { NavLink } from 'react-router-dom';
import { ModeToggle } from './darkMode/mode-toggle';
import { Button } from './ui/button';
import { DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';

export const NavBar = () => {
  const username = useUserStore((state) => state.name);
  const isAuthenticated = !!username;

  const disconect = () => {
    window.location.reload();
  };

  return (
    <nav className="flex sticky items-center top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full h-14 container">
        <div className="mr-4 flex items-center">
          {isAuthenticated && (
            <nav className="flex items-end space-x-6 text-md font-medium">
              {routes.map((route) => (
                <NavLink
                  key={route.path}
                  to={route.path}
                  className={({ isActive }) =>
                    cn('transition-colors hover:text-foreground/80 text-foreground/60', isActive && 'text-foreground')
                  }
                >
                  {route.name}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
        <div className="flex flex-1 items-center space-x-5 justify-end">
          {isAuthenticated && (
            <>
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <p className="text-md font-medium">{username}</p>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background/95 rounded-lg p-4 shadow-lg">
                    <Button variant={'ghost'} onClick={disconect}>
                      Déconnexion
                    </Button>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};
