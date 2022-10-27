const Direction = {
    FORWARD: 'forward',
    BACKWARD: 'backward',
};

class Carousel {
    element;

    track;

    frames;

    backwardButton;

    forwardButton;

    transition = 'transform .5s';

    direction = null;

    constructor(element) {
        this.element = element;

        this.track = this.element.querySelector('.carousel_track');

        this.frames = this.track.children;

        this.backwardButton = this.element.querySelector('.carousel_controlButton__backward');

        this.forwardButton = this.element.querySelector('.carousel_controlButton__forward');
    }

    run() {
        this.forwardButton.addEventListener('click', this.handleForwardButtonClick.bind(this));
        this.backwardButton.addEventListener('click', this.handleBackwardButtonClick.bind(this));
        this.track.addEventListener('transitionend', this.handleTransitionEnd.bind(this));
    }

    handleTransitionEnd() {
        switch(this.direction) {
            case Direction.BACKWARD:
                this.removeTransition();
                break;
            case Direction.FORWARD:
                this.appendFrame();
                setTimeout(() => {
                    this.removeTransition();
                    this.rewind();
                });
                break;
        }
    }

    handleBackwardButtonClick() {
        this.direction = Direction.BACKWARD;
        this.prependFrame();
        this.forward();
        setTimeout(() => {
            this.setTransition();
            this.rewind();
        });
    }

    handleForwardButtonClick() {
        this.direction = Direction.FORWARD;
        this.setTransition();
        this.forward();
    }

    appendFrame() {
        this.track.appendChild(this.frames[0]);
    }

    prependFrame() {
        this.track.prepend(this.frames[this.frames.length - 1]);
    }

    forward() {
        this.track.style.transform = 'translateX(-100%)';
    }

    rewind() {
        this.track.style.transform = 'translateX(0)';
    }

    setTransition() {
        this.track.style.transition = this.transition;
    }

    removeTransition() {
        this.track.style.transition = 'none';
    }
}

new Carousel(document.querySelector('.carousel')).run();
