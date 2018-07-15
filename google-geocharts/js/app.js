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

  removeLatinCharsAndSpaces: function (original) {
    let changed = null;

    if (original === 'Distrito Capital de Bogotá'.toUpperCase()) {
      changed = 'BOGOTADC';
    }
    else if (original === 'Atlántico'.toUpperCase()) {
      changed = 'ATLANTICO';
    }
    else if (original === 'Bolívar'.toUpperCase()) {
      changed = 'BOLIVAR';
    }
    else if (original === 'Boyacá'.toUpperCase()) {
      changed = 'BOYACA';
    }
    else if (original === 'Caquetá'.toUpperCase()) {
      changed = 'CAQUETA';
    }
    else if (original === 'Córdoba'.toUpperCase()) {
      changed = 'CORDOBA';
    }
    else if (original === 'Chocó'.toUpperCase()) {
      changed = 'CHOCO';
    }
    else if (original === 'Guainía'.toUpperCase()) {
      changed = 'GUAINIA';
    }
    else if (original === 'La Guajira'.toUpperCase()) {
      changed = 'LAGUAJIRA';
    }
    else if (original === 'Nariño'.toUpperCase()) {
      changed = 'NARINO';
    }
    else if (original === 'Norte de Santander'.toUpperCase()) {
      changed = 'NORTEDESANTANDER';
    }
    else if (original === 'Quindío'.toUpperCase()) {
      changed = 'QUINDIO';
    }
    else if (original === 'San Andrés, Providencia y Santa Catalina'.toUpperCase()) {
      changed = 'ARCHIPIELAGODESANDRESYPROVIDENCIA';
    }
    else if (original === 'Valle del Cauca'.toUpperCase()) {
      changed = 'VALLEDELCAUCA';
    }
    else if (original === 'Vaupés'.toUpperCase()) {
      changed = 'VAUPES';
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
    'packages': ['geochart', 'table', 'corechart'],
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
  // Municipios data
  var municipiosData = null;
  let clickedDepartamento = null;


  // used for show total visits by department
  var geochartView = null;

  var lineChart = null;


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
      visitantes[i].departamentos.unshift(['Departamento', 'Terrestres', 'Nacionales aéreos', 'Internacionales aéreos', 'Visitantes totales']);

      // Adds title to the 'municipio' visits table
      visitantes[i].municipios.unshift(['Municipio', 'Terrestres', 'Nacionales aéreos', 'Internacionales aéreos', 'Visitantes totales', 'Departamento']);
    }


    municipiosData = google.visualization.arrayToDataTable(visitantes[0].municipios);
    table = new google.visualization.Table(document.getElementById('table'));
    tableOptions = {};    


    // Nota: El nombre de los departamentos es sensible a tildes
    // NOTA: El nombre de los departamentos no es sensible a mayusculas
    data = google.visualization.arrayToDataTable(visitantes[0].departamentos);

    geochartView = new google.visualization.DataView(data);
    geochartView.setColumns([0, column]); // Selects 'Nombre departamento' and 'Visitas totales' from the table
    //table.draw(geochartView, tableOptions);    
    // console.log(visitantes[0].departamentos);

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

    // Instantiates the line chart
    lineChart = new google.visualization.LineChart(document.getElementById('line_chart'));


    // Register callback for region click
    google.visualization.events.addListener(chart, 'select', function () {
      var selection = chart.getSelection();
      if (selection.length > 0) {
        // Gets the name of the selected departamento
        clickedDepartamento = data.getValue(selection[0].row, 0);
        // console.log(clickedDepartamento + ' selected!');

        $('.departamento-name').html(clickedDepartamento);

        // https://developers.google.com/chart/interactive/docs/examples
        var tableView = new google.visualization.DataView(municipiosData);
        tableView.setColumns([0, 1, 2, 3, 4, 5]);
        // console.log(dummyData);
        tableView.setRows(tableView.getFilteredRows([{column: 5, value: App.removeLatinCharsAndSpaces(clickedDepartamento)}]));
        tableView.setColumns([0, 1, 2, 3, 4]);
        //table.draw(view, tableOptions);
        table.draw(tableView, tableOptions);

        var timeSeries = [];
        // Generating TIME SERIES for departamentos for each date
        // Iterating over each date
        for (let i = 0; i < visitantes.length; i++) {
          let obj = visitantes[i];
          let date = obj.date;

          let timeSlice = [];
          
          // Iterating over each department
          for (let j = 0; j < obj.departamentos.length; j++) {
            // Gets the data of the clicked department
            if (obj.departamentos[j][0] === clickedDepartamento) {
              // Copies the data array for this departamento in the current time
              timeSlice = obj.departamentos[j].slice();

              // Removes the first item from the array (the 'departamento' column)
              timeSlice.shift();
              // Removes total column
              timeSlice.pop();

              // Converts date string to date object
              let dateSplit = date.split("-");
              // Date month starts at 0 not at 1.
              let dateObj = new Date(parseInt(dateSplit[0]), parseInt(dateSplit[1])-1, 1);

              // Adds the date to timeSlice data
              timeSlice.unshift(i);

              // Adds time slice to time serie
              timeSeries.push(timeSlice);


              // Exits of the inner for loop
              break;
            }
          }
        }

        // Adds column names to the time series array
        timeSeries.unshift(['Fecha', 'Terrestres', 'Nacionales aéreos', 'Internacionales aéreos'])
        // console.log(timeSeries);

        var lineChartOptions = {
          title: 'Serie de tiempo',
          legend: { position: 'bottom' },
          width: 720,
          height: 480          
        };
        lineChartOptions.title = `Visitantes por medio de transporte en ${clickedDepartamento}`;

        // Creates a data table from the array generated
        lineChartDataTable = google.visualization.arrayToDataTable(timeSeries);

        // Draw the time series
        lineChart.draw(lineChartDataTable, lineChartOptions);

        // Checks the element has the visible class
        if ($('#tip-click').hasClass('visible'))
        {
          // Removes tip about click over departamento
          $('#tip-click').removeClass('visible');
        }

        // Animates scroll until details https://www.abeautifulsite.net/smoothly-scroll-to-an-element-without-a-jquery-plugin-2
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#details").offset().top
        }, 600);
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


    municipiosData = google.visualization.arrayToDataTable(visitantes[this.value].municipios);
    // https://developers.google.com/chart/interactive/docs/examples
    var tableView = new google.visualization.DataView(municipiosData);
    tableView.setColumns([0, 1, 2, 3, 4, 5]);
    // console.log(dummyData);
    tableView.setRows(tableView.getFilteredRows([{column: 5, value: App.removeLatinCharsAndSpaces(clickedDepartamento)}]));
    tableView.setColumns([0, 1, 2, 3, 4]);
    //table.draw(view, tableOptions);
    table.draw(tableView, tableOptions);

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

  $('#up-button').click(function () {
    // Animates scroll until details https://www.abeautifulsite.net/smoothly-scroll-to-an-element-without-a-jquery-plugin-2
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#dashboard").offset().top
    }, 600);
  });

  $('#goto-datasets-btn').bind('click', function () {
    // Animates scroll until details https://www.abeautifulsite.net/smoothly-scroll-to-an-element-without-a-jquery-plugin-2
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#used-datasets").offset().top
    }, 600);
  });
});

