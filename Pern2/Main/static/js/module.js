////Variables globales
var txtModuleName = $('#txtModuleName');
var createModulo = $('#createModulo');
var cbxCourse = $('#cbxCourse');
var cbxModule = $('#cbxModule')
var moduleTable = $('#moduleTable')
var allDeleteBtnModule = $('.deleteModule')

////Asignacion de Funciones
createModulo.on('click', function() {
    createModule()
});
$(document).on('click','.deleteModule',function(){
  deleteModule($(this))
});


////Funciones reales
function deleteModule(element) {
    var asd = element.data('module-id');
    console.log(asd);
    $.ajax({
        url: urlModule,
        type: 'GET',
        data: {
            idModule: asd,
            queryId: 'deleteModule'
        },
        success: function() {
            console.log('Modulo Eliminado');
            refreshModules();
        }
    });
}

function createModule() {
    if (txtModuleName.val() != '' && cbxCourse.val() != '') {
        $.ajax({
            url: urlModule,
            type: 'GET',
            data: {
                nameModule: txtModuleName.val(),
                course: cbxCourse.val(),
                queryId: 'newModule'
            },
            success: function() {
                console.log('Modulo creado');
                cbxCourse.val('0');
                cbxCourse.selectpicker('refresh');
                txtModuleName.val('');
                refreshModules();
            }
        });
    } else {
        alert('Por favor, complete los campos')
    }
}

function refreshModules() {
    resetCbx(cbxModule);
    resetTable(moduleTable);
    $.ajax({
        url: urlModule,
        type: 'GET',
        data: {
            queryId: 'allModules'
        },
        dataType: 'json',
        success: function(info) {
            for (var i = 0; i < info.length; i++) {
                var nameModule = info[i].fields.nameModule;
                var course = info[i].fields.idCourse[0] + 'º ' + info[i].fields.idCourse[1];
                var moduleId = info[i].pk

                var element = '<tr><td>' + nameModule + '</td><td>' + course +
                    '</td><td><button type="button" class="btn btn-default btn-sm deleteModule" data-module-id="'+moduleId+'">' +
                    '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button></td></tr>'
                moduleTable.append(element);
            }
        }
    });
}
