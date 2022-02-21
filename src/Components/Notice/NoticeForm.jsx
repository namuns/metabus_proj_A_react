import { useAuth } from 'contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useApiAxios } from 'api/base';
import useFieldValues from 'hooks/useFieldValues';
import produce from 'immer';
import { useEffect, useState } from 'react';
import LoadingIndicator from 'LoadingIndicator';
import DebugStates from 'DebugStates';

import './Notice.css';
import '../../App.css';

const INIT_FIELD_VALUES = {
  title: '',
  content: '',
};

function NoticeForm({ noticeId, handleDidSave }) {
  const { auth } = useAuth();
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
  const [image5, setImage5] = useState('');
  const navigate = useNavigate();

  // 사진 등록시
  const imgpreview1 = (e, fileData) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImage1(reader.result);
        resolve();
        handleFieldChange(e);
      };
    });
  };

  const imgpreview2 = (e, fileData) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImage2(reader.result);
        resolve();
        handleFieldChange(e);
      };
    });
  };

  const imgpreview3 = (e, fileData) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImage3(reader.result);
        resolve();
        handleFieldChange(e);
      };
    });
  };

  const imgpreview4 = (e, fileData) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImage4(reader.result);
        resolve();
        handleFieldChange(e);
      };
    });
  };

  const imgpreview5 = (e, fileData) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImage5(reader.result);
        resolve();
        handleFieldChange(e);
      };
    });
  };

  // 조회
  const [{ data: noticeData, loading: getLoading, error: getError }] =
    useApiAxios(
      {
        url: `/notice/api/notices/${noticeId}/`,
        method: 'GET',
      },
      { manual: !noticeId },
    );

  // 저장
  const [
    {
      loading: saveLoading,
      error: saveError,
      errorMessages: saveErrorMessages,
    },
    saveRequest,
  ] = useApiAxios(
    {
      url: !noticeId
        ? `/notice/api/notices/`
        : `/notice/api/notices/${noticeId}/`,
      method: !noticeId ? 'POST' : 'PUT',
      headers: {
        Authorization: `Bearer ${auth.access}`,
      },
    },
    { manual: true },
  );

  const { fieldValues, handleFieldChange, setFieldValues } = useFieldValues(
    noticeData || INIT_FIELD_VALUES,
  );

  useEffect(() => {
    setFieldValues(
      produce((draft) => {
        draft.image1 = '';
        draft.image2 = '';
        draft.image3 = '';
        draft.image4 = '';
        draft.image5 = '';
        draft.file1 = '';
        draft.file2 = '';
        draft.file3 = '';
        draft.user = auth.userID;
      }),
    );
  }, [noticeData]);

  // 저장 버튼 기능
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(fieldValues).forEach(([name, value]) => {
      if (Array.isArray(value)) {
        const fileList = value;
        fileList.forEach((file) => formData.append(name, file));
      } else {
        formData.append(name, value);
      }
    });
    saveRequest({
      data: formData,
    }).then((response) => {
      const savedPost = response.data;
      if (handleDidSave) handleDidSave(savedPost);
    });
  };

  // 사진 삭제 기능
  const [{ loading, error }, delImage2] = useApiAxios(
    {
      url: `/notice/api/notices/${noticeId}/`,
      method: 'PATCH',
      data: { image2: fieldValues.image2 },
      headers: {
        Authorization: `Bearer ${auth.access}`,
      },
    },
    { manual: true },
  );

  return (
    <>
      {saveLoading && <LoadingIndicator>저장 중...</LoadingIndicator>}
      {saveError &&
        `저장 중 에러가 발생했습니다.(${saveError.response.status} ${saveError.response.statusText})`}

      <div className="header">
        <div className="flex justify-center">
          {/* 폼 작성 시작부분 */}
          <div className="mt-10 mb-7 notice_header w-11/12">
            <blockquote class="mt-3 mb-10 text-2xl font-semibold italic text-center text-slate-900">
              <span class="mt-7 before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-green-500 relative inline-block text-6xl font-extrabold">
                <span class="relative text-white">" 공지사항 작성 "</span>
              </span>
            </blockquote>
            <hr />
            <div className="w-full">
              <form
                onSubmit={handleSubmit}
                className="notice_header rounded-xl px-10 pt-6 pb-8"
              >
                {/* 제목 입력 인풋박스 */}
                <div className="ml-3 mb-3 w-full">
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block uppercase tracking-wide text-gray-700 text-m font-bold mb-2">
                    제목
                  </span>
                  <input
                    type="text"
                    name="title"
                    value={fieldValues.title}
                    onChange={handleFieldChange}
                    placeholder="제목을 입력해주세요."
                    className="rounded-xl text-sm  bg-gray-100 focus:bg-white focus:border-gray-400 w-full p-3 mb-6 "
                  />
                </div>
                {/* 내용 입력 인풋박스 */}
                <div className="ml-3 mb-3 w-full ">
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block uppercase tracking-wide text-gray-700 text-m font-bold mb-2">
                    내용
                  </span>
                  <textarea
                    name="content"
                    value={fieldValues.content}
                    onChange={handleFieldChange}
                    rows="7" // textarea의 행 설정으로 늘릴 수 있음
                    placeholder="내용을 입력해주세요."
                    className="rounded-xl text-sm  bg-gray-100 focus:bg-white focus:border-gray-400 w-full p-3 mb-6 h-60"
                  />
                </div>
                <hr />

                {/* 이미지 첨부 인풋박스 */}
                <div className="mt-3 ml-3 mb-3 w-full">
                  <span className=" block uppercase tracking-wide text-blue-900 text-m font-bold mb-2 ">
                    이미지 첨부
                  </span>
                  <h2 className="text-gray-500 text-xs">
                    ( 최대 5개까지 이미지를 등록할 수 있습니다. )
                  </h2>

                  <div className="bg-white px-4 py-5 w-full">
                    {/* 이미지 첨부 인풋박스 ul태그 시작 부분*/}
                    <ul>
                      {/* 개별 이미지 input 박스 1*/}
                      <li className="flex justify-between items-center text-sm pl-3 pr-4 py-3 w-2/3 border-2 rounded-md">
                        <input
                          type="file"
                          accept=".png, .jpg, .jpeg, .jfif"
                          name="image1"
                          onChange={(e) => {
                            imgpreview1(e, e.target.files[0]);
                          }}
                        />
                        {!fieldValues.image1 && (
                          <div>
                            <img
                              src={noticeData?.image1}
                              alt=""
                              className="h-44"
                            />
                          </div>
                        )}

                        <div>
                          <img src={image1} alt="" className="h-44" />
                        </div>

                        <button
                          className="rounded-full px-2 py-1 bg-sky-300"
                          onClick={(e) => {
                            e.preventDefault();
                            setImage1('');
                          }}
                        >
                          X
                        </button>
                      </li>

                      {/* 개별 이미지 input 박스 2*/}
                      <li className="flex justify-between items-center text-sm pl-3 pr-4 py-3 w-2/3 border-2 rounded-md">
                        <input
                          type="file"
                          accept=".png, .jpg, .jpeg, .jfif"
                          name="image2"
                          onChange={(e) => {
                            imgpreview2(e, e.target.files[0]);
                          }}
                        />
                        {!fieldValues.image2 && (
                          <div>
                            <img
                              src={noticeData?.image2}
                              alt=""
                              className="h-44"
                            />
                          </div>
                        )}
                        <div>
                          <img src={image2} alt="" className="h-44" />
                        </div>
                        <button
                          className="rounded-full px-2 py-1 bg-sky-300"
                          onClick={(e) => {
                            e.preventDefault();
                            setImage2('');
                            delImage2().then(() => window.location.reload());
                          }}
                        >
                          X
                        </button>
                      </li>

                      {/* 개별 이미지 input 박스 3*/}
                      <li className="flex justify-between items-center text-sm pl-3 pr-4 py-3 w-2/3 border-2 rounded-md">
                        <input
                          type="file"
                          accept=".png, .jpg, .jpeg, .jfif"
                          name="image3"
                          onChange={(e) => {
                            imgpreview3(e, e.target.files[0]);
                          }}
                        />
                        <div>
                          <img
                            src={noticeData?.image3}
                            alt=""
                            className="h-44"
                          />
                        </div>
                        <div>
                          <img src={image3} alt="" className="h-44" />
                        </div>
                        <button
                          className="rounded-full px-2 py-1 bg-sky-300"
                          onClick={(e) => {
                            e.preventDefault();
                            setImage3('');
                            setFieldValues((prevFieldValues) => {
                              return {
                                ...prevFieldValues,
                                image3: '',
                              };
                            });
                          }}
                        >
                          X
                        </button>
                      </li>

                      {/* 개별 이미지 input 박스 4*/}
                      <li className="flex justify-between items-center text-sm pl-3 pr-4 py-3 w-2/3 border-2 rounded-md">
                        <input
                          type="file"
                          accept=".png, .jpg, .jpeg, .jfif"
                          name="image4"
                          onChange={(e) => {
                            imgpreview4(e, e.target.files[0]);
                          }}
                        />
                        <div>
                          <img
                            src={noticeData?.image4}
                            alt=""
                            className="h-44"
                          />
                        </div>
                        <div>
                          <img src={image4} alt="" className="h-44" />
                        </div>
                        <button
                          className="rounded-full px-2 py-1 bg-sky-300"
                          onClick={(e) => {
                            e.preventDefault();
                            setImage4('');
                            setFieldValues((prevFieldValues) => {
                              return {
                                ...prevFieldValues,
                                image4: '',
                              };
                            });
                          }}
                        >
                          X
                        </button>
                      </li>
                      {/* 개별 이미지 input 박스 5*/}
                      <li className="flex justify-between items-center text-sm pl-3 pr-4 py-3 w-2/3 border-2 rounded-md">
                        <input
                          type="file"
                          accept=".png, .jpg, .jpeg, .jfif"
                          name="image5"
                          onChange={(e) => {
                            imgpreview5(e, e.target.files[0]);
                          }}
                        />
                        <div>
                          <img
                            src={noticeData?.image5}
                            alt=""
                            className="h-44"
                          />
                        </div>
                        <div>
                          <img src={image5} alt="" className="h-44" />
                        </div>
                        <button
                          className="rounded-full px-2 py-1 bg-sky-300"
                          onClick={(e) => {
                            e.preventDefault();
                            setImage5('');
                            setFieldValues((prevFieldValues) => {
                              return {
                                ...prevFieldValues,
                                image5: '',
                              };
                            });
                          }}
                        >
                          X
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <hr />
                {/* 파일 첨부 인풋박스 시작 부분 */}
                <div className="mt-3 ml-3 mb-3 w-full">
                  <span className=" block uppercase tracking-wide text-blue-900 text-m font-bold mb-2 ">
                    파일 첨부
                  </span>
                  <h2 className="text-gray-500 text-xs">
                    ( 최대 3개까지 첨부파일을 등록할 수 있습니다. )
                  </h2>

                  {/* 개별 파일 input 박스 1*/}
                  <div className="bg-white px-4 py-5">
                    {/* 이미지 첨부 인풋박스 ul태그 시작 부분*/}
                    <ul>
                      {/* 개별 이미지 input 박스 1*/}
                      <li className="flex justify-between items-center text-sm pl-3 pr-4 py-3 w-2/3 border-2 rounded-md">
                        <input
                          type="file"
                          accept=".docx, .hwp, .xlsx, .pdf"
                          name="file1"
                          className="text-gray-800 "
                          onChange={handleFieldChange}
                        />
                        <div>
                          {(noticeData?.file1 || fieldValues.file1) &&
                            '파일1이 존재합니다.'}
                        </div>
                      </li>
                      {/* 개별 파일 input 박스 2*/}
                      <li className="flex justify-between items-center text-sm pl-3 pr-4 py-3 w-2/3 border-2 rounded-md">
                        <input
                          type="file"
                          accept=".docx, .hwp, .xlsx, .pdf"
                          name="file2"
                          className="text-gray-800 "
                          onChange={handleFieldChange}
                        />
                        <div>
                          {(noticeData?.file2 || fieldValues.file2) &&
                            '파일2가 존재합니다.'}
                        </div>
                      </li>
                      {/* 개별 파일 input 박스 3*/}
                      <li className="flex justify-between items-center text-sm pl-3 pr-4 py-3 w-2/3 border-2 rounded-md">
                        <input
                          type="file"
                          accept=".docx, .hwp, .xlsx, .pdf"
                          name="file3"
                          placeholder="선택된 파일 없음"
                          className="text-gray-800 "
                          onChange={handleFieldChange}
                        />
                        <div>
                          {(noticeData?.file3 || fieldValues.file3) &&
                            '파일3이 존재합니다.'}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="text-center">
                  <button className=" bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded">
                    저장하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <DebugStates fieldValues={fieldValues} />
    </>
  );
}

export default NoticeForm;
