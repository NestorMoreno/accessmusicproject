var accion= 0, notacion = '', userId = '', instrumento = 'PIANO', tempo = '120';
var ajaxFunctions = {
    generarMIDI: function () {
        // Va al servidor
        $.post('GenerarMidi', {
            accion: accion,
            notacion: notacion,
            instrumento: instrumento,
            tempo: tempo
        }, function (responseText) {
            $('#tabla').html(responseText);
            userId = responseText;
            MIDIjs.play(userId + '.mid');
            $("#identificador").val(userId);
            $("#fknp").val("");
        });
    }
};
var metodos = {
    validarNotacion: function () {
        notacion = $('#notacion').val().trim();
        if (notacion !== '') {
            var arrNotacion = notacion.split(' ');
            var esCorrecto = true;
            var palabrasIncorrectas = '';
            for (var i = 0; i < arrNotacion.length; i++) {
                if (arrNotacion[i] !== '' && !metodos.verificarPalabra(arrNotacion[i])) {
                    palabrasIncorrectas = palabrasIncorrectas + " " + arrNotacion[i];
                    esCorrecto = false;
                }
            }
            if (esCorrecto) {
                instrumento = $('#instrument').val();
                tempo = $('#tempo').val();
                return true;
            }
            else {
                alert('Las palabras: ' + palabrasIncorrectas + ' no tiene el formato correcto.');
                return false;
            }
        }
        else {
            alert('Por favor ingresa un texto.');
        }
    },
    verificarPalabra: function (palabra) {
        // Solo una nota
        if (palabra.length === 1) {
            var patt = /^[a-grR]/i;
            return patt.test(palabra);
        }
        // Nota con un sostenido, un bemol, un número de octava o un valor de tiempo de nota
        else if (palabra.length === 2) {
            var patt = /^[a-grR][#|b|B|0-9|w|h|q|i|s|t|x|o]/i;
            return patt.test(palabra);
        }
        // Nota con dos sostenidos, dos bemoles, número de octava o valor de tiempo de nota
        else if (palabra.length === 3) {
            var patt = /^[a-grR][#|b|0-9|w|h|q|i|s|t|x|o]+[#|b|0-9|w|h|q|i|s|t|x|o]/i;
            return patt.test(palabra);
        }
        else if (palabra.length === 4) {
            var patt = /^[a-grR]maj|min|aug|dim|[#|b|0-9|w|h|q|i|s|t|x|o]+[#|b|0-9|w|h|q|i|s|t|x|o]/i;
            return patt.test(palabra);
        }
        else if (palabra.length === 5) {
            var patt = /^[a-grR]dom7|maj7|min7|sus4|sus2|maj6|min6|dom9|maj9|min9|dim7|add9|[#|b|0-9|w|h|q|i|s|t|x|o]/i;
            return patt.test(palabra);
        }
        else if (palabra.length === 6) {
            var patt = /^[a-grR]min11|dom11|dom13|min13|maj13|[#|b|0-9|w|h|q|i|s|t|x|o]/i;
            return patt.test(palabra);
        }
        else if (palabra.length === 7) {
            var patt = /^[a-grR]min11|dom11|dom13|min13|maj13|[#|b|0-9|w|h|q|i|s|t|x|o]/i;
            return patt.test(palabra);
        }
        return false;
    },
    getAbsolutePath: function () {
        var loc = window.location;
        var href = loc.href.replace('#', '');
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf("/") + 1);
        return loc.href.substring(0, href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
    },
    detenerSonido: function () {
        MIDIjs.stop();
    }
};

$(document).ready(function () {
    $(document).keydown(function(e) {
        if (e.keyCode === 81 && e.ctrlKey) {
            //ctrl+q
            if (metodos.validarNotacion(notacion)) {
                accion = 1;
                ajaxFunctions.generarMIDI();
                $('#notacion').focus();
            } 
        }
        if (e.keyCode === 66 && e.ctrlKey) {
            //ctrl+b
            metodos.detenerSonido();
            $('#notacion').focus();
        }
    });
    $('body').keyup(function (e) {
        if (e.keyCode === 8) {
            // backspace
        }
        if (e.keyCode === 13) {
            // pressed enter
            metodos.validarNotacion();
        }
        if (e.keyCode === 32) {
            // space
            metodos.validarNotacion();
        }
    });
    $('#submit').click(function () {
        if (metodos.validarNotacion(notacion)) {
            accion = 1;
            ajaxFunctions.generarMIDI();
        }        
    });
    $("#desgercarMidi").click(function () {
        var archivo = $("#identificador").val();
        window.location.replace( metodos.getAbsolutePath()+ archivo + ".mid");
    });
    $("#descargarPdf").click(function () {
        var notacion = $('#notacion').val();

//         var identificador=$("#identificador").val();
//         $("#accion").val("3");
//             window.open("http://localhost:8080/AccesMusicServlet/" + identificador + ".pdf");
//          $( "#formAcces" ).submit();
        $.post('GenerarMidi', {
            accion: '3',
            notacion: notacion
        }, function (responseText) {
            $("#identificador").val(responseText);
            $('#tabla').html(responseText);
            window.open(metodos.getAbsolutePath()+ responseText + ".pdf");
        });
        var archivo = $("#identificador").val();
        //window.open(metodos.getAbsolutePath()+ archivo + ".pdf");
    });

    $("#fknp").mouseover(function () {
        $("#fknp").val("");
    });

    $('#descargarBraille').click(function () {
        notacion = $('#notacion').val();
        accion = 2;
        ajaxFunctions.generarMIDI();
    });

    $("#Stop").click(function () {
        metodos.detenerSonido();
    });
});