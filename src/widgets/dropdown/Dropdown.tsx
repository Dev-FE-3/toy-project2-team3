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
}

export interface DropdownTextProps {
  hasPlaceHolder: boolean;
  hasSelected: boolean;
}

// 드롭다운 공통 style 정의

const fontStyles = css`
  font-family: 'Noto Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`;

const baseBoxStyles = css`
  box-sizing: border-box;
  width: 260px;
  height: 40px;
  align-items: center;
`;

const itemBaseStyles = css`
  ${fontStyles}
  padding: 8px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

// 드롭다운 icon 회전
const RotatableIcon = styled.div<{ isOpen: boolean }>`
  transform: ${({ isOpen }) => (isOpen ? 'rotate(0deg)' : 'rotate(180deg)')};
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
`;

// 드롭다운 container
const DropdownContainer = styled.div`
  ${baseBoxStyles}
  position: relative;
  ${fontStyles}

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
`;

// 드롭다운 header
const DropdownHeader = styled.div<{ hasSelected?: boolean }>`
  ${baseBoxStyles}
  ${itemBaseStyles}
  justify-content: space-between;
  border-radius: 4px;
  flex-shrink: 0;

  background: ${(props) => (props.hasSelected ? '#fff' : '#2ac1bc')};
  color: ${(props) => (props.hasSelected ? '#2ac1bc' : '#fff')};
  border: ${(props) => (props.hasSelected ? '1px solid #2ac1bc' : 'none')};
`;

// 드롭다운 list
const DropdownList = styled.ul`
  position: absolute;
  width: 100%;
  top: 100%;
  background: #fff;
  border: 1px solid #b2b2b2;
  border-radius: 4px;
  z-index: 1;
  box-sizing: border-box;
  ${fontStyles}
`;

const DropdownItem = styled.li`
  width: 100%;
  box-sizing: border-box;
  height: 40px;
  display: flex;
  padding: 8px 20px;
  cursor: pointer;
  align-items: center;
  border-bottom: 0.8px solid #b2b2b2;

  &:hover {
    background: rgba(42, 193, 188, 0.2);
    color: #2ac1bc;
  }

  &:last-child {
    border-bottom: none;
  }
  ${fontStyles}
`;

const DropdownText = styled.span<{
  hasPlaceHolder: boolean;
  hasSelected: boolean;
}>`
  color: ${(props) => (props.hasSelected ? '#2ac1bc' : '#fff')};
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
}) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionType | undefined>(
    defaultValue
  );
  // div 요소를 참조할 수 있는 객체를 만들고, 초기값은 null로 설정
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <DropdownContainer ref={dropdownRef}>
      <DropdownHeader onClick={dropDownHandler} hasSelected={!!selectedOption}>
        <DropdownText
          hasPlaceHolder={!selectedOption}
          hasSelected={!!selectedOption}
        >
          {selectedOption ? selectedOption.label : placeholder || title}
        </DropdownText>

        {/* 선택 옵션에 따른 아이콘 회전과 색상변화 */}
        <RotatableIcon isOpen={showDropDown}>
          <div
            style={{
              filter: selectedOption
                ? 'invert(64%) sepia(75%) saturate(380%) hue-rotate(121deg) brightness(94%) contrast(89%)'
                : 'none',
            }}
          >
            {/* SVG 코드 */}
            <svg
              width="18"
              height="12"
              viewBox="0 0 18 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Frame 2608833">
                <path
                  id="Vector"
                  d="M2.115 0.5L9 7.29892L15.885 0.5L18 2.59312L9 11.5L0 2.59312L2.115 0.5Z"
                  fill="white"
                />
              </g>
            </svg>
          </div>
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
