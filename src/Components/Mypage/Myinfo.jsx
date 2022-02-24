import { useApiAxios } from 'api/base';
import { useEffect, useState } from 'react';
import { useAuth } from 'contexts/AuthContext';
import Sidebar from 'Components/Mypage/Sidebar';

function Myinfo() {
  const { auth } = useAuth();
  const [{ data: userData }, refetch] = useApiAxios(
    {
      url: `/accounts/api/users/${auth.userID}/`,
      method: 'GET',
    },
    { manual: true },
  );

  useEffect(() => {
    refetch();
  }, []);

  // 스크롤 기능
  const [scrollY, setScrollY] = useState(0);
  const gotoTop = () => {
    // 클릭하면 스크롤이 위로 올라가는 함수
    window.scrollTo({
      top: 940,
      behavior: 'smooth',
    });
    setScrollY(0); // ScrollY 의 값을 초기화
  };

  const handleFollow = () => {
    setScrollY(window.pageYOffset);
  };

  useEffect(() => {
    const watch = () => {
      window.addEventListener('scroll', handleFollow);
    };
    watch();
    return () => {
      window.removeEventListener('scroll', handleFollow);
    };
  });
  // console.log('window Scroll From Top:', scrollY);

  useEffect(() => {
    gotoTop();
  }, [userData]);

  //-------------

  return (
    <>
      <div className="header">
        <div className="justify-center mx-20">
          <div className="align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="mypage_header rounded-xl shadow-md">
              <blockquote class="mt-5 text-4xl mb-3 font-semibold italic text-center text-slate-900">
                <span class="mt-7 mb-3 before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-blue-900 relative inline-block">
                  <span class="relative text-white">" 내 회원정보 "</span>
                </span>
              </blockquote>

              <div className="mb-5 overflow-hidden border-b border-gray-200">
                <table className="mb-5 mr-5 mt-3 border text-center min-w-full divide-y divide-gray-200">
                  <tr>
                    <th className="border border-slate-200 bg-gray-50 px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider w-72">
                      이름
                    </th>
                    <td>{userData?.name}</td>
                  </tr>

                  <tr>
                    <th className="border border-slate-200 bg-gray-50 px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider w-72">
                      아이디
                    </th>
                    <td>{userData?.userID}</td>
                  </tr>

                  <tr>
                    <th className="border border-slate-200 bg-gray-50 px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider w-72">
                      닉네임
                    </th>
                    <td>{userData?.nickname}</td>
                  </tr>

                  <tr>
                    <th className="border border-slate-200 bg-gray-50 px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider w-72">
                      이메일
                    </th>
                    <td>{userData?.email}</td>
                  </tr>

                  <tr>
                    <th className="border border-slate-200 bg-gray-50 px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider w-72">
                      연락처
                    </th>
                    <td>{userData?.phone_number}</td>
                  </tr>

                  <tr>
                    <th className="border border-slate-200 bg-gray-50 px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider w-72">
                      거주지
                    </th>
                    <td>{userData?.region}</td>
                  </tr>

                  <tr>
                    <th className="border border-slate-200 bg-gray-50 px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider w-72">
                      비밀번호 퀴즈
                    </th>
                    <td>{userData?.password_quiz}</td>
                  </tr>

                  <tr>
                    <th className="border border-slate-200 bg-gray-50 px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider w-72">
                      비밀번호 퀴즈 정답
                    </th>
                    <td>{userData?.password_quiz_answer}</td>
                  </tr>
                </table>
                <div className="text-right mr-5 mt-3 mb-3">
                  <button
                    onClick={() =>
                      window.open(
                        'http://localhost:8000/accounts/password_change/',
                        '_blank',
                      )
                    }
                    className="text-xl hover:bg-blue-200 hover:text-white font-semibold"
                  >
                    <span class="h-3 w-3 text-blue-900 bg-gray-200 hover:text-white">
                      비밀번호 변경하기
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Myinfo;
