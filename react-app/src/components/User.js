import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { grabUserPhotos } from '../store/photo';
import PhotoModal from './photos/PhotoModal';

import { followUser, removeFollow } from '../store/follows';
import './User.css'


function User() {
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.session.user)
  const following = useSelector(state => state.session.following)
  const photos = useSelector(state => Object.values(state.photos))
  const [loaded, setLoaded] = useState(false)
  const [user, setUser] = useState({});
  const { userId } = useParams();

  let followedUser
  if (following) followedUser = following[userId]

  const handleFollow = (e) => {
    e.preventDefault()

    if (followedUser) {
      dispatch(removeFollow(userId))
    } else {
      dispatch(followUser(userId))
    }
  }

  useEffect(() => {
    if (!userId) {
      return;
    }
    (async () => {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();

      setUser(user);
    })();
  }, [userId]);

  useEffect(() => async () => {
    await dispatch(grabUserPhotos(userId))
    setLoaded(true)
  }, [dispatch, userId])

  if (!user) {
    return null;
  }

  return (
    <>
      {following &&
        <ul className='user-details'>
          <li id='user-info'>
            @{user.username}
            {/* {user.first_name} {user.last_name} */}
          </li>
          <li id='user-name'>
            {user.first_name} {user.last_name}
          </li>
          {+userId !== currentUser.id && (followedUser ? (
            <button onClick={handleFollow} className='user-follow' id='user-unfollow-btn'>Unfollow</button>
          ) : (
            <button onClick={handleFollow} className='user-follow' id='user-follow-btn'>Follow</button>
          ))}
        </ul>
      }

      {/* <FollowsContainer profileUser={user} /> */}
      {loaded &&
        <ul className='p-ul'>
          {photos.map(photo => (
            <li key={photo.id} className='post-container'>
              <PhotoModal photo={photo} />
              {/* <CommentsFeed photo={photo} /> */}
            </li>
          ))}
        </ul>
      }
    </>
  )
}
export default User;
