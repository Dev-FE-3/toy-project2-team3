import Dropdown from './Dropdown';

const DropdownSample = () => {
  const options = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3>기본 크기 드롭다운</h3>
        <Dropdown title="원하는 텍스트 입력" options={options} />
      </div>

      <div>
        <h3>작은 크기 드롭다운</h3>
        <Dropdown title="원하는 텍스트 입력" options={options} size="small" />
      </div>
    </div>
  );
};

export default DropdownSample;
