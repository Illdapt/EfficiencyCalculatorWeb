/**
 * Created by nicktuttle on 11/3/2016.
 */
$(document).ready(function() {
    var calcTable;
    var kwFinalCost;
    $.ajax({
        'url': 'https://query.yahooapis.com/v1/public/yql',
        'data': {
            'q': 'SELECT * FROM html WHERE url="http://files.server-rack-online.com/states2.json"',
            'format': 'json',
            'jsonCompat': 'new'
        },
        'dataType': 'jsonp',
        'success': function (data) {

            data = data.query.results.body;
            calcTable = $.parseJSON(data);

            loadStates();
            loadCountries();
            $('#kwCost1').val("0.0918");
        }

    }); // end ajax call and success: function(

    //Populate Country List
    function loadCountries() {
        var strCountry = "United States,Australia,Belgium,Brazil,Canada,China,Finland,France,Germany,Hong Kong,India,Indonesia,Ireland,Italy," +
            "Japan,Malaysia,Netherlands,Other,Philippines,Singapore,South Korea,Spain,Sweden,Switzerland,Taiwan,United Kingdom";
        strCountry = strCountry.split(',');
        $.each(strCountry, function (idx, val) {
            console.log(val);
            $('#countrySelect').append("<option value='" + val + "'> " + val + " </option>");
        });
    }

    function loadStates() {
        //  console.log(calcTable);
        $(calcTable.states).each(function (index, state) {
            $('#stateSelect1').append("<option value='" + state.stateValue + "'> " + state.stateName + " </option>");
            $(state).each(function (key, value) {
            })
        });
    }

    function process() {
        var countrySelect = $('#countrySelect').val();
        var stateSelect1 = $('#stateSelect1').val();
        var kwCost = $('#kwCost1').val();
        var curPUE = $('#curPUE').val();
        var desPUE = $('#desPUE').val();
        var totalIt = $('#totalIt1').val();
        var totalFac = totalIt * curPUE;
        var totalFac2 = totalIt * desPUE;
        var progBarResultCurPUE, progBarResultDesPUE;
        var elecTotal, elecTotal5yr, elecTotal10yr;
        var moneyTotal, moneyTotal5yr, moneyTotal10yr;
        var emissionTotal, emissionTotal5yr, emissionTotal10yr;
        var carTotal, carTotal5yr, carTotal10yr;
        var elecTotal2, moneyTotal2, emissionTotal2, carTotal2;
        var dcieResults1, dcieResults2;
        var finalElec, finalMoney, finalEmission, finalCar;
        var countryVal = $('#countrySelect').val();

        /* DO CALCULATIONS HERE*/
        dcieResults1 = totalIt / totalFac * 100;
        dcieResults2 = totalIt / totalFac2 * 100;
        progBarResultCurPUE = (100 - dcieResults1) + "%";
        progBarResultDesPUE = (100 - dcieResults2) + "%";
        elecTotal = totalFac * 8760;
        elecTotal2 = totalFac2 * 8760;
        moneyTotal = kwCost * elecTotal;
        moneyTotal2 = kwCost * elecTotal2;
        emissionTotal = (elecTotal * 1.21) / 2000;
        emissionTotal2 = (elecTotal2 * 1.21) / 2000;
        carTotal = emissionTotal / 5.30;
        carTotal2 = emissionTotal2 / 5.30;

        finalElec = elecTotal - elecTotal2;
        finalMoney = moneyTotal - moneyTotal2;
        finalEmission = emissionTotal - emissionTotal2;
        finalCar = carTotal - carTotal2;
        elecTotal5yr = finalElec * 5;
        elecTotal10yr = finalElec * 10;
        moneyTotal5yr = finalMoney * 5;
        moneyTotal10yr = finalMoney * 10;
        emissionTotal5yr = finalEmission * 5;
        emissionTotal10yr = finalEmission * 10;
        carTotal5yr = finalCar * 5;
        carTotal10yr = finalCar * 10;

        finalElec = numeral(finalElec).format('0,0.00');
        elecTotal5yr = numeral(elecTotal5yr).format('0,0.00');
        elecTotal10yr = numeral(elecTotal10yr).format('0,0.00');
        finalMoney = numeral(finalMoney).format('0,0.00');
        moneyTotal5yr = numeral(moneyTotal5yr).format('0,0.00');
        moneyTotal10yr = numeral(moneyTotal10yr).format('0,0.00');
        finalEmission = numeral(finalEmission).format('0,0.00');
        emissionTotal5yr = numeral(emissionTotal5yr).format('0,0.00');
        emissionTotal10yr = numeral(emissionTotal10yr).format('0,0.00');
        finalCar = numeral(finalCar).format('0,0');
        carTotal5yr = numeral(carTotal5yr).format('0,0');
        carTotal10yr = numeral(carTotal10yr).format('0,0');
        totalIt = numeral(totalIt).format('0,0.00');
        totalFac = numeral(totalFac).format('0,0.00');
        totalFac2 = numeral(totalFac2).format('0,0.00');

        /* PUSH RESULTS*/

        $('#pueBack1').animate({"width": progBarResultCurPUE}, "slide");
        $('#pueBack1 .progressbar').animate({backgroundColor: "#369"});
        $('#pueBack2').animate({"width": progBarResultDesPUE}, "slide");
        $('#pueBack2 .progressbar').animate({backgroundColor: "#369"});
        $('#totalIt2').text(totalIt + " kW");
        $('#totalFac2').text(totalFac + " kW");
        $('#totalIt3').text(totalIt + " kW");
        $('#totalFac3').text(totalFac2 + " kW");
        $('#elecTotal').text(finalElec);
        $('#elecTotal5yr').text(elecTotal5yr);
        $('#elecTotal10yr').text(elecTotal10yr);
        $('#emissionTotal').text(finalEmission);
        $('#emissionTotal5yr').text(emissionTotal5yr);
        $('#emissionTotal10yr').text(emissionTotal10yr);
        $('#carTotal').text(finalCar);
        $('#carTotal5yr').text(carTotal5yr);
        $('#carTotal10yr').text(carTotal10yr);

        if (countryVal == "United States" || countryVal == "Australia" || countryVal == "Canada" || countryVal == "Hong Kong" || countryVal == "Brazil" || countryVal == "Singapore") {
            $('#moneyTotal').text('$' + finalMoney);
            $('#moneyTotal5yr').text('$' + moneyTotal5yr);
            $('#moneyTotal10yr').text('$' + moneyTotal10yr);
            $('#currencyKW').html('$');
        }
        else if (countryVal == "Germany" || countryVal == "France" || countryVal == "Belgium" || countryVal == "Italy" || countryVal == "Finland" || countryVal == "Spain" || countryVal == "Ireland" || countryVal == "Sweden") {
            $('#moneyTotal').html('&euro;' + finalMoney);
            $('#moneyTotal5yr').html('&euro;' + moneyTotal5yr);
            $('#moneyTotal10yr').html('&euro;' + moneyTotal10yr);
            $('#currencyKW').html('&euro;');
        }
        else if (countryVal == "United Kingdom") {
            $('#moneyTotal').html('&pound;' + finalMoney);
            $('#moneyTotal5yr').html('&pound;' + moneyTotal5yr);
            $('#moneyTotal10yr').html('&pound;' + moneyTotal10yr);
            $('#currencyKW').html('&pound;');
        }
        else if (countryVal == "China" || countryVal == "Japan") {
            $('#moneyTotal').html('&yen;' + finalMoney);
            $('#moneyTotal5yr').html('&yen;' + moneyTotal5yr);
            $('#moneyTotal10yr').html('&yen;' + moneyTotal10yr);
            $('#currencyKW').html('&yen;');
        }
        else if (countryVal == "India") {
            $('#moneyTotal').html('&#x20B9;' + finalMoney);
            $('#moneyTotal5yr').html('&#x20B9;' + moneyTotal5yr);
            $('#moneyTotal10yr').html('&#x20B9;' + moneyTotal10yr);
            $('#currencyKW').html('&#x20B9;');
        }
        else if (countryVal == "Indonesia") {
            $('#moneyTotal').html('Rp ' + finalMoney);
            $('#moneyTotal5yr').html('Rp ' + moneyTotal5yr);
            $('#moneyTotal10yr').html('Rp ' + moneyTotal10yr);
            $('#currencyKW').html('Rp');
        }
        else if (countryVal == "Malaysia") {
            $('#moneyTotal').html('RM ' + finalMoney);
            $('#moneyTotal5yr').html('RM ' + moneyTotal5yr);
            $('#moneyTotal10yr').html('RM ' + moneyTotal10yr);
            $('#currencyKW').html('RM');
        }
        else if (countryVal == "Philippines") {
            $('#moneyTotal').html('&#x20b1;' + finalMoney);
            $('#moneyTotal5yr').html('&#x20b1;' + moneyTotal5yr);
            $('#moneyTotal10yr').html('&#x20b1;' + moneyTotal10yr);
            $('#currencyKW').html('&#x20b1;');
        }
        else if (countryVal == "South Korea") {
            $('#moneyTotal').html('&#x20a9;' + finalMoney);
            $('#moneyTotal5yr').html('&#x20a9;' + moneyTotal5yr);
            $('#moneyTotal10yr').html('&#x20a9;' + moneyTotal10yr);
            $('#currencyKW').html('&#x20a9;');
        }
        else if (countryVal == "Switzerland") {
            $('#moneyTotal').html('CHF ' + finalMoney);
            $('#moneyTotal5yr').html('CHF ' + moneyTotal5yr);
            $('#moneyTotal10yr').html('CHF ' + moneyTotal10yr);
            $('#currencyKW').html('CHF');
        }
        else {
            $('#moneyTotal').html(finalMoney);
            $('#moneyTotal5yr').html(moneyTotal5yr);
            $('#moneyTotal10yr').html(moneyTotal10yr);
            $('#currencyKW').html('$');
        }

        $(".resultChange").css("color", "#ff9933");
        setTimeout(function () {
            $(".resultChange").css("color", "#40494e");
        }, 600);
    }

    $(".pueOption").change(function () {
        var $this = this;
        if ($($this).prop('id') == "stateSelect1") {
            //alert("State Selector Change");
            kwFinalCost = $($this).prop("value");
            $('#kwCost1').val(kwFinalCost);
            if (($('#curPUE').val() > 0) && ($('#desPUE').val() > 0)) {
                process();
            }
        }
        if ($($this).prop('id') == "countrySelect") {
            //alert("Country Selector Change");
            if ($('#countrySelect').val() == "United States") {
                $('#stateSelect1').removeAttr('disabled');
            }
            else {
                $('#stateSelect1').attr('disabled', 'disabled');
            }
            process();

        }
        if ($($this).prop('id') == "curPUE") {
            //alert("Cur PUE Selector Change");
            if (($('#curPUE').val() >= 1) && ($('#desPUE').val() >= 1)) {
                process();
            }
        }
        if ($($this).prop('id') == "desPUE") {
            //alert("Des PUE Selector Change");
            if (($('#curPUE').val() >= 1) && ($('#desPUE').val() >= 1)) {
                process();
            }
        }
        if ($($this).prop('id') == "kwCost1") {
            //alert("kW Cost Selector Change");
            if (($('#curPUE').val() >= 1) && ($('#desPUE').val() >= 1)) {
                process();
            }
        }
        if ($($this).prop('id') == "totalIt1") {
            //alert("kW Cost Selector Change");
            if (($('#curPUE').val() >= 1) && ($('#desPUE').val() >= 1)) {
                process();
            }
        }
    });
})();

