export default class Counter {
    constructor(counter) {
        this.counter = counter;
        this.incrementBtn = counter.querySelector('.increment');
        this.decrementBtn = counter.querySelector('.decrement');
        this.input = counter.querySelector('input');
        this.activeVal = 0;

        // Init
        this._init()
    }

    _init() {
        this.input.value = this.activeVal;
        this.counter.addEventListener('click', this._changeValueFromBtns.bind(this))
        this.input.addEventListener('change', this._changeValueFromInput.bind(this))
    }

    _changeValueFromBtns(e) {
        let target = e.target;
        if(target == this.incrementBtn) {
            ++this.activeVal;
            this.input.value = this.activeVal;
        } else if (target == this.decrementBtn) {
            let newValue = this.activeVal - 1;
            this.activeVal = this._checkMinusValue(+parseInt(newValue));
            this.input.value = this.activeVal;
        }
    }

    _changeValueFromInput(e) {
        let newInputVal = e.target.value;
        this.activeVal = this._checkMinusValue(+parseInt(newInputVal));
        this.input.blur();
    }

    _checkMinusValue(newValue) {

        if(newValue >= 0) {
            return newValue
        } else {
            return this.activeVal;
        } 
    }
}