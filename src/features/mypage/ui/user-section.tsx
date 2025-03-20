import React, { useRef, useEffect, useState } from 'react';
import * as S from '@/features/mypage/styles/user-section.styles';
import { useFetchUserData } from '@/features/mypage/hooks/useFetchUserData';
import profileDefault from '@/assets/images/profile_default.svg';
import editIcon from '@/assets/images/edit_icon.svg';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/loading.json';

const compressImage = (
  file: File,
  maxWidth: number = 800,
  quality: number = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      if (!ctx) {
        reject(new Error('Canvas context를 가져올 수 없습니다'));
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };

    img.onerror = () => reject(new Error('이미지 로드 실패'));
    img.src = URL.createObjectURL(file);
  });
};

const UserInfoSection = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { userData, isLoading, error } = useFetchUserData();
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

  // 프로필 이미지 변경 및 압축 핸들러
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const compressedBase64 = await compressImage(file, 800, 0.7);
      localStorage.setItem('profileImage', compressedBase64);
      setProfileImage(compressedBase64);
    } catch (error) {
      console.error('이미지 압축 실패:', error);
    }
  };

  if (isLoading) {
    return (
      <S.InfoSection>
        <S.Exception>
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            style={{ width: '180px', height: '180px' }}
          />
        </S.Exception>
      </S.InfoSection>
    );
  }

  if (error) {
    return (
      <S.InfoSection>
        <S.Exception>
          <span>{error}</span>
        </S.Exception>
      </S.InfoSection>
    );
  }

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
          <img
            src={editIcon}
            alt="Edit"
            onClick={() => fileInputRef.current?.click()}
          />
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
