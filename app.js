document.querySelector('.callback-btn').addEventListener('click', callbackBtn);
document.querySelector('.promise-btn').addEventListener('click', promiseBtn);
document.querySelector('.filter-btn').addEventListener('click', filterMethodServer);
document.querySelector('.filter-client-btn').addEventListener('click', filterMethodClient);
document.getElementById('paymentForm').addEventListener('submit', sendForm);
document.querySelector('.btn-show-all').addEventListener('click', showAllPayments);

//---------------- CUSTOM AJAX W/ CALLBACKS LIBRARY -----------------

function fromDB(url, methodType, callback) { // could be GET / DELETE
    var xhr = new XMLHttpRequest();

    xhr.open(methodType, url, true);

    xhr.onload = function() {
        if(xhr.status === 200) {
            console.log(xhr.status);
            var resp = xhr.responseText;
            // var payments = JSON.parse(resp);
            callback(null, resp);
        } else {
            callback('Error: ' + xhr.status);
        }
    }
    xhr.send();
    // console.log(xhr.status ' = request successfully sent'); // 0
}

function toDB(url, methodType, data, callback) { // could be POST / PUT
    var xhr = new XMLHttpRequest();

    xhr.open(methodType, url, true);
    xhr.setRequestHeader('Content-type', 'application/json');

    xhr.onload = function() {
        console.log(xhr.status);
        var resp = xhr.responseText;
        callback(null, resp);
    }
    xhr.send(JSON.stringify(data));
}

//---------------- CUSTOM FETCH W/ PROMISES LIBRARY (OR IT COULD BE, TO BE EXACT) -----------------

function get(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
}

//---------------- CALLBACK BUTTON -----------------

function callbackBtn() {
    var url = "http://localhost:3000/payments";
    var methodType = "GET";
    
    fromDB(url, methodType, function(error, resp) {
        if(error) {
            console.log(error);
        } else {
            // an array of objects
        const payments = JSON.parse(resp);
            // descending sort of objects' "amounts" in an array
        let paymentAmaunts = payments.sort(function (p1, p2){
            return p2.amount - p1.amount;
        });
    
            // an array of 20 objects with the highest "amount"
        var highestTwentyAmounts = paymentAmaunts.slice(0, 20);
    
            // init a var for innerHtML
        var output = '';
    
            // display all of the 20 highest payments in UI, convert amount from cents
        highestTwentyAmounts.forEach(payment => {
        output += `
            <tr class="tr">                    
                <td class="td-id">${payment.id}</td>
                <td class="td-method">${payment.method}</td>
                <td class="td-amount">${payment.amount / 100} ${ payment.currency}</td> 
                <td class="td-date">${payment.created}</td>
                <td class="td-status">${payment.status}</td>
                <td class="td-merchant">${payment.merchant}</td>
            </tr>  
        `;
        });
        document.querySelector('.tbody').innerHTML = output;
        }
    });
}

//---------------- PROMISE BUTTON -----------------

function promiseBtn() {
    var url = 'http://localhost:3000/payments';

    get(url)
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
                            <td class="td-amount">${payment.amount / 100} ${ payment.currency}</td>
                            <td class="td-date">${payment.created}</td>
                            <td class="td-status">${payment.status}</td>
                            <td class="td-merchant">${payment.merchant}</td>
                        </tr>  
                    `;   
                }      
            })         
            document.querySelector('.tbody').innerHTML = output; 
        })
        .catch(error => reject(console.log(error)));
}

//---------------- Filter Payment-Method (server) BUTTON -----------------

function filterMethodServer() {
    var url = "http://localhost:3000/payments";
    var methodType = "GET";

    fromDB(url, methodType, function(error, resp) {
        if(error) {
            console.log(error);
        } else {
            // an array of objects
           const payments = JSON.parse(resp);
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
                            <td class="td-amount">${payment.amount / 100} ${ payment.currency}</td>
                            <td class="td-date">${payment.created}</td>
                            <td class="td-status">${payment.status}</td>
                            <td class="td-merchant">${payment.merchant}</td>
                        </tr>  
                    `;
                });
                document.querySelector('.tbody').innerHTML = output;
            }
        }
    });
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
    var url = "http://localhost:3000/payments";
    var methodType = "POST";
    
    // get the selected method  
    var methodSelection = document.querySelector('.form-method-selection');
    var methodSelected = methodSelection.options[methodSelection.selectedIndex].text;

    // get the selected currency
    var currencySelection = document.querySelector('.currency-selection');
    var currencySelected = currencySelection.options[currencySelection.selectedIndex].text;

    // get the the input data from the form
    var data = {
    id: "", 
    method: methodSelected,
    amount: document.querySelector('.form-amount').value,
    currency: currencySelected,
    created: new Date().toString(),
    status: "", // ?
    merchant: document.querySelector('.form-merchant').value
    };

    toDB(url, methodType, data, function(error, resp) {
        if(error) {
            console.log(error);
            alert('Oops! Something went wrong.');
        } else {
            console.log(resp);
            alert('Payment successfully sent!');
        }
    });
    e.preventDefault();
}

//---------------- SHOW ALL BUTTON -----------------

function showAllPayments() {
    var url = "http://localhost:3000/payments";
    var methodType = "GET";

    fromDB(url, methodType, function(error, resp) {
        if(error) {
            console.log(error);
        } else {
            // an array of objects
           const payments = JSON.parse(resp);
            // init a var for innerHtML
           var output = '';
    
            // display all of the 20 highest payments in UI
            payments.forEach(payment => {
               output += `
                   <tr class="tr">                    
                       <td class="td-id">${payment.id}</td>
                       <td class="td-method">${payment.method}</td>
                       <td class="td-amount">${payment.amount / 100} ${ payment.currency}</td>
                       <td class="td-date">${payment.created}</td>
                       <td class="td-status">${payment.status}</td>
                       <td class="td-merchant">${payment.merchant}</td>
                   </tr>  
               `;
           });
           document.querySelector('.tbody').innerHTML = output;
        }
    });
}