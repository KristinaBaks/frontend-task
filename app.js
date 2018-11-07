document.querySelector('.callback-btn').addEventListener('click', callbackBtn);
document.querySelector('.promise-btn').addEventListener('click', promiseBtn);
document.querySelector('.filter-btn').addEventListener('click', filterMethodServer);
document.querySelector('.filter-client-btn').addEventListener('click', filterMethodClient);
document.getElementById('paymentForm').addEventListener('submit', sendForm);
document.querySelector('.btn-show-all').addEventListener('click', showAllPayments);

//---------------- CALLBACK BUTTON -----------------

function callbackBtn() {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost:3000/payments', true);

    xhr.onload = function() {
        if(this.status === 200) {
             // an array of objects
            const payments = JSON.parse(this.responseText);

             // descending sort of objects' "amounts" in an array
            let paymentAmaunts = payments.sort(function (p1, p2){
                return p2.amount - p1.amount;
            });

             // an array of 20 objects with the highest "amount"
            var highestTwentyAmounts = paymentAmaunts.slice(0, 20);

             // init a var for innerHtML
            var output = '';

             // display all of the 20 highest payments in UI
            highestTwentyAmounts.forEach(payment => {
                output += `
                    <tr class="tr">                    
                        <td class="td-id">${payment.id}</td>
                        <td class="td-method">${payment.method}</td>
                        <td class="td-amount">${payment.amount} ${ payment.currency}</td>
                        <td class="td-date">${payment.created}</td>
                        <td class="td-status">${payment.status}</td>
                        <td class="td-merchant">${payment.merchant}</td>
                    </tr>  
                `;
            });
            document.querySelector('.tbody').innerHTML = output;
        } 
    }
    xhr.onerror = function(){
        alert(this.responseText);
    }
    xhr.send();
}

//---------------- PROMISE BUTTON -----------------

function promiseBtn() {
    return new Promise(function(resolve, reject) {
        fetch('http://localhost:3000/payments')
            .then(res => res.json()) // returns a promise
            .then(data => {

                let output = ''; 
        
                // go through each payment
                data.forEach(payment => {
                    // if a merchant's name is "Ginger"
                    if(payment.merchant === 'Ginger') {
                        // display those payments in DOM
                         output += `
                            <tr class="tr">                    
                                <td class="td-id">${payment.id}</td>
                                <td class="td-method">${payment.method}</td>
                                <td class="td-amount">${payment.amount} ${ payment.currency}</td>
                                <td class="td-date">${payment.created}</td>
                                <td class="td-status">${payment.status}</td>
                                <td class="td-merchant">${payment.merchant}</td>
                            </tr>  
                        `;   
                    }      
                })         
                document.querySelector('.tbody').innerHTML = output; 
                return resolve(data); 
            })
            .catch(error => reject(console.log(error)));
    })
}

//---------------- Filter Payment-Method (server) BUTTON -----------------

function filterMethodServer() {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost:3000/payments', true);

    xhr.onload = function() {
        if(this.status === 200) {
            const payments = JSON.parse(this.responseText);

            // get the selected method      
            var methodSelection = document.querySelector('.method-selection');
            var methodSelected = methodSelection.options[methodSelection.selectedIndex].text;

            // check if a method has been selected
            if(methodSelected === 'Payment methods') {
                alert('No payment has been selected.')
            } else {
                // compare the selected method with methods in DB, return matched
                let paymentMethod = payments.filter(function(payment) {
                    if(payment.method === methodSelected) {
                        return payment;
                    }
                });
    
                // init a var for innerHtML
                var output = '';
    
                // display all of the payments with matched method in DOM
                paymentMethod.forEach(payment => {
                    output += `
                        <tr class="tr">                    
                            <td class="td-id">${payment.id}</td>
                            <td class="td-method">${payment.method}</td>
                            <td class="td-amount">${payment.amount} ${ payment.currency}</td>
                            <td class="td-date">${payment.created}</td>
                            <td class="td-status">${payment.status}</td>
                            <td class="td-merchant">${payment.merchant}</td>
                        </tr>  
                    `;
                });
                document.querySelector('.tbody').innerHTML = output;
            }
        } 
    }
    xhr.onerror = function(){
        alert(this.responseText);
    }
    xhr.send();
}

