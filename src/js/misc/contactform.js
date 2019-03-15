export default class ContactForm {
    constructor(opt) {
         this.form = document.querySelector(opt.formSellector);
         this.formsList = [].slice.call(this.form.querySelectorAll(opt.formListSellector));
         this.subBtn = this.form.querySelector('button[type="submit"]');
         this._start();
    }

    _start() {
        if(this.formsList.length) {
            for(let i = 0; i < this.formsList.length; ++i) {
                let validateStatus = this.formsList[i].getAttribute('data-validate');
                if(validateStatus) {
                    this.formsList[i].setAttribute('data-isvalid', false);
                    this.formsList[i].addEventListener('input', this._checkInputValues.bind(this));
                }
            }
        }
        
        this.form.addEventListener('submit', this._formData.bind(this));
    }

    _checkInputValues(e) {
        let target = e.currentTarget;
        let value = target.value;
        let validCheck = this._validate(target);
        if(validCheck) {
            target.setAttribute('data-isvalid', true); 
            target.style.borderColor = '';
        } else {
            target.setAttribute('data-isvalid', false);
        }
    }

    _validate(input) {
        let paternText =/^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
        let paternEmail =/^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;
        let paternPhone =/[0-9]{5,16}/;
        let inputType = input.getAttribute('type');
        let value = input.value;
                    
        switch(inputType) {
            case 'text':
                return paternText.test(value);
            case 'email':
                return paternEmail.test(value);
            case 'tel':
                return paternPhone.test(value);
            default:
                return false;
        }
    }

    _checkValidForm() {
        let erroesArr = [];
        if(this.formsList.length) {
            for(let i = 0; i < this.formsList.length; ++i) {
                if(this.formsList[i].hasAttribute('data-validate') && this.formsList[i].getAttribute('data-isvalid') == 'false') {
                    erroesArr.push(this.formsList[i]);
                }
            }
            if(erroesArr.length) {
                this._setErrVisual(erroesArr);
                return false
            } else {
                return true
            }
        }
    }

    _setErrVisual(erroesArr) {
        for(let i = 0; i < erroesArr.length; ++i) {
            erroesArr[i].style.borderColor = 'red';
        }
    }

    _clearInputs() {
        for(let i = 0; i < this.formsList.length; ++i) {
            this.formsList[i].value = ''
        }
    }

    _formData(e) {
        e.preventDefault();
        let isAllFormValid = this._checkValidForm();
        console.log(isAllFormValid)
        if(isAllFormValid) {
            let info = {
                name: this.form.querySelector("[name='name']").value,
                phone: this.form.querySelector("[name='phone']").value,
                mail: this.form.querySelector("[name='e-mail']").value,
                text: this.form.querySelector("[name='message']").value
            };

            this._ajaxSend(info)
        }

    }

    _toggleMessage(message) {
        let el = document.createElement('DIV');
            el.classList.add('service-message');
            el.innerHTML = message;
        document.body.appendChild(el);

        let frame = requestAnimationFrame(function() {
            el.classList.add('show')
            el.addEventListener('transitionend', toggleMessage);

            function toggleMessage() {
                if(el.classList.contains('show')){
                    setTimeout(()=>{
                        el.classList.remove('show');
                    }, 3000)
                } else {
                    el.removeEventListener('transitionend', toggleMessage);
                    cancelAnimationFrame(frame);
                    el.parentNode.removeChild(el);
                }
                
            }






        })

        // function hideMessage() {
        //     setTimeout(()=>{
        //         el.classList.remove()
        //     }, 3000)
        // }
        // let transitionEnd = el.addEventListener('transitionend', hideMessage);

    }

    _ajaxSend(params) {
        
        let xhr = new XMLHttpRequest();
        let paramsStr = 'name=' + params.name + '&email=' + params.phone + '&phone=' + params.mail + '&text=' + params.text;
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                this._clearInputs();
                this._toggleMessage('Thank\'s! We will contact with you as soon as posible');
            }
        }
        xhr.open('POST', '../php/mail.php');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(paramsStr);
    }

}