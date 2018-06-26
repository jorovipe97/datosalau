$(function () { // This is called by jquery when document is loaded

  // Colombian heatmap example: http://www.danielpinero.com/como-crear-mapa-calor-colombia
  google.charts.load('current', {
    'packages':['geochart'],
    // Note: you will need to get a mapsApiKey for your project.
    // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
    'mapsApiKey': 'AIzaSyAaxlmWR-_VWkr1qrFIOUurltV6EvulMLo'
  });
  google.charts.setOnLoadCallback(drawRegionsMap);


  // The data used to render the map
  var data = null;
  // Options used for render the geochart
  var options = null;
  // Chart object
  var chart = null;
  function drawRegionsMap() {
    // Nota: El nombre de los departamentos es sensible a tildes
    // NOTA: El nombre de los departamentos no es sensible a mayusculas
    data = google.visualization.arrayToDataTable(visitantes[0].data);

    options = {
      region: 'CO', // A country, specified by its ISO 3166-1 alpha-2 
      displayMode: 'regions',
      resolution: 'provinces',
      // Colors
      /*backgroundColor: '#81d4fa',*/ // A soft blue
      /*datalessRegionColor: '#f5f5f5',*/ // color for the other contries
      colorAxis: {colors: ['#f1f8e9', '#7cb342']}
    };

    chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    /* Draws the initial map information */
    chart.draw(data, options);

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
  output.innerHTML = 'Visitantes departamentos colombia el: ' + visitantes[0].date;

  // Get slider
  var dateSlider = document.getElementById('dateSlider');
  // Sets the slider range according to the dataset length
  dateSlider.min = 0;
  dateSlider.max = visitantes.length - 1; // The index of the last element
  dateSlider.oninput = function () {
    output.innerHTML = 'Visitantes departamentos colombia el: ' + visitantes[this.value].date;

    if (!isChartIsInitialized()) {
      return;
    }

    data = google.visualization.arrayToDataTable(visitantes[this.value].data);
    chart.draw(data, options);
  }

  $(window).resize(function () {
    if (!isChartIsInitialized()) {
      return;
    }

    chart.draw(data, options);
  });

  function isChartIsInitialized() {
    // Checks chart has been defined
    if (chart == null) {
      return false;
    }

    // Checks the options has been defined
    if (options == null) {
      return false;
    }

    return true;
  }
});

