import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home/Home';
import Gallery from './pages/Gallery/Gallery';
import Memories from './pages/Memories/Memories';
import SecretMessage from './pages/SecretMessage/SecretMessage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div style={{padding: '20px', color: 'red'}}>Error Loading Page</div>,
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <div>Error loading Home</div>
      },
      {
        path: 'gallery',
        element: <Gallery />,
        errorElement: <div>Error loading Gallery</div>
      },
      {
        path: 'memories',
        element: <Memories />,
        errorElement: <div>Error loading Memories</div>
      },
      {
        path: 'secret',
        element: <SecretMessage />,
        errorElement: <div>Error loading Secret Message</div>
      }
    ]
  }
]);

export default router;