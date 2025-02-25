import Dropdown, { OptionType } from '../../widgets/dropdown/Dropdown';
import ArrowUpIcon from '../../assets/arrow-up.svg?react';

const Calendar = () => {
  const options = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 1 },
    { label: '5', value: 2 },
    { label: '6', value: 3 },
    { label: '7', value: 1 },
  ];

  const handleScheduleSelect = (selectedOption: OptionType) => {
    console.log('선택된 월: ', selectedOption.label);
  };

  return (
    <div className="relative">
      <Dropdown
        title="원하는 텍스트 입력"
        options={options}
        onSelect={handleScheduleSelect}
        icon={<ArrowUpIcon />}
      />
    </div>
  );
};

export default Calendar;
