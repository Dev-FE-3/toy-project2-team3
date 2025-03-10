import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';

export interface OptionType {
  label: string;
  value: string | number;
}

export interface DropdownProps {
  title: string;
  options: OptionType[];
  onSelect?: (option: OptionType) => void;
  defaultValue?: OptionType;
  placeholder?: string;
  width?: string;
  height?: string;
  fontSize?: string;
  className?: string;
}

export interface DropdownTextProps {
  $hasPlaceHolder: boolean;
  $hasSelected: boolean;
}

// 드롭다운 아이콘 색상 변경
interface DropdownIconProps {
  isMint?: boolean;
}

// 드롭다운 공통 style 정의
const fontStyles = css`
  ${({ theme }) => theme.typography.body2};
`;

const baseBoxStyles = css`
  box-sizing: border-box;
  align-items: center;
`;

const itemBaseStyles = css`
  ${fontStyles}
  padding: 8px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const DropdownContainer = styled.nav<{ width?: string; height?: string }>`
  ${baseBoxStyles}
  width: ${(props) => props.width || '260px'};
  height: ${(props) => props.height || '40px'};
  position: relative;
  ${fontStyles}

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
`;

const DropdownHeader = styled.button<{
  $hasSelected?: boolean;
  width?: string;
  height?: string;
}>`
  ${baseBoxStyles}
  ${itemBaseStyles}
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '40px'};
  justify-content: space-between;
  border-radius: 4px;
  flex-shrink: 0;
  text-align: left;

  background: ${(props) =>
    props.$hasSelected ? props.theme.colors.white : props.theme.colors.point1};
  color: ${(props) =>
    props.$hasSelected ? props.theme.colors.point1 : props.theme.colors.white};
  border: ${(props) =>
    props.$hasSelected ? `1px solid ${props.theme.colors.point1}` : 'none'};
`;

// 드롭다운 list
const DropdownList = styled.ul`
  ${fontStyles}
  position: absolute;
  width: 100%;
  top: 100%;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.grey2};
  border-radius: 4px;
  z-index: 1;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  list-style: none;

  max-height: 160px; /* 옵션이 4개 이상이면 스크롤 */
  overflow-y: auto;

  /*스크롤바 스타일링 추가 */
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.point2};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.point1};
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.white};
    border-radius: 10px;
  }
`;

// 드롭다운 item
const DropdownItem = styled.li`
  ${fontStyles}
  width: 100%;
  box-sizing: border-box;
  height: 40px;
  display: flex;
  padding: 8px 20px;
  cursor: pointer;
  align-items: center;
  border-bottom: 0.8px solid ${({ theme }) => theme.colors.grey2};
  &:hover {
    background: ${({ theme }) => theme.colors.point2};
    color: ${({ theme }) => theme.colors.point1};
  }

  &:last-child {
    border-bottom: none;
  }
`;

// 드롭다운 icon 회전
const RotatableIcon = styled.figure<{ $isOpen: boolean }>`
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  margin: 0;
`;

// DropdownIcon 컴포넌트
const StyledSVG = styled.svg<{ isMint?: boolean }>`
  & path {
    fill: ${({ isMint, theme }) =>
      isMint ? theme.colors.point1 : theme.colors.white};
  }
`;

const DropdownIcon: React.FC<DropdownIconProps> = ({ isMint = false }) => {
  return (
    <StyledSVG
      width={18}
      height={12}
      viewBox="0 0 18 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      isMint={isMint}
    >
      <g id="Frame 2608833">
        <path
          id="Vector"
          d="M2.115 0.5L9 7.29892L15.885 0.5L18 2.59312L9 11.5L0 2.59312L2.115 0.5Z"
        />
      </g>
    </StyledSVG>
  );
};

const DropdownText = styled.strong<DropdownTextProps>`
  color: ${({ $hasSelected, theme }) =>
    $hasSelected ? theme.colors.point1 : theme.colors.white};
`;

export {
  RotatableIcon,
  DropdownContainer,
  DropdownHeader,
  DropdownList,
  DropdownItem,
  DropdownText,
  fontStyles,
  baseBoxStyles,
  itemBaseStyles,
};

const Dropdown: React.FC<DropdownProps> = ({
  title,
  options,
  onSelect,
  defaultValue = undefined,
  placeholder,
  width,
  height,
  fontSize,
  className,
}) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionType | undefined>(
    defaultValue
  );
  // div 요소를 참조할 수 있는 객체를 만들고, 초기값은 null로 설정
  const dropdownRef = useRef<HTMLElement>(null);

  // 드롭다운 외부영역 클릭시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropDown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    // 클린업
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const dropDownHandler = () => {
    setShowDropDown(!showDropDown);
  };

  const optionClickHandler = (option: OptionType) => {
    setSelectedOption(option); // 선택된 옵션 업데이트
    setShowDropDown(false);
    if (onSelect) {
      onSelect(option); // 부모 컴포넌트에서 전달된 콜백 함수가 있으면 실행
    }
  };

  return (
    <DropdownContainer
      ref={dropdownRef}
      width={width}
      height={height}
      className={className}
    >
      <DropdownHeader
        onClick={dropDownHandler}
        $hasSelected={!!selectedOption}
        width={width}
        height={height}
      >
        <DropdownText
          $hasPlaceHolder={!selectedOption}
          $hasSelected={!!selectedOption}
        >
          {selectedOption ? selectedOption.label : placeholder || title}
        </DropdownText>

        {/* 선택 옵션에 따른 아이콘 회전과 색상 변경 */}
        <RotatableIcon $isOpen={showDropDown}>
          {/* 상태에 따라 다른 아이콘 색상 적용 */}
          <DropdownIcon isMint={!!selectedOption} />
        </RotatableIcon>
      </DropdownHeader>

      {showDropDown && (
        <DropdownList>
          {options.map((option, index) => (
            <DropdownItem
              key={index}
              onClick={() => optionClickHandler(option)}
            >
              {option.label}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

export default Dropdown;
