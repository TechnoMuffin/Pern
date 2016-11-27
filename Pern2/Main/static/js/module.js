////Variables globales
var txtModuleName = $('#txtModuleName');
var createModulo = $('#createModulo');
var cbxCourse = $('#cbxCourse');
var cbxModule = $('#cbxModule');
var moduleTable = $('#moduleTable');
var allDeleteBtnModule = $('.deleteModule');
var cbxCourseFilter = $('#cbxCourseFilter');
var btnModuleDeleter = $('#btnModuleDeleter');
var editModal = $('#editModal')
var txtNewModuleName = $('#txtNewModuleName')
var cbxNewCourse = $('#cbxNewCourse')
var btnModuleUpdater = $('#btnModuleUpdater')
var currentModuleId;

////Asignacion de Funciones
createModulo.on('click', function() {
    createModule()
});
btnModuleDeleter.on('click', function() {
    deleteModule()
});
btnModuleUpdater.on('click', function() {
    updateModule()
});

cbxCourseFilter.on('change', function() {
    refreshModules(cbxCourseFilter.val())
});

$(document).on('click', '.deleteModule', function() {
    currentModuleId = $(this).data('module-id');
    $('#deleteModal').modal('show');
});
$(document).on('click', '.editModule', function() {
    currentModuleId = $(this).data('module-id');
    $('#editModal').modal('show');
});

////Funciones reales
function updateModule() {
    if (txtNewModuleName.val() != '' && cbxNewCourse.val() != '') {
        $.ajax({
            url: urlModule,
            type: 'GET',
            data: {
                idModule: currentModuleId,
                newName: txtNewModuleName.val(),
                newCourse: cbxNewCourse.val(),
                queryId: 'updateModule'
            },
            success: function() {
                refreshModules(cbxCourseFilter.val());
                txtNewModuleName.val('');
                cbxNewCourse.val('');
                cbxNewCourse.selectpicker('refresh');
            }
        });
    }
}

function deleteModule() {
    $.ajax({
        url: urlModule,
        type: 'GET',
        data: {
            idModule: currentModuleId,
            queryId: 'deleteModule'
        },
        success: function() {
            console.log('Modulo Eliminado');
            refreshModules(cbxCourseFilter.val());
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
                $('#correctModal').modal('show');
                cbxCourse.val('0');
                cbxCourse.selectpicker('refresh');
                txtModuleName.val('');
                refreshModules(cbxCourseFilter.val());
            }
        });
    } else {
        $('#incorrectModal').modal('show');
    }
}

function refreshModules(extraFilter = '') {
    $.ajax({
        url: urlModule,
        type: 'GET',
        data: {
            idCourse: '' + extraFilter,
            queryId: 'allModules'
        },
        dataType: 'json',
        success: function(info) {
            resetCbx(cbxModule, 'Módulos');
            resetTable(moduleTable);
            for (var i = 0; i < info.length; i++) {
                var nameModule = info[i].fields.nameModule;
                var course = info[i].fields.idCourse[0] + 'º ' + info[i].fields.idCourse[1];
                var moduleId = info[i].pk

                var element = '<tr><td>' + nameModule + '</td><td>' + course +
                    '</td><td><div class="btn-group pull-right" role="group">' +
                    '<button type="button" class="btn btn-default btn-sm deleteModule" data-module-id="' + moduleId + '">' +
                    '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>' +
                    '<button type="button" class="btn btn-default btn-sm editModule" data-module-id="' + moduleId + '">' +
                    '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
                    '</button></div></td></tr>'
                moduleTable.append(element);
                cbxModule.append(new Option(nameModule, moduleId));
            }
            cbxModule.selectpicker('refresh');
        }
    });
}
