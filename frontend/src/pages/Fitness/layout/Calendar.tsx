import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";


// Event {
//     title: string,
//     start: Date,
//     end: Date,
//     allDay?: boolean
//     resource?: any,
//   }

const eventsList = [
    {
        title: "238 Steps",
        start: new Date(),
        end: new Date()
    },
    {
        title: "6:42 Hours Slept",
        start: new Date(),
        end: new Date()
    }
]

const localizer = momentLocalizer(moment)

const MyCalendar = () => (
    <div style={{ width: "100%" }}>
        <Calendar
            localizer={localizer}
            events={eventsList}
            startAccessor="start"
            endAccessor="end"
            style={{
                height: 500,
                // display: "flex", 
                // justifyContent: "center", 
                width: "100%",
                color: "inherit"
            }}
        />
    </div>
)

export default MyCalendar