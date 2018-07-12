/* TODO: Informacion detallada ponerla al fondo
si usuario da click en uno de los departamentos se muestra una serie de tiempo
y aparece en una tabla la información de visitantes de los municipios del departamento.
*/

// Info related to the app
let App = {
  // información de la app relacionada a la visualizacion de la informacion de los departamentos
  departamentos: {
    // The data used to render the map
    data: null,

  },

  municipios: {

  },

  // Google GeoChart is tilde and ñ sensitive, then this method is used for convert departments name
  /*
  Google GeoChart requiere que le pasemos el nombre de las ciudades con tildes y ñ, 
  debido a que el JSON que realizamos elimina estos caracteres este metodo helper
  convierte el nombre de los departamentos.

  Ademas, como GeoChart no es sensible a mayusculas, todos aquellos nombres de departamentos
  que no tengan caracteres latinos ni espacios se pueden dejar igual.
  */
  getNameWithLatinChars: function (original) {
    // The changed name
    let changed = null;
    if (original === 'BOGOTADC') {
      changed = 'Distrito Capital de Bogotá'.toUpperCase();
    }
    else if (original === 'ATLANTICO') {
      changed = 'Atlántico'.toUpperCase();
    }
    else if (original === 'BOLIVAR') {
      changed = 'Bolívar'.toUpperCase();
    }
    else if (original === 'BOYACA') {
      changed = 'Boyacá'.toUpperCase();
    }
    else if (original === 'CAQUETA') {
      changed = 'Caquetá'.toUpperCase();
    }
    else if (original === 'CORDOBA') {
      changed = 'Córdoba'.toUpperCase();
    }
    else if (original === 'CHOCO') {
      changed = 'Chocó'.toUpperCase();
    }
    else if (original === 'GUAINIA') {
      changed = 'Guainía'.toUpperCase();
    }
    else if (original === 'LAGUAJIRA') {
      changed = 'La Guajira'.toUpperCase();
    }
    else if (original === 'NARINO') {
      changed = 'Nariño'.toUpperCase();
    }
    else if (original === 'NORTEDESANTANDER') {
      changed = 'Norte de Santander'.toUpperCase();
    }
    else if (original === 'QUINDIO') {
      changed = 'Quindío'.toUpperCase();
    }
    else if (original === 'ARCHIPIELAGODESANDRESYPROVIDENCIA') {
      changed = 'San Andrés, Providencia y Santa Catalina'.toUpperCase();
    }
    else if (original === 'VALLEDELCAUCA') {
      changed = 'Valle del Cauca'.toUpperCase();
    }
    else if (original === 'VAUPES') {
      changed = 'Vaupés'.toUpperCase();
    }
    else {
      changed = original;
    }
    return changed;
  },

  isChartInitialized: function () {

  },

  addTitlesToDataArrays: function () {

  }

};

