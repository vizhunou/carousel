class Carousel {
    element;

    track;

    frames;

    backwardButton;

    forwardButton;

    transition = 'transform .5s';

    step = 100;

    _shift = 0;

    get shift() {
        return this._shift;
    }

    set shift(value) {
        if (value < this.lowerShiftLimit || value > this.upperShiftLimit) return;
        this._shift = value;
    }

    get isCurrentFrameTheFirst() {
        return this.shift === this.upperShiftLimit;
    }

    get isCurrentFrameTheLast() {
        return this.shift === this.lowerShiftLimit;
    }

    get upperShiftLimit() {
        return 0;
    }

    get lowerShiftLimit() {
        return (this.frames.length - 1) * this.step * -1;
    }

    constructor(element) {
        this.element = element;

        this.track = this.element.querySelector('.carousel_track');

        this.frames = this.track.children;

        this.backwardButton = this.element.querySelector('.carousel_controlButton__backward');

        this.forwardButton = this.element.querySelector('.carousel_controlButton__forward');
    }

    run() {
        this.handleTransitionEnd();
        this.forwardButton.addEventListener('click', this.stepForward.bind(this));
        this.backwardButton.addEventListener('click', this.stepBack.bind(this));
        this.track.addEventListener('transitionend', this.handleTransitionEnd.bind(this));
    }

    handleTransitionEnd() {
        this.removeTransition();

        if (this.isCurrentFrameTheFirst) {
            this.prependFrame();
            this.stepForward();
        }
        if (this.isCurrentFrameTheLast) {
            this.appendFrame();
            this.stepBack();
        }

        setTimeout(this.setTransition.bind(this));
    }

    stepBack() {
        this.shift += this.step;
        this.slide();
    }

    stepForward() {
        this.shift -= this.step;
        this.slide();
    }

    appendFrame() {
        this.track.appendChild(this.frames[0]);
    }

    prependFrame() {
        this.track.prepend(this.frames[this.frames.length - 1]);
    }

    slide() {
        this.track.style.transform = `translateX(${this.shift}%)`;
    }

    setTransition() {
        this.track.style.transition = this.transition;
    }

    removeTransition() {
        this.track.style.transition = 'none';
    }
}

new Carousel(document.querySelector('.carousel')).run();
