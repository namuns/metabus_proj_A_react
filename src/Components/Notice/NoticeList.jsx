import { Link, useNavigate } from 'react-router-dom';
import { useApiAxios } from 'api/base';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from 'contexts/AuthContext';
import ReactPaginate from 'react-paginate';
import '../../App.css';
import './Notice.css';
import 'css/pagination_notice.css';

function NoticeList() {
  const [query, setQuery] = useState(null);
  const { auth } = useAuth();
  const navigate = useNavigate();
  // 페이징
  const [, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const itemsPerPage = 2;

  const [{ data: noticeList, loading, error }, refetch] = useApiAxios(
    `/notice/api/notices/`,
    { manual: true },
  );

  const fetchNotices = useCallback(
    async (newPage, newQuery = query) => {
      const params = {
        page: newPage,
        query: newQuery,
      };
      const { data } = await refetch({ params });
      setPage(newPage);
      setPageCount(Math.ceil(data.count / itemsPerPage));
      setCurrentItems(data?.results);
    },
    [query],
  );

  useEffect(() => {
    fetchNotices(1);
  }, []);

  const handlePageClick = (event) => {
    fetchNotices(event.selected + 1);
  };

  const getQuery = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchNotices(1, query);
    }
  };

  // 스크롤 기능
  const [scrollY, setScrollY] = useState(0);
  const gotoTop = () => {
    // 클릭하면 스크롤이 위로 올라가는 함수
    window.scrollTo({
      top: 1016,
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
  }, [noticeList]);

  //-------------

  return (
    <>
      <div className="header flex flex-wrap justify-center">
        <div className="notice_header rounded-xl shadow-md overflow-hidden px-20 pt-5 pb-10 my-10 w-2/3">
          <blockquote class="mt-5 text-6xl mb-3 font-semibold italic text-center text-slate-900">
            <span class="mt-7 mb-3 before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-green-400 relative inline-block">
              <span class="relative text-white">" 공지사항 "</span>
            </span>
          </blockquote>

          <div className="ml-3 mb-6 mt-3">
            <div className="text-right">
              {auth.is_staff && (
                <button
                  onClick={() => navigate('/admin/notice/new/')}
                  className=" icon_size float-left ml-10 hover:scale-110"
                  readOnly
                >
                  <img src="/pen.png" alt="button"></img>
                </button>
              )}
              <input
                type="text"
                name="query"
                onChange={getQuery}
                onKeyPress={handleKeyPress}
                className="relative rounded p-3 text-m mb-3 bg-gray-100 focus:outline-none focus:border focus:border-gray-400 md:w-1/3 px-3 md:mb-0"
                placeholder="제목을 검색하세요."
              />
              <button
                onClick={() => handleKeyPress()}
                className="relative ml-2 mr-4 flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-xl border-4 text-white px-3 py-2 rounded"
                readOnly
              >
                검색
              </button>
            </div>
          </div>
          <div className="mb-5">
            <table className="mb-5 border text-center min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider w-44"
                  >
                    No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider w-1/2"
                  >
                    제목
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider"
                  >
                    작성시간
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {noticeList?.results?.map((notice) => (
                  <tr>
                    <td className="py-4">
                      <div className="text-xl font-medium text-gray-900">
                        {notice.notice_no}
                      </div>
                    </td>
                    <td className="py-4">
                      <div
                        className="font-medium text-gray-900 cursor-pointer"
                        onClick={() => navigate(`/notice/${notice.notice_no}/`)}
                      >
                        <span className="inline-flex text-xl leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {notice.title.length > 20
                            ? notice.title.substr(0, 19) + '...'
                            : notice.title}
                        </span>
                      </div>
                    </td>
                    <td className="text-m py-4">{notice.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ReactPaginate
            previousLabel="<"
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={itemsPerPage}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
            className="pagination_notice"
          />
        </div>
      </div>
    </>
  );
}

export default NoticeList;
