import React, { useState, useRef, useEffect } from 'react';
import * as S from '../styles/user-section.styles';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, storage, db } from '../../../firebase';
import profileDefault from '../../../assets/images/profile-default.png';

const EditIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => {
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

const UserInfoSection: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profileImage, setProfileImage] = useState<string>(profileDefault);
  const [userData, setUserData] = useState({
    name: '',
    position: '',
    joinedDate: '',
    department: '',
    email: '',
  });

  const user = auth.currentUser;
  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();

          // Timestamp → Date 객체 변환
          const rawJoinedDate = data.joinDate?.toDate();

          // 날짜 포맷팅 (YYYY년 M월 D일)
          const formattedDate = rawJoinedDate
            ? `${rawJoinedDate.getFullYear()}년 ${rawJoinedDate.getMonth() + 1}월 ${rawJoinedDate.getDate()}일`
            : '입사일 없음';

          setProfileImage(data.profileImage || profileDefault);
          setUserData({
            name: data.name || '사용자',
            position: data.position || '직책 없음',
            joinedDate: formattedDate,
            department: data.department || '부서 없음',
            email: data.email || '이메일 없음',
          });
        }
      });
    }
  }, [user]);

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!user) return;

    const file = event.target.files?.[0];
    if (!file) return;

    const storageRef = ref(storage, `profile-images/${user.uid}`); // Storage 경로 지정
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    await setDoc(
      doc(db, 'users', user.uid),
      { profileImage: downloadURL },
      { merge: true }
    );
    setProfileImage(downloadURL);
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
            src={profileImage}
            alt="Profile"
            style={{ width: '100%', height: '100%' }}
          />
        </S.ProfileImage>
        <S.ProfileEditButton>
          <EditIcon onClick={handleEditClick} />
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
