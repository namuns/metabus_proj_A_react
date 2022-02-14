import { useState } from 'react';
import { useAuth } from 'contexts/AuthContext';
import { useEffect } from 'react';
import { useApiAxios } from 'api/base';
import { Link } from 'react-router-dom';

function UserManagementIndex() {
  const [query, setQuery] = useState(null);
  const { auth } = useAuth();

  const [{ data: managementIndex, loading, error }, refetch] = useApiAxios(
    {
      url: '/accounts/api/users/',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${auth.access}`,
      },
    },
    { manual: true },
  );

  const handleChange = (e) => {
    const value = e.target.value;
    console.log(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log('ENTER');
      const value = e.target.value;
      setQuery(value);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div>
      <h2>UserManagementIndex</h2>

      <input
        type="text"
        placeholder="검색어를 입력해주세요."
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        className="mt-3 ml-3 border-2 border-gray-300"
      />

      {managementIndex && (
        <div>
          {managementIndex.map((management) => (
            <div>
              <Link to={`/management/${management.userID}/`}>
                {management.userID}
              </Link>

              <Link to={`/management/${management.userID}/`}>
                {management.name}
              </Link>

              <Link to={`/management/${management.userID}/`}>
                {management.nickname}
              </Link>
              <span>{management.phone_number}</span>
              <span>{management.email}</span>
              <span>
                {management.region === 1 && 'Seoul'}
                {management.region === 2 && 'Busan'}
                {management.region === 3 && 'Daegu'}D
                {management.region === 4 && 'Incheon'}
                {management.region === 5 && 'Daejeon'}
                {management.region === 6 && 'Sejong'}
                {management.region === 7 && 'Gwangju'}
                {management.region === 8 && 'Ulsan'}
                {management.region === 9 && 'Jeju'}
                {management.region === 10 && 'Gangwon'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserManagementIndex;