//---------------- Filter Payment-Method (client) BUTTON -----------------

function filterMethodClient() {
    // get the selected method      
    var methodSelection = document.querySelector('.method-selection');
    var methodSelected = methodSelection.options[methodSelection.selectedIndex].text; 
    
    // select all table cells with a class 'td-method'
    var methodsinBody = document.querySelectorAll('.td-method'); 

    // init a var for foreach output
    var output = '';

    // get table cell 
    var td = document.querySelector('td');
    
    // throw some informational alerts here and there
    if(methodSelected === 'Payment methods') {
        alert('No payment has been selected.');
    } 
    if(td.textContent === '...' ){
        alert('Nothing to sort through. Select Callback/ Promise /Show All to filter again.');
    }

    // sift through the td-methods to get data to be displayed in DOM
    methodsinBody.forEach(function(method){ 
        if(method.textContent === methodSelected)  { // match selected method
        var outputMethod = method.parentNode; // every tr of td matched

        // display rows of matched methods
        output += `
            <tr class="tr">                    
                <td class="td-id">${outputMethod.cells[0].innerText}</td>
                <td class="td-method">${outputMethod.cells[1].innerText}</td>
                <td class="td-amount">${outputMethod.cells[2].innerText}</td>
                <td class="td-date">${outputMethod.cells[3].innerText}</td>
                <td class="td-status">${outputMethod.cells[4].innerText}</td>
                <td class="td-merchant">${outputMethod.cells[5].innerText}</td>
            </tr>  
        `;
        } 
        document.querySelector('.tbody').innerHTML = output; 
    });
}

//---------------- ADD PAYMENT > FORM > SEND BUTTON -----------------

function sendForm(e) {
    const xhr = new XMLHttpRequest();
    
    xhr.open('POST', 'http://localhost:3000/payments', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // get the selected method  
    var methodSelection = document.querySelector('.form-method-selection');
    var methodSelected = methodSelection.options[methodSelection.selectedIndex].text;

    // get the selected currency
    var currencySelection = document.querySelector('.currency-selection');
    var currencySelected = currencySelection.options[currencySelection.selectedIndex].text;

    // get the the input data from the form
    var data = JSON.stringify({
    id: "", 
    method: methodSelected,
    amount: document.querySelector('.form-amount').value,
    currency: currencySelected,
    created: new Date().toString(),
    status: "", // ?
    merchant: document.querySelector('.form-merchant').value
    })     
    // catch errors
    xhr.onerror = function(){
        // console.log(this.responseText);
        showMessage('Oops! Something went wrong.');
    }
    xhr.send(data);
    e.preventDefault();
    showMessage('Payment successfully sent!');
}
function showMessage(msg) {
    document.querySelector('.modal-body').innerHTML = '';
    output = `
        <center><p>${msg}</p></center>
    `;
    document.querySelector('.modal-body').innerHTML = output; 
}

//---------------- SHOW ALL BUTTON -----------------

function showAllPayments() {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost:3000/payments', true);

    xhr.onload = function() {
        if(this.status === 200) {
             // an array of objects
            const payments = JSON.parse(this.responseText);

             // init a var for innerHtML
            var output = '';

             // display all of the 20 highest payments in UI
             payments.forEach(payment => {
                output += `
                    <tr class="tr">                    
                        <td class="td-id">${payment.id}</td>
                        <td class="td-method">${payment.method}</td>
                        <td class="td-amount">${payment.amount} ${ payment.currency}</td>
                        <td class="td-date">${payment.created}</td>
                        <td class="td-status">${payment.status}</td>
                        <td class="td-merchant">${payment.merchant}</td>
                    </tr>  
                `;
            });
            document.querySelector('.tbody').innerHTML = output;
        } 
    }
    xhr.onerror = function(){
        alert(this.responseText);
    }
    xhr.send();
}