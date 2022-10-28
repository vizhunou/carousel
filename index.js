class Carousel {
    element;

    track;

    frames;

    backwardButton;

    forwardButton;

    transition = 'transform .5s';

    step = 100;

    _shift = 0;

    clientX = null;

    _clientXDiff = null;

    get clientXDiff() {
        return this._clientXDiff;
    }

    set clientXDiff(value) {
        this._clientXDiff = value;
        const shift = 100 * Math.abs(this.clientXDiff) / this.elementDOMRect.width;
        this.slide(this.shift + shift * (this.clientXDiff < 0 ? -1 : 1));
    }

    get elementDOMRect() {
        return this.element.getBoundingClientRect();
    }

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
        this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.forwardButton.addEventListener('click', this.handleForwardButtonClick.bind(this));
        this.backwardButton.addEventListener('click', this.handleBackwardButtonClick.bind(this));
        this.track.addEventListener('transitionend', this.handleTransitionEnd.bind(this));
    }

    handleMouseDown({ clientX }) {
        console.log(clientX);
        this.clientX = clientX;
        document.addEventListener('mousemove', this.boundHandleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp.bind(this), { once: true });
    }

    handleMouseMove({ clientX }) {
        this.clientXDiff = clientX - this.clientX;
    }

    boundHandleMouseMove = this.handleMouseMove.bind(this);

    handleMouseUp() {
        document.removeEventListener('mousemove', this.boundHandleMouseMove);
        this.clientXDiff < 0 ? this.stepForward() : this.stepBack();
    }

    handleTransitionEnd() {
        this.removeTransition();

        if (this.isCurrentFrameTheFirst) {
            this.prependFrame();
            this.stepForward();
        }
        else if (this.isCurrentFrameTheLast) {
            this.appendFrame();
            this.stepBack();
        }

        setTimeout(this.setTransition.bind(this));
    }

    handleBackwardButtonClick(event) {
        event.stopPropagation();
        this.stepBack();
    }

    handleForwardButtonClick(event) {
        event.stopPropagation();
        this.stepForward();
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

    slide(shift) {
        this.track.style.transform = `translateX(${shift || this.shift}%)`;
    }

    setTransition() {
        this.track.style.transition = this.transition;
    }

    removeTransition() {
        this.track.style.transition = 'none';
    }
}

new Carousel(document.querySelector('.carousel')).run();
