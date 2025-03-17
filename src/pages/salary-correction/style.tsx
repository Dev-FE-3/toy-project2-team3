import styled, { css } from 'styled-components';

export const BackLink = styled.a`
  display: inline-block;
  margin-top: 80px;
  all: 'unset';
  cursor: pointer;
  ${({ theme }) => theme.typography.body2}
  font-weight : bold;
  & path {
    fill: ${({ theme }) => theme.colors.black};
  }
`;

export const Title = styled.h1`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.colors.black};
`;

export const TileTitle = styled.h1`
  ${({ theme }) => theme.typography.heading3};
  color: ${({ theme }) => theme.colors.black};
`;

export const TextColorPoint = styled.span`
  ${({ theme }) => theme.typography.heading3};
  color: ${({ theme }) => theme.colors.point1};
`;

export const TileContainer = styled.section`
  box-sizing: border-box;
  width: 100%;
  height: 572px;
  display: flex;
  gap: 20px;
  margin-top: 12px;
`;

const Tile = styled.section`
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  padding: 28px 20px;
`;

export const ListTile = styled(Tile)`
  min-width: 505px;
  max-width: 505px;
  background-color: transparent;
  border: 1.5px ${({ theme }) => theme.colors.point1} solid;
`;

export const FormTile = styled(Tile)`
  display: flex;
  width: 100%;
  gap: 28px;
  background-color: ${({ theme }) => theme.colors.point2};
`;

export const InfoTile = styled(Tile)`
  display: flex;
  width: 100%;
  gap: 28px;
  background-color: ${({ theme }) => theme.colors.point2};
`;

export const InputForm = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
`;

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #b2b2b2;
  padding: 11px 16px;
  ${({ theme }) => theme.typography.body3}
  &:focus {
    outline: none;
  }
`;
export const Textarea = styled.textarea`
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  resize: none;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #b2b2b2;
  padding: 11px 16px;
  ${({ theme }) => theme.typography.body3}
  &:focus {
    outline: none;
  }
`;

export const ListBox = styled.ul`
  box-sizing: border-box;
  margin-top: 28px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.grey2} transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.grey2};
    border-radius: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

export const AddListBtn = styled.button`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  min-height: 44px;
  width: 100%;
  border: ${({ theme }) => theme.colors.point1} 1px solid;
  cursor: pointer;
  padding: auto;
  transition: 0.2s ease-in-out;
  &:hover {
    background-color: ${({ theme }) => theme.colors.point1};
  }
`;

export const IconWrapper = styled.svg`
  width: 16px;
  height: 16px;
  path {
    fill: ${({ theme }) => theme.colors.point1};
    transition: 0.2s ease-in-out;
  }
  ${AddListBtn}:hover & path {
    fill: ${({ theme }) => theme.colors.white};
  }
`;

export const ListItem = styled.li`
  background-color: ${({ theme }) => theme.colors.point3};
  border-radius: 8px;
  min-height: 44px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; // 긴 텍스트가 ...으로 표시됨
  transition: 0.2s ease-in-out;
  &:hover {
    background-color: ${({ theme }) => theme.colors.point1};
  }
`;

export const ListTitle = styled.h3`
  margin-left: 16px;
  color: ${({ theme }) => theme.colors.grey1};
  ${({ theme }) => theme.typography.body2};
  transition: 0.2s ease-in-out;
  ${ListItem}:hover & {
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const ListBadge = styled.div<{
  $progress: 'approved' | 'pending' | 'rejected';
}>`
  ${({ $progress, theme }) => {
    const colorMap = {
      approved: theme.colors.green,
      pending: theme.colors.orange,
      rejected: theme.colors.red,
    };

    return css`
      color: ${colorMap[$progress]};
      border: ${colorMap[$progress]} 1px solid;

      ${ListItem}:hover & {
        color: ${theme.colors.white};
        border: ${colorMap[$progress]} 1px solid;
        background-color: ${colorMap[$progress]};
      }
    `;
  }}
  padding: 0px 16px;
  align-content: center;
  margin-right: 16px;
  width: fit-content;
  height: 24px;
  ${({ theme }) => theme.typography.body3};
  font-weight: 700;
  border-radius: 50px;
  transition: 0.2s ease-in-out;
`;

export const InfoBox = styled.ul`
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.white};
  width: 100%;
  height: 100%;
  border-radius: 8px;
  padding: 24px;
`;

export const InfoList = styled.li``;

export const InfoListTitle = styled.h5`
  ${({ theme }) => theme.typography.heading4};
`;

export const InfoListData = styled.span`
  ${({ theme }) => theme.typography.body2};
`;
