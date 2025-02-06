import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Login from './features/auth/Login'
import RootLayout from './ui/RootLayout'
import Register from './features/auth/Register'
import { useSelector } from 'react-redux'
import DashboardLayout from './ui/DashboardLayout'
import { TabsCustomAnimation } from './features/dashboard/TabsCustomAnimation'
import ProfileUpdate from './features/shared/ProfileUpdate'
import ArtistForm from './features/artist/ArtistForm'
import ArtistPage from './features/artist/ArtistPage'
import SongForm from './features/song/SongForm'
import SongUpdate from './features/song/SongUpdate'
import ArtistSongs from './features/song/ArtistSongs'

const App = () => {
  const { user } = useSelector(state => state.userSlice);
  const layout = user ? [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: user?.role === 'artist' ? <ArtistPage user={user} /> : <TabsCustomAnimation user={user} />

        },

        {
          path: 'register',
          element: <Register />
        },
        {
          path: 'artist-form',
          element: <ArtistForm />
        },
        {
          path: 'artist-songs/:id',
          element: <ArtistSongs />
        },
        {
          path: 'song-form/:id',
          element: <SongForm />
        },
        {
          path: 'song-update/:id',
          element: <SongUpdate />
        },
        {
          path: 'profile-update/:id',
          element: <ProfileUpdate />
        }

      ]
    }
  ]
    :
    [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <Login />
          },
          {
            path: 'register',
            element: <Register />
          }
        ]
      }

    ];
  const router = createBrowserRouter(layout)
  return <RouterProvider router={router} />
}

export default App
