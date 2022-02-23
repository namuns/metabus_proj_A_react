import { useApiAxios } from 'api/base';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from 'contexts/AuthContext';
import '../../App.css';
import './Review.css';

function ReviewDetail({ reviewId }) {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [{ data: review, loading, error }, refetch] = useApiAxios(
    `/adopt_review/api/reviews/${reviewId}/`,
    { manual: true },
  );

  const [{}, deleteReview] = useApiAxios(
    {
      url: `/adopt_review/api/reviews/${reviewId}/`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${auth.access}`,
      },
    },
    { manual: true },
  );

  const handleDelete = () => {
    if (window.confirm('정말 삭제 할까요?')) {
      deleteReview().then(() => {
        navigate('/review/');
        window.location.reload();
      });
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  console.log('review', review);

  return (
    <>
      <div className="header">
        <div className="flex flex-wrap justify-center max-w-m">
          <div className="flex header justify-center rounded px-20 pt-6 mb-3">
            <div className="review_header shadow-md overflow-hidden sm:rounded-lg">
              <blockquote class="mt-5 text-3xl font-semibold italic text-center text-slate-900">
                <span class="mt-3 mb-3 before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-purple-400 relative inline-block">
                  <span class="relative text-white text-6xl">" 입양후기 "</span>
                </span>
              </blockquote>
              <div className="flex justify-center">
                <div className="px-4 py-5 w-2/3">
                  {review && (
                    <>
                      <h1 className="text-lg leading-6 font-bold text-gray-900">
                        {review.title}
                      </h1>
                      <hr className="mt-3 mb-3" />

                      <div className="mb-4 flex justify-center">
                        {review.image1 && (
                          <img
                            src={review.image1}
                            alt={review.image1}
                            className="w-full"
                          />
                        )}
                      </div>

                      <div>
                        {review.image2 && (
                          <img src={review.image2} alt={review.image2} />
                        )}
                      </div>
                      <div>
                        {review.image3 && (
                          <img src={review.image3} alt={review.image3} />
                        )}
                      </div>

                      <div>
                        {review.image4 && (
                          <img src={review.image4} alt={review.image4} />
                        )}
                      </div>
                      <div>
                        {review.image5 && (
                          <img src={review.image5} alt={review.image5} />
                        )}
                      </div>

                      {/*  */}

                      <h2 className="sm:mt-0 sm:col-span-2 mt-2 mb-3 max-w-2xl text-sm text-gray-900">
                        {review.content}
                      </h2>
                      <br />
                      <hr className="mt-3 mb-3" />

                      <h4 className="flex items-center text-gray-400">
                        <img
                          src={review.adoptassignment.animal.image}
                          width="100"
                          alt=""
                        />
                        {review.adoptassignment.animal.end_date}일에{' '}
                        {review.user.nickname}님께 입양된{' '}
                        {review.adoptassignment.animal.animal_reg_num} 의 입양
                        후기입니다.
                      </h4>

                      <div className="my-5 text-right">
                        <Link
                          className="ml-3 flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                          to="/review/"
                        >
                          목록으로
                        </Link>
                        {auth.userID === review.user.userID && (
                          <Link
                            className="ml-3 flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                            to={`/review/${reviewId}/edit/`}
                          >
                            수정하기
                          </Link>
                        )}
                        {(auth.userID === review.user.userID ||
                          auth.is_staff) && (
                          <button
                            className="ml-3 flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                            onClick={() => handleDelete()}
                          >
                            삭제하기
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewDetail;
