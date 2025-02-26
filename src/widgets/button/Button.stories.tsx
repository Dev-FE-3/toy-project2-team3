import Button from './Button';

const BtnStory: React.FC = () => {
  return (
    <>
      <div style={{ display: 'flex', gap: '10px' }}>
        {/* 둥근 버튼 (채워짐) */}
        <Button typeStyle="rounded" variant="filled">
          둥근 버튼 채워짐
        </Button>

        {/* 둥근 버튼 (테두리만) */}
        <Button typeStyle="rounded" variant="outlined">
          둥근 버튼 테두리
        </Button>

        {/* 각진 버튼 (채워짐) */}
        <Button typeStyle="square" variant="filled">
          각진 버튼 채워짐
        </Button>

        {/* 각진 버튼 (테두리만) */}
        <Button typeStyle="square" variant="outlined">
          각진 버튼 테두리
        </Button>
      </div>
    </>
  );
};

export default BtnStory;
