var form = {};
form.fipe = document.getElementById("fipe");
form.marcas = document.getElementById("marcas");
form.modelos = document.getElementById("modelos");
form.anos = document.getElementById("anos");
form.fieldset = document.getElementById("veiculo");

let xlabels = [];
let anosArr2 = [];
let arrNew = [];
let arrModelo = [];
const flabels = '';
const labelsChart = '';

 var getJSON = function (url, sucesso, erro) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.open("GET",url, true);
  httpRequest.responseType = "json";
  httpRequest.addEventListener("readystatechange", function (event) {
    if (httpRequest.readyState == 4) {
      if (httpRequest.status == 200) {
        if (sucesso) sucesso(httpRequest.response);
      } else {
        if (erro) erro(httpRequest.status, httpRequest.statusText);
      }
    }
  });

  httpRequest.send();
}

var getMarcas = function() {
  var url = `https://parallelum.com.br/fipe/api/v1/carros/marcas`
  getJSON(url, function (data) {
    var marcas = '<option disabled selected value> SELECIONE UMA MARCA </option>';
    for (var i in data) {
     marcas += '<option value ="'+data[i].codigo +'">'+data[i].nome+'</option>'
  }
  document.getElementById('marcas').innerHTML = marcas;
}, function (errorCode, errorText) {
  console.log('Código: ' + errorCode);
  console.log('Mensagem de erro: ' + errorText);
});
}

var getModelos = function () {
  var brandId = document.getElementById('marcas').value;
  url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandId}/modelos`
  
getJSON( url, function (data) {
  var modelos = '<option disabled selected value> SELECIONE UM MODELO </option>';
  for (var modelo of data.modelos) {
    modelos += '<option value ="'+modelo.codigo +'">'+modelo.nome+'</option>'

  }
     document.getElementById('modelos').innerHTML = modelos;

}, function (errorCode, errorText) {
  console.log('Código: ' + errorCode);
  console.log('Mensagem de erro: ' + errorText);
});
}

var getAno = function () {
  var brandId = document.getElementById('marcas').value;
  var modelId = document.getElementById('modelos').value;
  xlabels = [];
  url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandId}/modelos/${modelId}/anos`

getJSON( url, function (data) {
  var anos = '';
  var anosArr = [];
  var nomes = '';
for (var i in data) {
  nomes += data[i].nome.slice(0, 5).split(' ');
  anos += data[i].codigo;
  var replaced = data[i].codigo.replace(/-1|-3/g, '');
  anosArr.push(replaced);
  anosArr2.push(data[i].codigo);
  anosArr2 = anosArr2.filter(function(item, pos) {
    return anosArr2.indexOf(item) == pos;
})
}
anosArr = anosArr.reverse()
  anosArr.map((anos, index) => {
    if (anos == '32000') {
      anosArr[index] = '0 KM';
    }
  })
xlabels.push(anosArr);
ano = data[0].codigo;
getValor();
getValores();
return ano, anos, anosArr2;
}, function (errorCode, errorText) {
  console.log('Código: ' + errorCode);
  console.log('Mensagem de erro: ' + errorText);
});
}


var getValores = function () {
  var brandId = document.getElementById('marcas').value;
  var modelId = document.getElementById('modelos').value;
  var yearId = this.anosArr2;
  var res = [];
  arrNew = [];
  var promiseAnos = anosArr2.map((yearId) => {
    return new Promise((resolve, reject) => {
      url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandId}/modelos/${modelId}/anos/${yearId}`
      getJSON(url, function (data) {
        resolve(true);
        let validNumber = data.Valor.replace(/[^0-9,]+/g, '');
        validNumber = validNumber.replace(/,/g, '.')
        arrNew.push(validNumber);
        arrNew.sort((a,b) => a-b);
      }, function (errorCode, errorText) {
        reject(errorCode);
        console.log('Código: ' + errorCode);
        console.log('Mensagem de erro: ' + errorText);
      });
      }
    );
  });
Promise.all(promiseAnos.map((promise) => promise.catch((error) => error))).then((res) => {
  var arrTrue = res.filter((retorno) => retorno === true)
  if (arrTrue.length === 0) {
  } else {
    criarChart();
  }
}).catch((error) => { 
})
}


const getValor = function () {
  var brandId = document.getElementById('marcas').value;
  var modelId = document.getElementById('modelos').value;
  var yearId = this.ano;
  arrModelo = [];
  url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandId}/modelos/${modelId}/anos/${yearId}`
  
  getJSON(url, function (data) {
  var valores = '';
  if (xlabels[0].lastIndexOf('0 KM') >= 0) {
    valores += ''+data.Valor;
  } else if (xlabels[0].lastIndexOf('0 KM') == -1){ 
    valores += 'FORA DE LINHA';
  }
  var validModelo = data.Modelo
  arrModelo.push(validModelo)
    document.getElementById('valores').innerHTML = valores;
    document.getElementById('valores').value = valores;
  }, function (errorCode, errorText) {
    console.log('Código: ' + errorCode);
    console.log('Mensagem de erro: ' + errorText);
  });
}
function criarChart() {
const ctx = document.getElementById('chart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: xlabels[0],
        datasets: [{
            label: arrModelo,
            data: arrNew ,
            precision: 10,
            fill: false,
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(192,192,192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(192,192,192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(192,192,192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(192,192,192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(192,192,192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(192,192,192, 0.2)'


          ],
          borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(192, 192, 192, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(192, 192, 192, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(192, 192, 192, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(192, 192, 192, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(192, 192, 192, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(192, 192, 192, 1)'

          ],
            borderWidth: 5
        }]
    },
    options: {
      responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false
                }
            }]
        }
    }
});
}

getMarcas();