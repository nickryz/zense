export default class HoverImg {
    constructor(trigerWrap, targetSelector, imgContainerSelector) {
        this.trigerWrap = trigerWrap;
        this.targetElSelector = targetSelector;
        this.imgContainerSelector = imgContainerSelector;
        this.currentElem = null;
        // Init
        this._init()
    }

    _init() {
        this.trigerWrap.addEventListener('mouseover', this._checkMousOver.bind(this));
        this.trigerWrap.addEventListener('mouseout', this._checkMousOut.bind(this));
    }

    _checkMousOver(e) {
        if (this.currentElem) return;
        let target = e.target;
        while (target != e.currentTarget) {
            if (target.classList.contains(this.targetElSelector.slice(1))) break;
            target = target.parentNode;
        }
        if (target == e.currentTarget) return;
        this.currentElem = target;
        this._changePhoto(target);  
    }

    _checkMousOut(e) {
        if (!this.currentElem) return;

        let relatedTarget = e.relatedTarget;
        if (relatedTarget) { 
            while (relatedTarget) {
            if (relatedTarget == this.currentElem) return;
                relatedTarget = relatedTarget.parentNode;
            }
        }

        this.currentElem = null;
    }

    _changePhoto(target) {
        let imgLink = target.getAttribute('data-src');

        if(imgLink) {
            document.querySelector(this.imgContainerSelector).setAttribute('src', imgLink)
        }
    }

    
}