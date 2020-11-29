import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { SimpleCarousel, Controls, Slides, PreviousButton, NextButton, PageIndicator } from './SimpleCarousel';

import styles from './demo.scss';

const Demo = () => {

  const [events, setEvents] = useState([])

  useEffect(() => {
    const eventFetch = async () => {
      const events = await getEvents()
      setEvents(events)
    }
    eventFetch()
  }, [])
  return (
    <div className={styles.container}>
      <SimpleCarousel>
        <Controls>
          <PreviousButton>
            <button><Arrow left /></button>
          </PreviousButton>
          <PageIndicator />
          <NextButton>
            <button><Arrow /></button>
          </NextButton>
        </Controls>
        <Slides>
          {events.map(event => <Slide event={event} />)}
        </Slides>
      </SimpleCarousel>
    </div>
  )
}

const Slide = ({ event }) => {
  const image = event.description.images[0] || null
  const eventDate = new Date(event.event_dates.starting_day)
  return (
    <div className={styles.slide}>
      <div>
        {image &&
          <img src={image.url} alt='' />
        }
        <div className={styles.details}>
          <h4>{event.name.fi}</h4>
          <div>
            {`Esitysaika  ${eventDate.toLocaleDateString()} ${eventDate.toLocaleTimeString()}`}
          </div>
        </div>
      </div>
    </div>
  )
}

const Arrow = ({ left }) => {
  const classes = `${styles.arrow} ${left ? styles.left : ''}`
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" className={classes}>
      <path d="m7.707031 3l-.707031.707031 6.125 6.125 1.167969 1.167969-1.167969 1.167969-6.125 6.125.707031.707031 6.125-6.125 1.875-1.875-1.875-1.875-6.125-6.125"></path>
    </svg>
  )
}

const getEvents = async () => {
  const url = new URL('https://cors-anywhere.herokuapp.com/http://open-api.myhelsinki.fi/v1/events/?limit=10')
  try {
    const res = await fetch(url);
    const { data } = await res.json()
    return data;
  } catch (e) {
    console.error('Fetch failed', e)
  }
}

render(<Demo />, document.getElementById('root'))