export default class AddCart {
    constructor(btn, client) {
        this.button = btn;
        this.id = this.button.getAttribute('data-product-id');
        this.infoMess = btn.parentElement.parentElement.querySelector('[data-message]');
        this.counter = document.getElementById(this.id);
        this.orderQtyLogo = document.getElementById('dot');
        this.client = client;
        this.timer;
        // Init
        this._init()
    }

    _init() {
        this.button.addEventListener('click', this._addToCart.bind(this))
    }

    _addToCart(event) {
        // window.localStorage.clear()
        event.preventDefault();
        let currentOrdersJSON = window.localStorage.getItem('orderList');
        let currentOrders = (currentOrdersJSON) ? JSON.parse(currentOrdersJSON) : {};
        let prevQty = (currentOrders[this.id]) ? currentOrders[this.id] : 0;
        let currentCountValue = +this.counter.value;
        if(!currentCountValue) return;

        currentOrders[this.id] = currentCountValue + prevQty;
        window.localStorage.setItem('orderList', JSON.stringify(currentOrders));

        if(this.infoMess) {
            clearTimeout(this.timer)
            this.infoMess.classList.add('opened');
            this.timer = setTimeout(()=>{
                this.infoMess.classList.remove('opened');
            }, 10000)
        }
        setTimeout(function(){
            window.orderLogic.updateOrderSum();

        }, 10)
    }
}