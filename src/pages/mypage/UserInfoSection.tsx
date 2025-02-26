import React from 'react';
import {
  InfoSection,
  Title,
  ProfileContainer,
  InfoWrapper,
  InfoItem,
  ProfileImage,
  ProfileEditButton,
} from './MaPageStyles';
import profileDefault from '../../assets/profile-default.png';

const EditIcon: React.FC = () => {
  return (
    <svg
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
  return (
    <InfoSection>
      <Title>
        안녕하세요, <span style={{ color: '#14b8a6' }}>백지헌</span>님!
      </Title>
      <ProfileContainer>
        <div>
          <InfoWrapper>
            <InfoItem>
              <strong>직책</strong> Security Engineer
            </InfoItem>
            <InfoItem>
              <strong>입사</strong> 2024.04.17 (310일째)
            </InfoItem>
            <InfoItem>
              <strong>부서</strong> 인프라보안팀
            </InfoItem>
            <InfoItem>
              <strong>메일</strong> jiheonbaek@gmail.com
            </InfoItem>
          </InfoWrapper>
        </div>
        <ProfileImage>
          <img
            src={profileDefault}
            alt="Profile"
            style={{ width: '100%', height: '100%' }}
          />
        </ProfileImage>
        <ProfileEditButton>
          <EditIcon />
        </ProfileEditButton>
      </ProfileContainer>
    </InfoSection>
  );
};

export default UserInfoSection;
