import React, { useRef, useEffect, useState } from 'react';
import * as S from '../styles/user-section.styles';
import { useFetch } from '../useFetchUserData';
import profileDefault from '../../../assets/images/profile-default.svg';

const EditIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      onClick={() => {
        onClick();
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      fill="none"
      viewBox="0 0 28 28"
    >
      <path
        fill="#2AC1BC"
        d="M21.483 2.333c-.299 0-.597.115-.825.342l-2.333 2.333-1.65 1.65L3.5 19.833V24.5h4.667L25.325 7.342a1.166 1.166 0 0 0 0-1.65l-3.017-3.017a1.163 1.163 0 0 0-.825-.342Zm0 2.817 1.367 1.367-1.508 1.508-1.367-1.367 1.508-1.508Zm-3.158 3.158 1.367 1.367L7.201 22.167H5.833v-1.368L18.325 8.308Z"
      />
    </svg>
  );
};

const UserInfoSection = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { userData } = useFetch();
  const [profileImage, setProfileImage] = useState<string>(() => {
    return localStorage.getItem('profileImage') || profileDefault;
  });

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  // 프로필 이미지 변경 핸들러
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        localStorage.setItem('profileImage', reader.result);
        setProfileImage(reader.result);
      }
    };
  };

  return (
    <S.InfoSection>
      <S.Title>
        안녕하세요, <span style={{ color: '#14b8a6' }}>{userData.name}</span>님!
      </S.Title>
      <S.ProfileContainer>
        <div>
          <S.InfoWrapper>
            <S.InfoItem>
              <strong>직책</strong> {userData.position}
            </S.InfoItem>
            <S.InfoItem>
              <strong>입사</strong> {userData.joinedDate}
            </S.InfoItem>
            <S.InfoItem>
              <strong>부서</strong> {userData.department}
            </S.InfoItem>
            <S.InfoItem>
              <strong>메일</strong> {userData.email}
            </S.InfoItem>
          </S.InfoWrapper>
        </div>
        <S.ProfileImage>
          <img
            src={profileImage || profileDefault}
            alt="Profile"
            style={{ width: '100%', height: '100%' }}
          />
        </S.ProfileImage>
        <S.ProfileEditButton>
          <EditIcon onClick={() => fileInputRef.current?.click()} />
        </S.ProfileEditButton>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleImageChange}
        />
      </S.ProfileContainer>
    </S.InfoSection>
  );
};

export default UserInfoSection;