// JQuery shorthand for $('document').ready(fn);
$(function () { // This is called by jquery when document is loaded

  // Colombian heatmap example: http://www.danielpinero.com/como-crear-mapa-calor-colombia
  google.charts.load('current', {
    'packages': ['geochart', 'table'],
    // Note: you will need to get a mapsApiKey for your project.
    // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
    'mapsApiKey': 'AIzaSyAaxlmWR-_VWkr1qrFIOUurltV6EvulMLo'
  });
  google.charts.setOnLoadCallback(drawRegionsMap);


  // The data used to render the map
  var data = null;
  // Options used for render the geochart
  var options = null;
  var tableOptions = null;

  // GeoChart object
  var chart = null;
  // Table object
  var table = null;

  // used for show total visits by department
  var geochartView = null;

  var column = 4;
  function drawRegionsMap() {
    // Learing query
    var foo = [
      ['Nombre', 'Valor1', 'Valor2', 'Pais'],
      ['Pepe', 50, 80, 'Colombia'],
      ['Ronaldo', 75, 99, 'Colombia'],
      ['Mesi', 33, 52, 'Argentina'],
      ['Radamel', 80, 30, 'Colombia']
    ]
    var dummyData = google.visualization.arrayToDataTable(foo);
    table = new google.visualization.Table(document.getElementById('table'));
    tableOptions = {};

    // https://developers.google.com/chart/interactive/docs/examples
    var view = new google.visualization.DataView(dummyData);
    view.setColumns([0, 1, 3]);
    console.log(dummyData);
    view.setRows(view.getFilteredRows([{column: 2, value: 'Colombia'}]));
    view.setColumns([0, 1]);
    //table.draw(view, tableOptions);
    
    // Adds tittles to the dataset for make it usable for arrayToDatable
    // Iterates over the visits of all the dates
    for (let i = 0; i < visitantes.length; i++)
    {
      // Fix departments names adding them lating chars
      // Iterates over all the departments
      for (let j = 0; j < visitantes[i].departamentos.length; j++) {
        // Selects the first column (the name of the department)
        let originalName = visitantes[i].departamentos[j][0];
        visitantes[i].departamentos[j][0] = App.getNameWithLatinChars(originalName);
      }

      // Adds a title to the department visits table
      // unshift() adds elements to the beginning of the 'departamentos' array
      visitantes[i].departamentos.unshift(['Departamento', 'Terrestres', 'Nacionales aereos', 'Internacionales aereos', 'Visitantes totales']);

      // Adds title to the 'municipio' visits table
      visitantes[i].municipios.unshift(['Municipio', 'Terrestres', 'Nacionales aereos', 'Internacionales aereos', 'Visitantes totales']);
    }

    // Nota: El nombre de los departamentos es sensible a tildes
    // NOTA: El nombre de los departamentos no es sensible a mayusculas
    data = google.visualization.arrayToDataTable(visitantes[0].departamentos);

    geochartView = new google.visualization.DataView(data);
    geochartView.setColumns([0, column]); // Selects 'Nombre departamento' and 'Visitas totales' from the table
    //table.draw(geochartView, tableOptions);    
    console.log(visitantes[0].departamentos);

    options = {
      region: 'CO', // A country, specified by its ISO 3166-1 alpha-2 
      displayMode: 'regions',
      resolution: 'provinces', // Like 'departamentos'
      // Colors
      /*backgroundColor: '#81d4fa',*/ // A soft blue
      /*datalessRegionColor: '#f5f5f5',*/ // color for the other contries
      colorAxis: {colors: ['#f1f8e9', '#7cb342']}
    };

    chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    /* Draws the initial map information */
    chart.draw(geochartView, options);
    table.draw(data, tableOptions);

    // Register callback for region click
    google.visualization.events.addListener(chart, 'select', function () {
      var selection = chart.getSelection();
      if (selection.length > 0) {
        console.log(data.getValue(selection[0].row, 0) + ' selected!');
      }
    });
  }

  var output = document.getElementById('output');
  // Show the date of the first date
  output.innerHTML = `Fecha actual: ${visitantes[0].date}`;

  // Get slider
  var dateSlider = document.getElementById('dateSlider');
  // Sets the slider range according to the dataset length
  dateSlider.min = 0;
  dateSlider.max = visitantes.length - 1; // The index of the last element
  dateSlider.oninput = function () { // Callback called when slider value changes
    output.innerHTML = `Fecha actual: ${visitantes[this.value].date}`;

    // Checks the chart is initialized
    if (!isChartInitialized()) {
      return;
    }

    // Rebuild DataTable
    data = google.visualization.arrayToDataTable(visitantes[this.value].departamentos);
    geochartView = new google.visualization.DataView(data);
    geochartView.setColumns([0, column]); // Selects 'Nombre departamento' and 'Visitas totales' from the table

    chart.draw(geochartView, options);
    table.draw(data, tableOptions);

  }

  $(window).resize(function () {
    if (!isChartInitialized()) {
      return;
    }

    chart.draw(geochartView, options);
  });

  function isChartInitialized() {
    // Checks chart has been defined
    if (chart == null) {
      return false;
    }

    // Checks the options has been defined
    if (options == null) {
      return false;
    }

    // Checks the view is initialized
    if (geochartView == null)
    {
      return false;
    }

    return true;
  }
});

