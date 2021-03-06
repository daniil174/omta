export default class ValidatorPagesModule {

    constructor() {
        this._duplicatedPage = false;
        chrome.runtime.sendMessage({
            name: 'getDuplicatePage',
        });
        this.isOnPage = false;
        window.onmouseover = function(){
            this.isOnPage = true;
        };

        window.onmouseout = function(){
            this.isOnPage = false;
        };
    }

    handle(message) {
        switch (message.name) {
            case 'getPageInfo':
                chrome.runtime.sendMessage({
                    name: 'pageInfo',
                });
                break;
            case 'duplicate_page':
                this._duplicatedPage = message.status;
                if (this._duplicatedPage) {
                    window.addEventListener('click', this._clickListener);
                    window.addEventListener('scroll', this._scrollListener);
                } else {
                    window.removeEventListener('click', this._clickListener);
                    window.removeEventListener('scroll', this._scrollListener);
                }
                break;
            case 'click':
                let element = document.elementFromPoint(message.coordinates.x,
                    message.coordinates.y);
                element.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                break;
            case 'scroll':
                window.scrollTo(message.offsetX, message.offsetY);
                break;

        }
    }

    _clickListener(event) {
        if (!event.isTrusted) {
            return;
        }

        chrome.runtime.sendMessage({
            name: 'click',
            coordinates: {
                x: event.clientX,
                y: event.clientY,
            },
        });
    }

    _scrollListener(event) {
        if (!event.isTrusted || !this.isOnPage) {
            return;
        }

        chrome.runtime.sendMessage({
            name: 'scroll',
            offsetX: window.pageXOffset,
            offsetY: window.pageYOffset,
        });
    }
}
