import { useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import interactionPlugin from '@fullcalendar/interaction'
import 'bootstrap-icons/font/bootstrap-icons.css'

const blankEvent = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    location: '',
    description: ''
  }
}

const Calendar = props => {

  const {
    store,
    dispatch,
    direction,
    updateEvent,
    calendarApi,
    calendarsColor,
    setCalendarApi,
    handleSelectEvent,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle
  } = props

  const calendarRef = useRef()
  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current?.getApi())
    }
  }, [calendarApi, setCalendarApi])
  if (store) {
    const calendarOptions = {
      events: store.events.length ? store.events : [],
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        start: 'sidebarToggle, prev, next, title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      },
      views: {
        week: {
          titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
        }
      },
      editable: true,
      eventResizableFromStart: true,
      dragScroll: true,
      dayMaxEvents: 2,
      navLinks: true,
      eventClassNames({ event: calendarEvent }) {
        const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]
        return [
          `bg-${colorName}`
        ]
      },
      eventClick({ event: clickedEvent }) {
        dispatch(handleSelectEvent(clickedEvent))
        handleAddEventSidebarToggle()
      },
      customButtons: {
        sidebarToggle: {
          icon: 'bi bi-list',
          click() {
            handleLeftSidebarToggle()
          }
        }
      },
      dateClick(info) {
        const ev = { ...blankEvent }
        ev.start = info.date
        ev.end = info.date
        ev.allDay = true
        dispatch(handleSelectEvent(ev))
        handleAddEventSidebarToggle()
      },
      eventDrop({ event: droppedEvent }) {
        dispatch(updateEvent(droppedEvent))
      },
      eventResize({ event: resizedEvent }) {
        dispatch(updateEvent(resizedEvent))
      },
      ref: calendarRef,
      direction
    }
    return <FullCalendar {...calendarOptions} />
  } else {
    return null
  }
}

export default Calendar
