
const cambio =document.getElementById('camb');
const historico =document.getElementById('hist');
const btncambio =document.getElementById('showhist');
const btnhistorico =document.getElementById('showcamb');
const btncambio2 =document.getElementById('showhist2');
const btnhistorico2 =document.getElementById('showcamb2');

//Función para mostrar historico y ocultar cambio
function mostrarHistorico() {
    cambio.style.display = 'none';
    historico.style.display = 'block';
}

//Función para mostrar cambio y ocultar historico
function mostrarCambio() {
    historico.style.display = 'none';
    cambio.style.display = 'block';
}

//Asignar eventos a botones
btncambio.addEventListener('click', mostrarHistorico);
btnhistorico.addEventListener('click', mostrarCambio);
btncambio2.addEventListener('click', mostrarHistorico);
btnhistorico2.addEventListener('click', mostrarCambio);



document.addEventListener('DOMContentLoaded', () => {
    const inputCurrency = document.getElementById('input-currency');
    const outputCurrency = document.getElementById('output-currency');
    const selectFrom = document.querySelector('.caja.origen select');
    const selectTo = document.querySelector('.caja.destino select');
    const form = document.getElementById('formulario');
    const exchangeRatesDiv = document.getElementById('exchange-rates');
    const historyRatesDiv = document.querySelector('.history-rates');
    
    //Cargar divisas disponibles
    fetch('https://api.frankfurter.app/currencies')
        .then(response => response.json())
        .then(data => {
            for (const currency in data) {
                const optionFrom = document.createElement('option');
                optionFrom.textContent = currency;
                const optionTo = optionFrom.cloneNode(true);
                selectFrom.appendChild(optionFrom);
                selectTo.appendChild(optionTo);
            }
        })
        .catch(error => console.error('Error al cargar las divisas:', error));

    //Convertir divisas al enviar el formulario
    form.addEventListener('submit', event => {
        event.preventDefault();
        const amount = parseFloat(inputCurrency.value);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }
        const fromCurrency = selectFrom.value;
        const toCurrency = selectTo.value;

        fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la respuesta de la API: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const rate = data.rates[toCurrency];
                if (rate) {
                    const result = (amount * rate).toFixed(2);
                    outputCurrency.value = result;
                    mostrarTiposDeCambio(data.rates);
                    guardarEnHistorial(amount, fromCurrency, toCurrency, result);
                    mostrarHistorial();
                } else {
                    alert('Error al obtener la tasa de cambio. Por favor, inténtalo de nuevo.');
                }
            })
            .catch(error => {
                console.error('Error al obtener la tasa de cambio:', error);
                alert('Error al obtener la tasa de cambio. Por favor, inténtalo de nuevo.');
            });
    });

    //Mostrar los tipos de cambio en tiempo real
    const mostrarTiposDeCambio = rates => {
        exchangeRatesDiv.innerHTML = '';
        for (const currency in rates) {
            const rate = rates[currency];
            const paragraph = document.createElement('p');
            paragraph.innerHTML = `<span class="rate">1 ${selectFrom.value} = ${rate}</span> <span class="currency">${currency}</span>`;
            paragraph.querySelector('.currency').style.color = 'white';
            paragraph.querySelector('.rate').style.fontWeight = 'bold';
            paragraph.querySelector('.rate').style.color = 'white';
            exchangeRatesDiv.appendChild(paragraph);
        }
    };

    //Guardar en el historial
    const guardarEnHistorial = (amount, fromCurrency, toCurrency, result) => {
        const conversion = {
            amount,
            fromCurrency,
            toCurrency,
            result,
            date: new Date().toLocaleDateString()  //toLocaleDateString para mostrar sólo la fecha
        };
        const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
        history.push(conversion);
        localStorage.setItem('conversionHistory', JSON.stringify(history));
    };

    //Mostrarcondenido del historial
    const mostrarHistorial = () => {
        const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
        historyRatesDiv.innerHTML = '';

        history.forEach(conversion => {
            const paragraph = document.createElement('p');
            paragraph.innerHTML = `<span class="fecha">${conversion.date}</span><br><span class="operacion">${conversion.amount} ${conversion.fromCurrency} -> ${conversion.result} ${conversion.toCurrency}</span>`;
            historyRatesDiv.appendChild(paragraph);
        });
    };

    //Cargar historial al inicio
    mostrarHistorial();
   


});









