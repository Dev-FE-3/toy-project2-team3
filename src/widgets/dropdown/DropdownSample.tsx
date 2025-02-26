import Dropdown from './Dropdown';

const dropdownSample = () => {
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
    <div>
      <Dropdown title="원하는 텍스트 입력" options={options} />
    </div>
  );
};

export default dropdownSample;
