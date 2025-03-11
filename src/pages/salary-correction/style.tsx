import styled from 'styled-components';

export const BackLink = styled.a`
  display: inline-block;
  margin-top: 80px;
  all: 'unset';
  cursor: pointer;
  ${({ theme }) => theme.typography.body2}
  font-weight : bold;
`;

export const Title = styled.h1`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.colors.black};
`;

export const TileTitle = styled.h1`
  ${({ theme }) => theme.typography.heading3};
  color: ${({ theme }) => theme.colors.black};
`;

export const TileContainer = styled.section`
  width: 100%;
  height: 572px;
  display: flex;
  gap: 20px;
  margin-top: 12px;
`;

const Tile = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  padding: 28px 20px;
`;

export const ListTile = styled(Tile)`
  flex-grow: 4;
  min-width: 505px;
  background-color: transparent;
  border: 1.5px ${({ theme }) => theme.colors.point1} solid;
`;

export const FormTile = styled(Tile)`
  display: flex;
  gap: 28px;
  flex-grow: 6;
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
  /* background-color: black;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px; */
`;

export const ListItem = styled.li`
  /* background-color: purple; */
`;
