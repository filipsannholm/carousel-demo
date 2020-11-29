import React, { useRef, useState, useContext, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import classnames from 'classnames';

import './SimpleCarousel.scss';

const defaultContext = {
    previous: () => { },
    next: () => { },
    setSlides: () => { },
    activePosition: 0,
    slides: 0,
    containerSize: {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        width: 0,
        height: 0
    },
    handlers: {}
}
const PositionContext = React.createContext(defaultContext)

const config = {
    delta: 50,
    preventDefaultTouchmoveEvent: false,
    trackTouch: true,
    trackMouse: false,
    rotationAngle: 0
}

export function SimpleCarousel({ children }) {

    const container = useRef(null)
    const [position, setPosition] = useState(0)
    const [slides, setSlides] = useState(0);

    const handleNextClick = () => {
        if (position === slides - 1) {
            setPosition(0)
        } else {
            setPosition(position + 1)
        }
    }

    const handlePreviousClick = () => {
        if (position === 0) {
            setPosition(slides - 1)
        } else {
            setPosition(position - 1)
        }
    }

    const handleSlidesChange = (value) => {
        setSlides(value)
    }

    const handlers = useSwipeable({
        onSwipedLeft: handleNextClick,
        onSwipedRight: handlePreviousClick,
        ...config
    })

    let contextValue = {
        ...defaultContext,
        next: handleNextClick,
        previous: handlePreviousClick,
        activePosition: position,
        slides,
        setSlides: handleSlidesChange,
        handlers,
    }
    if (container.current) {
        contextValue = { ...contextValue, containerSize: container.current.getBoundingClientRect() };
    }
    return (
        <PositionContext.Provider value={contextValue}>
            <div className={'Carousel--wrapper'} ref={container}>
                {children}
            </div>
        </PositionContext.Provider>
    )
}

export const Controls = (props) => {
    return <div className='Carousel--controls'>{props.children}</div>;
}

export const Slides = (props) => {
    const slides = props.children
    const context = useContext(PositionContext);

    useEffect(() => {
        context.setSlides(slides.length)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slides])

    const width = slides.length * context.containerSize.width + 'px';
    const pos = `translate(${context.activePosition * -1 * (100 / slides.length)}%)`
    return (
        <div className={'Carousel--track'} style={{ width, transform: pos }} {...context.handlers}>
            {slides.map((slide, i) => {
                const slideWidth = (100 / slides.length) + '%'
                return React.cloneElement(slide, { key: i, style: { width: slideWidth } })

            })}
        </div>
    )
}

const DefaultIndicator = ({ active }) => {
    const classes = classnames('Carousel--pageIndicator', { 'active': active })
    return (
        <div className={classes}></div>
    )
}

export const PageIndicator = ({ Indicator }) => {
    const position = useContext(PositionContext);
    const Element = Indicator || DefaultIndicator;
    let items = [];
    for (let i = 0; i < position.slides; i++) {
        const isActive = i === position.activePosition;
        items.push(<Element key={i} active={isActive} />)
    }
    return <div className={'Carousel--indicatorTrack'}>{items}</div>
}

export const PreviousButton = (props) => {
    const functions = useContext(PositionContext)
    return (
        React.cloneElement(props.children, { onClick: functions.previous })
    )
}
export const NextButton = (props) => {
    const functions = useContext(PositionContext)
    return (
        React.cloneElement(props.children, { onClick: functions.next })
    )
}

