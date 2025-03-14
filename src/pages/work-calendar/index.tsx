import { ReactNode, JSX } from 'react';
import CalendarMain from '../../features/work-calendar/ui/calendar-main';

interface WorkCalendarPageProps {
  children?: ReactNode;
}

const WorkCalendarPage = ({ children }: WorkCalendarPageProps): JSX.Element => {
  return (
    <>
      <CalendarMain />
    </>
  );
};

export default WorkCalendarPage;
